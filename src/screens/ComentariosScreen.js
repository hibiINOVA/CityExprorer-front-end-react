import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import { getComentarios, storageUrl } from '../services/api';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import { formatDate, promedioDeComentarios } from '../utils/format';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function ComentariosScreen({ navigation, route }) {
  const { isGuest, logout } = useAuthContext();
  const idDestino = route.params?.id_destino;

  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isGuest || !idDestino) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getComentarios(idDestino);
        setComentarios(res.data || []);
      } catch (e) {
        setError(e.message || 'No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    })();
  }, [isGuest, idDestino]);

  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerText}>Reseñas</Text>
          <View style={styles.headerButton} />
        </View>
        <EmptyState
          icon="chatbubbles-outline"
          title="Reseñas reservadas"
          message="Inicia sesión para ver y escribir reseñas de los lugares."
          actionLabel="Iniciar Sesión"
          onAction={logout}
        />
      </SafeAreaView>
    );
  }

  const promedio = promedioDeComentarios(comentarios);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>Reseñas</Text>
        <View style={styles.headerButton} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Error" message={error} />
      ) : (
        <FlatList
          data={comentarios}
          keyExtractor={(item) => String(item.id_comentario)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            comentarios.length > 0 ? (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryRating}>{Number(promedio).toFixed(1)}</Text>
                <View style={styles.summaryStars}>
                  <StarRating value={promedio} size={18} />
                  <Text style={styles.summaryTotal}>
                    {comentarios.length} {comentarios.length === 1 ? 'reseña' : 'reseñas'}
                  </Text>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const usuario = item.usuario || {};
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  {usuario.foto_perfil ? (
                    <Image source={{ uri: storageUrl(usuario.foto_perfil) }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={18} color={colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.authorName}>
                      {usuario.nombre || 'Usuario'}
                    </Text>
                    <Text style={styles.date}>{formatDate(item.fecha_creacion || item.created_at)}</Text>
                  </View>
                  <StarRating value={Number(item.valoracion)} size={14} />
                </View>
                <Text style={styles.content}>{item.contenido}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubble-ellipses-outline"
              title="Sin reseñas"
              message="Sé el primero en compartir tu experiencia en este lugar."
            />
          }
        />
      )}
    </SafeAreaView>
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
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  summaryRating: {
    ...typography.h1,
    fontSize: 34,
    color: colors.text,
  },
  summaryStars: {
    gap: spacing.xs,
  },
  summaryTotal: {
    ...typography.caption,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEE8E3',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  authorName: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    ...typography.caption,
    fontSize: 12,
  },
  content: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});