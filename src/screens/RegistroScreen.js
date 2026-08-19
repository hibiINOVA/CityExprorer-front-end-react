import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '../store/AuthContext';
import ScreenContainer from '../components/common/ScreenContainer';
import AppText from '../components/common/AppText';
import AppButton from '../components/common/AppButton';
import InputField from '../components/common/InputField';
import PasswordField from '../components/common/PasswordField';
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
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

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
    if (!aceptaTerminos) {
      Alert.alert(
        'Acepta los Términos',
        'Para crear tu cuenta debes aceptar los Términos y Condiciones y la Política de Privacidad.'
      );
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
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
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
          <AppText variant="h1" style={styles.title}>¡Hola!</AppText>
          <AppText variant="body" style={styles.subtitle}>Crea una nueva cuenta</AppText>
        </View>

        {/* Foto de Perfil Picker */}
        <View style={styles.photoPickerContainer}>
          <View style={styles.avatarContainer}>
            {form.foto_perfil ? (
              <Image source={{ uri: form.foto_perfil }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={54} color={colors.text.secondary} />
            )}
          </View>
          <Pressable style={styles.photoButton} onPress={pickImage}>
            <Ionicons name="camera" size={16} color={colors.text.inverse} style={styles.photoIcon} />
            <AppText style={styles.photoButtonText}>Seleccionar Foto</AppText>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField label="Nombre(s) *" placeholder="Tu nombre" value={form.nombre} onChangeText={update('nombre')} />
          <InputField label="Apellido paterno *" placeholder="Apellido paterno" value={form.apellidoP} onChangeText={update('apellidoP')} />
          <InputField label="Apellido materno" placeholder="Apellido materno (opcional)" value={form.apellidoM} onChangeText={update('apellidoM')} />
          <InputField
            label="Correo electrónico *"
            placeholder="ejemplo@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.correo}
            onChangeText={update('correo')}
          />
          <PasswordField label="Contraseña *" placeholder="••••••••" value={form.password} onChangeText={update('password')} />

          <Pressable style={styles.termsRow} onPress={() => setAceptaTerminos((v) => !v)}>
            <Ionicons
              name={aceptaTerminos ? 'checkbox' : 'square-outline'}
              size={22}
              color={colors.brand.primary}
            />
            <AppText variant="caption" style={styles.termsText}>
              He leído y acepto los{' '}
              <AppText
                variant="caption"
                style={styles.link}
                onPress={() => navigation.navigate('Terminos')}
              >
                Términos y Condiciones
              </AppText>{' '}
              y la{' '}
              <AppText
                variant="caption"
                style={styles.link}
                onPress={() => navigation.navigate('Privacidad')}
              >
                Política de Privacidad
              </AppText>
              .
            </AppText>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <AppButton title={loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'} onPress={handleSubmit} loading={loading} />

          <Pressable style={styles.loginLink} onPress={() => navigation.navigate('InicioSesion')}>
            <AppText style={styles.loginLinkText}>
              ¿Ya tienes cuenta? <AppText style={styles.loginBoldText}>Inicia sesión</AppText>
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scrollView: {
    flexGrow: 1,
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
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 30,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  photoPickerContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.base,
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
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  photoIcon: {
    marginRight: 6,
  },
  photoButtonText: {
    color: colors.text.inverse,
    fontWeight: 'bold',
    fontSize: 14,
  },
  form: {
    gap: spacing.md,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
  },
  link: {
    color: colors.brand.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loginBoldText: {
    color: colors.brand.primary,
    fontWeight: 'bold',
  },
});