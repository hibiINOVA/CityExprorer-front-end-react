import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.82, 330);

export const MODOS_EXPLORACION = [
  {
    id: 'noche',
    titulo: 'San Miguel de Noche',
    subtitulo: 'Rooftops, terrazas, coctelería y vida nocturna',
    icono: 'moon',
    color: '#3D2C4D',
    keywords: [
      'antro', 'antros', 'rooftop', 'rooftops', 'cocteleria', 'coctel', 'cocteles',
      'mixologia', 'copas', 'discoteca', 'cantina', 'mezcaleria', 'tragos', 'dj', 'fiesta'
    ],
    categorias: ['antro', 'antros', 'bar', 'bares', 'noche'],
  },
  {
    id: 'romantico',
    titulo: 'Plan Romántico',
    subtitulo: 'Cenas con encanto, vistas a la parroquia y miradores',
    icono: 'heart',
    color: '#A74229',
    keywords: [
      'romantico', 'romantica', 'en pareja', 'pareja', 'parejas', 'cena romantica',
      'intimo', 'intima', 'spa', 'atardecer', 'mirador', 'miradores', 'velas', 'luna de miel'
    ],
    categorias: ['relax'],
  },
  {
    id: 'familiar',
    titulo: 'Plan Familiar',
    subtitulo: 'Parques, plazas, mercados y recorridos al aire libre',
    icono: 'people',
    color: '#2E6F40',
    keywords: [
      'familiar', 'familia', 'ninos', 'ninas', 'tranvia', 'artesanias', 'dulces tipicos',
      'juegos', 'fuente', 'kiosco', 'quiosco', 'paseo familiar', 'aire libre'
    ],
    categorias: ['parque', 'parques', 'plaza', 'plazas', 'mercado', 'mercados'],
  },
  {
    id: 'petfriendly',
    titulo: 'Lugares Pet-Friendly',
    subtitulo: 'Espacios abiertos, terrazas y parques para tu mascota',
    icono: 'paw',
    color: '#C07D38',
    keywords: [
      'pet friendly', 'pet-friendly', 'mascota', 'mascotas', 'perro', 'perros',
      'admiten mascotas', 'petfriendly', 'jardin botanico'
    ],
    categorias: ['parque', 'parques'],
  },
  {
    id: 'cultura',
    titulo: 'Arte, Templos e Historia',
    subtitulo: 'Galerías, parroquias, monumentos y patrimonio colonial',
    icono: 'color-palette',
    color: '#4A5568',
    keywords: [
      'parroquia', 'templo', 'templos', 'galeria', 'galerias', 'museo', 'museos',
      'fabrica la aurora', 'aurora', 'convento', 'capilla', 'monumento', 'escultura',
      'pintura', 'santuario', 'teatro', 'exposicion', 'bellas artes'
    ],
    categorias: ['iglesia', 'iglesias', 'patrimonio', 'arte', 'museo', 'museos'],
  },
  {
    id: 'gastronomia',
    titulo: 'Gastronomía & Sabores',
    subtitulo: 'Restaurantes de autor, cafeterías y comida tradicional',
    icono: 'restaurant',
    color: '#8C3823',
    keywords: [
      'chef', 'gourmet', 'cafeteria', 'cafeterias', 'desayuno', 'desayunos', 'brunch',
      'tacos', 'gastronomia', 'degustacion', 'platillo', 'platillos', 'cocina', 'cocina de autor',
      'reposteria', 'panaderia', 'vinos', 'vinedo', 'vinedos', 'cata'
    ],
    categorias: ['restaurant', 'restaurante', 'restaurantes', 'comida', 'mercado', 'mercados'],
  },
];

export default function ModosExploracionModal({ visible, onClose, onSelectModo }) {
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (showModal) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const handleSelect = (modo) => {
    handleClose();
    onSelectModo(modo);
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Fondo oscurecido con animación fade */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={styles.overlay} onPress={handleClose} />
        </Animated.View>

        {/* Panel lateral con animación de izquierda a derecha (translateX) */}
        <Animated.View
          style={[
            styles.drawerAnimatedWrapper,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContainer} edges={['top', 'bottom', 'left']}>
            <View style={styles.drawerHeader}>
              <View style={styles.headerTitleContainer}>
                <Ionicons name="compass" size={24} color={colors.primary} />
                <View>
                  <Text style={styles.drawerTitle}>Modos de Exploración</Text>
                  <Text style={styles.drawerSubtitle}>Descubre San Miguel a tu ritmo</Text>
                </View>
              </View>
              <Pressable onPress={handleClose} style={styles.closeBtn} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollList}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>ELIGE TU PLAN O AMBIENTE</Text>

              {MODOS_EXPLORACION.map((modo) => (
                <Pressable
                  key={modo.id}
                  style={({ pressed }) => [
                    styles.modoCard,
                    pressed && styles.modoCardPressed,
                  ]}
                  onPress={() => handleSelect(modo)}
                >
                  <View style={[styles.iconBox, { backgroundColor: modo.color }]}>
                    <Ionicons name={modo.icono} size={22} color="#FFFFFF" />
                  </View>
                  <View style={styles.modoInfo}>
                    <Text style={styles.modoTitulo}>{modo.titulo}</Text>
                    <Text style={styles.modoSubtitulo} numberOfLines={2}>
                      {modo.subtitulo}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </Pressable>
              ))}

              <View style={styles.footerNote}>
                <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                <Text style={styles.footerNoteText}>
                  Filtra automáticamente lugares y experiencias recomendadas.
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  overlay: {
    flex: 1,
  },
  drawerAnimatedWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 10,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: '#FAF7F4',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  drawerTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
  },
  drawerSubtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scrollList: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginVertical: spacing.xs,
    marginLeft: spacing.xs,
  },
  modoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.screen,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  modoCardPressed: {
    backgroundColor: '#F3ECE7',
    transform: [{ scale: 0.98 }],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modoInfo: {
    flex: 1,
    gap: 2,
  },
  modoTitulo: {
    ...typography.h3,
    fontSize: 15,
    color: colors.text.primary,
  },
  modoSubtitulo: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(167, 66, 41, 0.08)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  footerNoteText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.primary,
    flex: 1,
    lineHeight: 16,
  },
});
