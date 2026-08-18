import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';
import { colors, typography, spacing, radius } from '../theme/theme';

/**
 * DestinoCard - tarjeta de un lugar en listados.
 * lugar: objeto del backend (id_lugar, nombre, descripcion, id_categoria, ...).
 * promedio: calificación promedio opcional.
 */
export default function DestinoCard({
  lugar,
  promedio = 0,
  nombreCategoria,
  onPress,
  rightAction,
}) {
  const imagenUrl = lugar?.imagenes?.[0]?.url || lugar?.url;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      {imagenUrl ? (
        <Image source={{ uri: imagenUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={28} color={colors.textSecondary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {lugar?.nombre || 'Sin nombre'}
        </Text>
        {nombreCategoria ? (
          <Text style={styles.category} numberOfLines={1}>
            {nombreCategoria}
          </Text>
        ) : null}
        {lugar?.descripcion ? (
          <Text style={styles.description} numberOfLines={2}>
            {lugar.descripcion}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <StarRating value={promedio} size={14} />
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </View>

      {rightAction}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: '#FAF7F4',
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: '#EEE8E3',
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: '#EEE8E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.xs,
    paddingVertical: 2,
  },
  name: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  category: {
    ...typography.caption,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
});