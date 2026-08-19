import React from 'react';
import { View, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useAuthContext } from '../store/AuthContext';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import { colors, typography, spacing } from '../theme/theme';

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
          <AppText style={styles.logoText}>🌎 City Explorer</AppText>
        </View>

        <View style={styles.contentContainer}>
          <AppText style={styles.welcomeText}>Bienvenido a</AppText>
          <AppText style={styles.titleText}>City Explorer</AppText>
          <AppText variant="body" style={styles.subtitleText}>
            Guarda tus rincones favoritos y personaliza tu aventura urbana con nuestra guía curada.
          </AppText>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AppButton title="Iniciar Sesión" onPress={() => navigation.navigate('InicioSesion')} />
            <AppButton title="Registrarse" variant="secondary" onPress={() => navigation.navigate('Registro')} />
          </View>

          <Pressable style={styles.guestButton} onPress={guestLogin}>
            <AppText style={styles.guestButtonText}>Navegar como invitado →</AppText>
          </Pressable>
        </View>
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
    color: colors.brand.primary,
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  welcomeText: {
    ...typography.h2,
    fontSize: 24,
    color: colors.text.primary,
    textAlign: 'center',
  },
  titleText: {
    ...typography.h1,
    fontSize: 36,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  subtitleText: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  bottomContainer: {
    width: '100%',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  guestButton: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  guestButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.brand.primary,
  },
});