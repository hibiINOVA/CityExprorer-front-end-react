import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword, resetPassword } from '../services/api';
import { colors, typography, spacing, radius } from '../theme/theme';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function RestablecerScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const iniciarContador = (segundos) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeRemaining(segundos);
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          Alert.alert(
            'Tiempo agotado',
            'El tiempo para ingresar el código ha caducado.',
            [{ text: 'OK', onPress: () => navigation.navigate('InicioSesion') }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const enviarCorreo = async () => {
    if (!correo.trim()) {
      Alert.alert('Datos requeridos', 'Ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(correo.trim());
      Alert.alert('Código enviado', res.message || 'Revisa tu correo.');
      const minutos = res.expires_in_minutes || 15;
      setStep(2);
      iniciarContador(minutos * 60);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo enviar el código. Verifica tu correo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const cambiarClave = async () => {
    if (!codigo.trim()) {
      Alert.alert('Atención', 'Ingresa el código de verificación.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atención', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Atención', 'Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({
        correo: correo.trim(),
        code: codigo.trim(),
        password,
        password_confirmation: confirmPassword,
      });
      Alert.alert('¡Éxito!', res.message || 'Contraseña actualizada correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('InicioSesion') },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Error al restablecer la contraseña.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>Restablecer Contraseña</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {step === 1 ? '¿Olvidaste tu contraseña?' : step === 2 ? 'Ingresa el código' : 'Nueva contraseña'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Te enviaremos un código de verificación a tu correo.'
              : step === 2
              ? `Enviamos un código a ${correo || 'tu correo'}.`
              : 'Elige una nueva contraseña para tu cuenta.'}
          </Text>
        </View>

        {step === 1 ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>
            <Pressable style={styles.button} onPress={enviarCorreo} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.form}>
            <View style={styles.countdownBox}>
              <Ionicons name="timer-outline" size={18} color={colors.primary} />
              <Text style={styles.countdownText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.countdownHint}>para ingresar el código</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código de verificación</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                maxLength={6}
                value={codigo}
                onChangeText={setCodigo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeButtonText}>{showPassword ? 'Ocultar' : '👁'}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowConfirm(!showConfirm)}>
                  <Text style={styles.eyeButtonText}>{showConfirm ? 'Ocultar' : '👁'}</Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.button} onPress={cambiarClave} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'GUARDANDO...' : 'RESTABLECER CONTRASEÑA'}
              </Text>
            </Pressable>

            <Pressable style={styles.resendButton} onPress={enviarCorreo} disabled={loading}>
              <Text style={styles.resendText}>¿No llegó el código? Reenviar</Text>
            </Pressable>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  titleContainer: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  eyeButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  countdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  countdownText: {
    ...typography.h3,
    fontSize: 20,
    color: colors.primary,
  },
  countdownHint: {
    ...typography.caption,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resendText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  spinner: {
    marginTop: spacing.sm,
  },
});