import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../store/AuthContext';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function InicioSesionScreen({ navigation }) {
  const { login } = useAuthContext();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!correo || !password) {
      Alert.alert('Datos requeridos', 'Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await login(correo, password);
    } catch (error) {
      console.log('Error de login:', error);
      const serverMessage = error.response?.data?.mensaje || error.response?.data?.message;
      Alert.alert('Error de Iniciar Sesión', serverMessage || 'Credenciales incorrectas o problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerText}>City Explorer</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>¡Hola de nuevo!</Text>
          <Text style={styles.subtitle}>Nos alegra verte de regreso en San Miguel.</Text>
        </View>

        {/* Form */}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
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

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'INICIAR SESIÓN'}</Text>
          </Pressable>

          <Pressable style={styles.registerLink} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.registerLinkText}>
              ¿No tienes cuenta? <Text style={styles.registerBoldText}>Regístrate</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    marginTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  titleContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    marginTop: 'auto', // Push it to the bottom
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  registerLinkText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerBoldText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
