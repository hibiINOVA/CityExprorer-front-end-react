import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import ScreenContainer from '../components/common/ScreenContainer';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import InputField from '../components/common/InputField';
import PasswordField from '../components/common/PasswordField';
import { colors, typography, spacing } from '../theme/theme';

export default function InicioSesionScreen({ navigation }) {
  const { login } = useAuthContext();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <ScreenContainer style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.brand.primary} />
        </Pressable>
        <AppText style={styles.headerText}>City Explorer</AppText>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <AppText variant="h1" style={styles.title}>¡Hola de nuevo!</AppText>
        <AppText variant="body" style={styles.subtitle}>
          Nos alegra verte de regreso en San Miguel.
        </AppText>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <InputField
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <PasswordField
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('Restablecer')}
        >
          <AppText variant="caption" style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </AppText>
        </Pressable>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <AppButton title={loading ? 'ENTRANDO...' : 'INICIAR SESIÓN'} onPress={handleSubmit} loading={loading} />

        <Pressable style={styles.registerLink} onPress={() => navigation.navigate('Registro')}>
          <AppText style={styles.registerLinkText}>
            ¿No tienes cuenta? <AppText style={styles.registerBoldText}>Regístrate</AppText>
          </AppText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  headerText: {
    fontSize: 18,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.brand.primary,
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
    fontSize: 32,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    color: colors.brand.primary,
    fontWeight: '600',
  },
  actions: {
    marginTop: 'auto', // Push it to the bottom
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  registerLinkText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registerBoldText: {
    color: colors.brand.primary,
    fontWeight: 'bold',
  },
});