import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useAuthContext } from '../store/AuthContext';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function IniciarRegistroScreen({ navigation }) {
  const { guestLogin } = useAuthContext();

  return (
    <ImageBackground
      source={require('../../assets/welcome_background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🌎 City Explorer</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.titleText}>City Explorer</Text>
          <Text style={styles.subtitleText}>
            Guarda tus rincones favoritos y personaliza tu aventura urbana con nuestra guía curada.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('InicioSesion')}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Registro')}
          >
            <Text style={styles.secondaryButtonText}>Registrarse</Text>
          </Pressable>
        </View>

        <Pressable style={styles.guestButton} onPress={guestLogin}>
          <Text style={styles.guestButtonText}>Navegar como invitado →</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(247, 242, 238, 0.82)', // Warm cream overlay to fade the background
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    marginTop: spacing.xl,
  },
  logoText: {
    fontSize: 20,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  welcomeText: {
    ...typography.h2,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
  },
  titleText: {
    ...typography.h1,
    fontSize: 36,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  subtitleText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    width: '100%',
  },
  secondaryButtonText: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  guestButton: {
    marginBottom: spacing.md,
    padding: spacing.sm,
  },
  guestButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
});
