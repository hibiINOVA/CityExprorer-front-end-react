import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const { isGuest, logout } = useAuthContext();
  const [showBanner, setShowBanner] = useState(true);

  const categories = [
    { id: 'parques', name: 'PARQUES', icon: 'leaf-outline' },
    { id: 'iglesias', name: 'IGLESIAS', icon: 'business-outline' },
    { id: 'plazas', name: 'PLAZAS', icon: 'compass-outline' },
    { id: 'patrimonio', name: 'PATRIMONIO', icon: 'ribbon-outline' },
    { id: 'arte', name: 'ARTE', icon: 'color-palette-outline' },
    { id: 'bebidas', name: 'BEBIDAS', icon: 'wine-outline' },
    { id: 'ver_todo', name: 'VER TODO', icon: 'grid-outline' },
  ];

  const handleCategoryPress = (categoryId) => {
    if (categoryId === 'ver_todo') {
      navigation.navigate('Destinos');
    } else {
      navigation.navigate('Destinos', { categoryId });
    }
  };

  const handleFabPress = () => {
    if (isGuest) {
      Alert.alert(
        'Acción requerida',
        'Necesitas iniciar sesión para sugerir o agregar nuevos destinos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: logout },
        ]
      );
    } else {
      Alert.alert('Próximamente', 'Esta función te permitirá agregar tus propios rincones favoritos de San Miguel.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => Alert.alert('Menú', 'Próximamente disponible.')}>
          <Ionicons name="menu-outline" size={26} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>City Explorer</Text>
        <Pressable style={styles.headerButton} onPress={() => Alert.alert('Notificaciones', 'No tienes notificaciones pendientes.')}>
          <Ionicons name="notifications-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>CONCIERGE COLLECTIVE</Text>
          <Text style={styles.heroTitle}>Experience the Soul of</Text>
          <Text style={styles.heroSubtitle}>San Miguel</Text>
        </View>

        {/* Guest Banner */}
        {isGuest && showBanner && (
          <View style={styles.guestBanner}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.guestBannerText}>
              Explora como invitado.{' '}
              <Text style={styles.registerLink} onPress={logout}>
                Regístrate
              </Text>{' '}
              para guardar tus lugares favoritos.
            </Text>
            <Pressable onPress={() => setShowBanner(false)} style={styles.closeButton}>
              <Ionicons name="close-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        )}

        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
                cat.id === 'ver_todo' && styles.verTodoCard,
              ]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <Ionicons name={cat.icon} size={28} color={colors.primary} />
              <Text style={styles.cardText}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={handleFabPress}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
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
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: 80, // Space for FAB
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: '#FFFFFF',
    fontSize: 28,
  },
  heroSubtitle: {
    ...typography.h1,
    color: '#FFFFFF',
    fontSize: 32,
    fontStyle: 'italic',
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 223, 217, 0.4)', // Faded beige
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    marginRight: spacing.sm,
  },
  guestBannerText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  closeButton: {
    padding: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    width: '47%', // Two columns layout
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: '#FAF7F4',
    transform: [{ scale: 0.98 }],
  },
  verTodoCard: {
    borderStyle: 'dashed',
    backgroundColor: 'rgba(247, 242, 238, 0.5)',
  },
  cardText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
