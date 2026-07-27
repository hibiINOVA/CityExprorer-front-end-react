import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuthContext } from '../store/AuthContext';

// TODO(diseño/UI): reemplazar con el mockup real de Figma.
export default function RegistroScreen() {
  const { register } = useAuthContext();
  const [form, setForm] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(form); // AuthContext fuerza id_rol = 1
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={update('nombre')} />
      <TextInput style={styles.input} placeholder="Apellido paterno" value={form.apellidoP} onChangeText={update('apellidoP')} />
      <TextInput style={styles.input} placeholder="Apellido materno" value={form.apellidoM} onChangeText={update('apellidoM')} />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.correo}
        onChangeText={update('correo')}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.password}
        onChangeText={update('password')}
      />
      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#E5E0DC', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#A74229', padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
});
