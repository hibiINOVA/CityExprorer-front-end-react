import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuthContext } from '../store/AuthContext';

// TODO(diseño/UI): esta pantalla la arma quien lleve Perfil/PerfilResumen.
// Aquí solo se deja el botón de logout para poder probar el diagrama de
// cierre de sesión completo (POST /logout -> limpiar SecureStore/AsyncStorage -> AuthStack).
export default function PerfilScreen() {
  const { userSession, isGuest, logout } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {isGuest ? (
        <Text style={styles.text}>Estás navegando como invitado. Regístrate para más opciones.</Text>
      ) : (
        <Text style={styles.text}>{userSession?.nombre ?? 'Usuario'}</Text>
      )}

      {!isGuest && (
        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold' },
  text: { color: '#3D3836', textAlign: 'center' },
  button: { backgroundColor: '#A74229', padding: 14, borderRadius: 8, paddingHorizontal: 24 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
