/**
 * @file ModalInfo.js
 * @description Interfaz de diálogo para alertas y estados del sistema.
 */
import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors, spacing, radius } from '../../theme/theme';

export default function ModalInfo({ visible = false, title, message, buttonText = 'OK', onClose, children }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title ? <AppText variant="h3" style={styles.title}>{title}</AppText> : null}
          {message ? <AppText variant="body" style={styles.message}>{message}</AppText> : null}
          {children}
          <AppButton title={buttonText} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.background.base,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: 420,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
});