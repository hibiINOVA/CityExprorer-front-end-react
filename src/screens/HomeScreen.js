import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import { getCategorias } from '../services/api';
import { colors, typography, spacing, radius } from '../theme/theme';

const ICONOS_CATEGORIA = [
  { clave: 'parque', icono: 'leaf-outline' },
  { clave: 'iglesia', icono: 'business-outline' },
  { clave: 'plaza', icono: 'compass-outline' },
  { clave: 'patrimonio', icono: 'ribbon-outline' },
  { clave: 'arte', icono: 'color-palette-outline' },
  { clave: 'bebida', icono: 'wine-outline' },
  { clave: 'comida', icono: 'restaurant-outline' },
  { clave: 'restaurant', icono: 'restaurant-outline' },
  { clave: 'antros', icono: 'moon-outline' },
  { clave: 'noche', icono: 'moon-outline' },
  { clave: 'mercado', icono: 'cart-outline' },
  { clave: 'tienda', icono: 'storefront-outline' },
  { clave: 'relax', icono: 'spa-outline' },
];

function iconoCategoria(nombre) {
  const texto = (nombre || '').toLowerCase();
  const match = ICONOS_CATEGORIA.find((item) => texto.includes(item.clave));
  return match ? match.icono : 'location-outline';
}

export default function HomeScreen({ navigation }) {
  const { isGuest, logout } = useAuthContext();
  const [showBanner, setShowBanner] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategorias();
        setCategorias(cats);
      } catch (_) {
        setCategorias([]);
      } finally {
        setLoadingCategorias(false);
      }
    })();
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('DestinosCategoria', { categoryId });
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
        {loadingCategorias ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.grid}>
            {categorias.map((cat) => (
              <Pressable
                key={cat.id_categoria}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleCategoryPress(cat.id_categoria)}
              >
                <Ionicons name={iconoCategoria(cat.nombre)} size={28} color={colors.primary} />
                <Text style={styles.cardText}>{cat.nombre}</Text>
              </Pressable>
            ))}
            <Pressable
              style={({ pressed }) => [styles.card, styles.verTodoCard, pressed && styles.cardPressed]}
              onPress={() => handleCategoryPress(null)}
            >
              <Ionicons name="grid-outline" size={28} color={colors.primary} />
              <Text style={styles.cardText}>VER TODO</Text>
            </Pressable>
          </View>
        )}
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
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    borderBottomColor: colors.border.light,
  },
  infoIcon: {
    marginRight: spacing.sm,
  },
  guestBannerText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.primary,
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
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
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
    borderColor: colors.border.light,
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
    color: colors.text.primary,
    letterSpacing: 1,
    fontSize: 11,
    textAlign: 'center',
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