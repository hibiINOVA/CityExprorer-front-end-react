import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthContext } from '../store/AuthContext';
import { useDataContext } from '../store/DataContext';
import useLugares from '../hooks/useLugares';
import { getImagenes } from '../services/api';
import DestinoCard from '../components/DestinoCard';
import EmptyState from '../components/EmptyState';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function FavoritosScreen({ navigation }) {
  const { isGuest, logout } = useAuthContext();
  const { favoritos, fetchFavoritos, handleToggleFavorito } = useDataContext();
  const { categorias, getCategoriaNombre, getPromedio } = useLugares();

  const [imagenesPorLugar, setImagenesPorLugar] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cargandoId, setCargandoId] = useState(null);

  // 🔄 Auto-refresh cuando el tab de Favoritos recibe foco
  useFocusEffect(
    useCallback(() => {
      if (isGuest) return;
      let cancelled = false;
      (async () => {
        setLoading(true);
        await fetchFavoritos();
        if (!cancelled) setLoading(false);
      })();
      return () => { cancelled = true; };
    }, [isGuest, fetchFavoritos])
  );

  useEffect(() => {
    if (isGuest || favoritos.length === 0) return;
    favoritos.forEach(async (fav) => {
      const id = fav?.lugar?.id_lugar;
      if (!id || imagenesPorLugar[id]) return;
      try {
        const imgs = await getImagenes(id);
        setImagenesPorLugar((prev) => ({ ...prev, [id]: imgs }));
      } catch (_) {
        setImagenesPorLugar((prev) => ({ ...prev, [id]: [] }));
      }
    });
  }, [favoritos, isGuest, imagenesPorLugar]);

  const favoritosFiltrados = useMemo(() => {
    return favoritos.filter((fav) => {
      const idCategoria = Number(fav?.lugar?.id_categoria);
      return categoriaSeleccionada === 0 || idCategoria === categoriaSeleccionada;
    });
  }, [favoritos, categoriaSeleccionada]);

  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Favoritos</Text>
        </View>
        <EmptyState
          icon="heart-outline"
          title="Guarda tus lugares favoritos"
          message="Inicia sesión para guardar y consultar tus lugares favoritos de San Miguel."
          actionLabel="Iniciar Sesión"
          onAction={logout}
        />
      </SafeAreaView>
    );
  }

  const removeFavorito = async (idLugar) => {
    setCargandoId(idLugar);
    try {
      await handleToggleFavorito(idLugar);
      await fetchFavoritos();
    } catch (_) {
      // El contexto guarda el error
    } finally {
      setCargandoId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Favoritos</Text>
      </View>

      <View style={styles.categoryBar}>
        <Pressable
          style={[styles.categoryChip, categoriaSeleccionada === 0 && styles.categoryChipActive]}
          onPress={() => setCategoriaSeleccionada(0)}
        >
          <Text
            style={[
              styles.categoryChipText,
              categoriaSeleccionada === 0 && styles.categoryChipTextActive,
            ]}
          >
            Todas
          </Text>
        </Pressable>
        {categorias.map((cat) => (
          <Pressable
            key={cat.id_categoria}
            style={[
              styles.categoryChip,
              categoriaSeleccionada === cat.id_categoria && styles.categoryChipActive,
            ]}
            onPress={() =>
              setCategoriaSeleccionada(
                categoriaSeleccionada === cat.id_categoria ? 0 : cat.id_categoria
              )
            }
          >
            <Text
              style={[
                styles.categoryChipText,
                categoriaSeleccionada === cat.id_categoria && styles.categoryChipTextActive,
              ]}
            >
              {cat.nombre}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : favoritosFiltrados.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Sin favoritos"
          message="Aún no has guardado lugares. Toca el corazón en un destino para agregarlo."
        />
      ) : (
        <FlatList
          data={favoritosFiltrados}
          keyExtractor={(item) => String(item.id_favorito || item.id_lugar)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const lugar = item.lugar;
            const idLugar = lugar?.id_lugar;
            const imagenes = imagenesPorLugar[idLugar] || [];
            return (
              <DestinoCard
                lugar={{ ...lugar, imagenes }}
                promedio={getPromedio(idLugar)}
                nombreCategoria={getCategoriaNombre(lugar?.id_categoria)}
                onPress={() =>
                  navigation.navigate('DestinoDetalle', { id_destino: idLugar })
                }
                rightAction={
                  <Pressable
                    style={styles.heartButton}
                    onPress={() => removeFavorito(idLugar)}
                    disabled={cargandoId === idLugar}
                    hitSlop={8}
                  >
                    {cargandoId === idLugar ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Ionicons name="heart" size={24} color={colors.primary} />
                    )}
                  </Pressable>
                }
              />
            );
          }}
        />
      )}
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
    justifyContent: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.surface,
  },
  headerText: {
    fontSize: 18,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  heartButton: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});