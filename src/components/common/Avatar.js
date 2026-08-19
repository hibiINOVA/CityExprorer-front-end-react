/**
 * @file Avatar.js
 * @description Representación circular de la identidad del usuario.
 */
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/theme';

export default function Avatar({ uri, size = 44, style }) {
  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri ? (
        <Image source={{ uri }} style={[StyleSheet.absoluteFill, styles.image]} />
      ) : (
        <Ionicons name="person" size={size * 0.5} color={colors.text.secondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background.base,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 999,
  },
});