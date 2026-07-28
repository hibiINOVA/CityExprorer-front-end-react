import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuthContext } from '../store/AuthContext';
import { useNavigation } from '@react-navigation/native';

/**
 * RequireAuth - HOC que intercepta componentes o pantallas
 * y requiere que el usuario esté autenticado.
 * Si es un invitado (isGuest = true), muestra un mensaje
 * y un botón para forzar el inicio de sesión.
 */
export default function RequireAuth({ children }) {
  const { isGuest, logout } = useAuthContext();

  if (isGuest) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acceso Restringido</Text>
        <Text style={styles.message}>
          Debes iniciar sesión para acceder a esta función. Únete a CityExplorer para disfrutar de todas las herramientas.
        </Text>
        <Pressable 
          style={styles.button} 
          onPress={() => {
            // El logout limpia isGuest=false y el estado de la sesión,
            // lo que forzará al AuthStack a mostrar el LoginScreen.
            logout().catch(() => {});
          }}
        >
          <Text style={styles.buttonText}>Ir a Iniciar Sesión</Text>
        </Pressable>
      </View>
    );
  }

  // Si no es invitado, renderizamos el contenido protegido
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FCF8F5'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3D3836',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#A74229',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
