import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuthContext } from '../store/AuthContext';

// TODO(diseño/UI): reemplazar con el mockup real de Figma.
// Esta pantalla solo deja la lógica de navegación/auth lista para probar.
export default function IniciarRegistroScreen({ navigation }) {
  const { guestLogin } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CityExplorer</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('InicioSesion')}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondary]} onPress={guestLogin}>
        <Text style={styles.buttonText}>Navegar como Invitado</Text>
      </Pressable>

      {/* TODO: validación de TOS/Privacidad antes de continuar */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32 },
  button: { backgroundColor: '#A74229', padding: 14, borderRadius: 8, width: '100%' },
  secondary: { backgroundColor: '#3D3836' },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
});
