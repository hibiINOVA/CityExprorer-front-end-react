import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '../store/AuthContext';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function RegistroScreen({ navigation }) {
  const { register } = useAuthContext();
  const [form, setForm] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    password: '',
    foto_perfil: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const pickImage = async () => {
    // Solicitar permisos de galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar una foto.');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setForm((prev) => ({ ...prev, foto_perfil: selectedUri }));
      }
    } catch (e) {
      console.log('Error picking image:', e);
      Alert.alert('Error', 'No se pudo abrir la galería de fotos.');
    }
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellidoP || !form.correo || !form.password) {
      Alert.alert('Datos requeridos', 'Por favor llena los campos obligatorios (*).');
      return;
    }
    setLoading(true);
    try {
      await register(form); // AuthContext fuerza id_rol = 1
    } catch (error) {
      console.log('Error de registro:', error);
      if (error.response) {
        console.log('Datos del error del servidor:', error.response.data);
        const serverMessage = error.response.data?.mensaje || error.response.data?.message;
        const validationErrors = error.response.data?.errores;
        let detailedError = serverMessage || 'No se pudo completar el registro.';
        if (validationErrors) {
          detailedError += '\n' + Object.values(validationErrors).flat().join('\n');
        }
        Alert.alert('Error de Registro', detailedError);
      } else {
        Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
            <Text style={styles.title}>¡Hola!</Text>
            <Text style={styles.subtitle}>Crea una nueva cuenta</Text>
          </View>

          {/* Foto de Perfil Picker */}
          <View style={styles.photoPickerContainer}>
            <View style={styles.avatarContainer}>
              {form.foto_perfil ? (
                <Image source={{ uri: form.foto_perfil }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={54} color="#C4B4AB" />
              )}
            </View>
            <Pressable style={styles.photoButton} onPress={pickImage}>
              <Ionicons name="camera" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.photoButtonText}>Seleccionar Foto</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre(s) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textSecondary}
                value={form.nombre}
                onChangeText={update('nombre')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido paterno *</Text>
              <TextInput
                style={styles.input}
                placeholder="Apellido paterno"
                placeholderTextColor={colors.textSecondary}
                value={form.apellidoP}
                onChangeText={update('apellidoP')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido materno</Text>
              <TextInput
                style={styles.input}
                placeholder="Apellido materno (opcional)"
                placeholderTextColor={colors.textSecondary}
                value={form.apellidoM}
                onChangeText={update('apellidoM')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.correo}
                onChangeText={update('correo')}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={update('password')}
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeButtonText}>{showPassword ? 'Ocultar' : '👁'}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}</Text>
            </Pressable>

            <Pressable style={styles.loginLink} onPress={() => navigation.navigate('InicioSesion')}>
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginBoldText}>Inicia sesión</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
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
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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
  photoPickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: '#FDFBF7', // Cream light background
    borderWidth: 1.5,
    borderColor: '#E5DFD9', // border
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.xl,
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
  actions: {
    marginTop: 'auto',
    gap: spacing.md,
    paddingTop: spacing.md,
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
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginLinkText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginBoldText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
