import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RequireAuth from '../components/RequireAuth';
import { useAuthContext } from '../store/AuthContext';
import { getUsuario, updateUsuario, storageUrl } from '../services/api';
import { colors, typography, spacing, radius } from '../theme/theme';

const MAX_FOTO = 2 * 1024 * 1024; // 2 MB

function ModificarInfoForm({ navigation }) {
  const { userSession, updateUserSession } = useAuthContext();
  const idUsuario = userSession?.id_usuario;

  const [form, setForm] = useState({
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
  });
  const [foto, setFoto] = useState('');
  const [fotoActual, setFotoActual] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!idUsuario) return;
    (async () => {
      setLoading(true);
      try {
        const usuario = await getUsuario(idUsuario);
        setForm({
          nombre: usuario.nombre || '',
          apellidoP: usuario.apellidoP || '',
          apellidoM: usuario.apellidoM || '',
          correo: usuario.correo || '',
        });
        setFotoActual(usuario.foto_perfil || '');
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar tu información.');
      } finally {
        setLoading(false);
      }
    })();
  }, [idUsuario]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar una foto.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > MAX_FOTO) {
          Alert.alert('Imagen muy pesada', 'La foto debe ser menor a 2 MB.');
          return;
        }
        setFoto(asset.uri);
      }
    } catch (e) {
      console.log('Error picking image:', e);
      Alert.alert('Error', 'No se pudo abrir la galería de fotos.');
    }
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.apellidoP.trim()) {
      Alert.alert('Datos requeridos', 'Nombre y apellido paterno son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre.trim());
      formData.append('apellidoP', form.apellidoP.trim());
      formData.append('apellidoM', form.apellidoM.trim());

      if (foto) {
        const uriParts = foto.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('foto_perfil', {
          uri: foto,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const res = await updateUsuario(idUsuario, formData);
      const perfilActualizado = res?.data || userSession;
      await updateUserSession({
        ...userSession,
        ...perfilActualizado,
      });

      Alert.alert('¡Éxito!', 'Tu información fue actualizada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const serverMessage =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'Ocurrió un error al actualizar tu información.';
      Alert.alert('Error', serverMessage);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>Modificar Información</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.photoPickerContainer}>
              <View style={styles.avatarContainer}>
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.avatarImage} />
                ) : fotoActual ? (
                  <Image source={{ uri: storageUrl(fotoActual) }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={54} color="#C4B4AB" />
                )}
              </View>
              <Pressable style={styles.photoButton} onPress={pickImage}>
                <Ionicons name="camera" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.photoButtonText}>Cambiar Foto</Text>
              </Pressable>
              <Text style={styles.photoHint}>JPG, PNG, GIF · máx 2 MB</Text>
            </View>

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
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  placeholderTextColor={colors.textSecondary}
                  value={form.correo}
                  editable={false}
                />
                <Text style={styles.correoHint}>El correo no se puede modificar.</Text>
              </View>
            </View>

            <Pressable style={styles.button} onPress={guardar} disabled={guardando}>
              <Text style={styles.buttonText}>
                {guardando ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ModificarInfoScreen({ navigation }) {
  return (
    <RequireAuth>
      <ModificarInfoForm navigation={navigation} />
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  photoPickerContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FDFBF7',
    borderWidth: 1.5,
    borderColor: colors.border,
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
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  photoHint: {
    ...typography.caption,
    fontSize: 12,
  },
  form: {
    gap: spacing.md,
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
  inputDisabled: {
    backgroundColor: '#F1ECE7',
    color: colors.textSecondary,
  },
  correoHint: {
    ...typography.caption,
    fontSize: 12,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});