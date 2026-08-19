import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';
import AppText from './common/AppText';
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
          <Ionicons name="image-outline" size={28} color={colors.text.secondary} />
        </View>
      )}

      <View style={styles.info}>
        <AppText variant="h3" style={styles.name} numberOfLines={1}>
          {lugar?.nombre || 'Sin nombre'}
        </AppText>
        {nombreCategoria ? (
          <AppText style={styles.category} numberOfLines={1}>
            {nombreCategoria}
          </AppText>
        ) : null}
        {lugar?.descripcion ? (
          <AppText variant="caption" style={styles.description} numberOfLines={2}>
            {lugar.descripcion}
          </AppText>
        ) : null}

        <View style={styles.footer}>
          <StarRating value={promedio} size={14} />
          <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
        </View>
      </View>

      {rightAction}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.md,
    shadowColor: colors.background.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: colors.background.screen,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.border.light,
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.border.light,
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
    fontSize: 16,
  },
  category: {
    ...typography.caption,
    fontSize: 12,
    color: colors.brand.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
});