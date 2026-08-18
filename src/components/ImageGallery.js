import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme/theme';

/**
 * ImageGallery - carrusel de imágenes con flechas de navegación.
 * images: array de URLs (string). Si es una sola imagen no muestra flechas.
 */
export default function ImageGallery({ images = [], height = 220, borderRadius = radius.lg }) {
  const [index, setIndex] = useState(0);

  const list = Array.isArray(images) ? images.filter(Boolean) : [];

  if (list.length === 0) {
    return (
      <View style={[styles.placeholder, { height, borderRadius }]}>
        <Ionicons name="image-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.placeholderText}>Sin imágenes</Text>
      </View>
    );
  }

  const current = list[index] || list[0];

  const change = (direction) => {
    const total = list.length;
    if (total <= 1) return;
    setIndex((prev) => (prev + direction + total) % total);
  };

  return (
    <View style={[styles.container, { height, borderRadius }]}>
      <Image source={{ uri: current }} style={styles.image} resizeMode="cover" />

      {list.length > 1 && (
        <>
          <Pressable style={[styles.arrow, styles.arrowLeft]} onPress={() => change(-1)} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable style={[styles.arrow, styles.arrowRight]} onPress={() => change(1)} hitSlop={8}>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.dots}>
            {list.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEE8E3',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: { left: spacing.sm },
  arrowRight: { right: spacing.sm },
  dots: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 9,
  },
  placeholder: {
    backgroundColor: '#EEE8E3',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});