import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RequireAuth from '../components/RequireAuth';
import StarRating from '../components/StarRating';
import { useAuthContext } from '../store/AuthContext';
import { getLugar, getComentario, createComentario, updateComentario } from '../services/api';
import { colors, typography, spacing, radius } from '../theme/theme';

const MIN_CARACTERES = 30;
const MAX_CARACTERES = 500;

function ReseniaForm({ navigation, route }) {
  const { userSession } = useAuthContext();
  const idDestino = route.params?.id_destino;
  const idResenia = route.params?.id_resenia ? Number(route.params.id_resenia) : 0;

  const [lugar, setLugar] = useState(null);
  const [valoracion, setValoracion] = useState(0);
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const esEdicion = idResenia > 0;

  useEffect(() => {
    if (!idDestino) return;
    (async () => {
      try {
        const lugarData = await getLugar(idDestino);
        setLugar(lugarData);
      } catch (_) {
        // se ignora, no bloquea el formulario
      }

      if (esEdicion) {
        try {
          const comentario = await getComentario(idResenia);
          if (comentario) {
            setContenido(comentario.contenido || '');
            setValoracion(Number(comentario.valoracion) || 0);
          }
        } catch (_) {
          Alert.alert('Error', 'No se pudo cargar tu reseña.');
        }
      }

      setLoading(false);
    })();
  }, [idDestino, idResenia, esEdicion]);

  const enviar = async () => {
    if (valoracion <= 0) {
      Alert.alert('Atención', 'Por favor, asigna una calificación.');
      return;
    }
    if (!contenido.trim() || contenido.trim().length < MIN_CARACTERES) {
      Alert.alert(
        'Atención',
        `Tu reseña debe tener al menos ${MIN_CARACTERES} caracteres.`
      );
      return;
    }

    setEnviando(true);
    try {
      if (esEdicion) {
        await updateComentario(idResenia, {
          contenido: contenido.trim(),
          valoracion,
        });
      } else {
        await createComentario({
          contenido: contenido.trim(),
          valoracion,
          id_lugar: Number(idDestino),
        });
      }
      Alert.alert(
        '¡Éxito!',
        esEdicion ? 'Tu reseña fue actualizada exitosamente.' : 'Gracias por compartir tu opinión.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const serverMessage =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'Ocurrió un error al guardar tu reseña. Intenta de nuevo.';
      Alert.alert('Error', serverMessage);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>
          {esEdicion ? 'Modificar reseña' : 'Escribir reseña'}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {lugar ? (
              <View style={styles.lugarCard}>
                <Text style={styles.lugarName}>{lugar.nombre}</Text>
                {lugar.descripcion ? (
                  <Text style={styles.lugarDesc} numberOfLines={2}>
                    {lugar.descripcion}
                  </Text>
                ) : null}
              </View>
            ) : null}

            <View style={styles.ratingSection}>
              <Text style={styles.label}>Tu calificación</Text>
              <StarRating value={valoracion} size={40} onChange={setValoracion} />
              <Text style={styles.ratingHint}>Toca las estrellas para calificar</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tu reseña</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Comparte tu experiencia en este lugar..."
                placeholderTextColor={colors.textSecondary}
                multiline
                textAlignVertical="top"
                maxLength={MAX_CARACTERES}
                value={contenido}
                onChangeText={setContenido}
              />
              <Text style={styles.charCount}>
                {contenido.length}/{MAX_CARACTERES} · mínimo {MIN_CARACTERES}
              </Text>
            </View>

            <Pressable style={styles.button} onPress={enviar} disabled={enviando}>
              <Text style={styles.buttonText}>
                {enviando ? 'ENVIANDO...' : esEdicion ? 'GUARDAR CAMBIOS' : 'ENVIAR RESEÑA'}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ReseniaScreen({ navigation, route }) {
  return (
    <RequireAuth>
      <ReseniaForm navigation={navigation} route={route} />
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
    fontSize: 18,
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
  lugarCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  lugarName: {
    ...typography.h3,
    fontSize: 18,
  },
  lugarDesc: {
    ...typography.caption,
    fontSize: 14,
  },
  ratingSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.text,
    alignSelf: 'flex-start',
  },
  ratingHint: {
    ...typography.caption,
    fontSize: 12,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    minHeight: 140,
  },
  charCount: {
    ...typography.caption,
    fontSize: 12,
    alignSelf: 'flex-end',
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