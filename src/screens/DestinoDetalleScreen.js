import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO(equipo negocio): reemplazar con la pantalla real (Módulo 3/4 del documento).
// Este stub solo existe para que la navegación compile y sea probable de punta a punta.
export default function DestinoDetalleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>DestinoDetalle (pendiente: imágenes, descripción, rating)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: '#3D3836' },
});
