import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useLugares from '../hooks/useLugares';
import DestinoCard from '../components/DestinoCard';
import EmptyState from '../components/EmptyState';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function DestinosScreen({ navigation, route }) {
  const { lugares, categorias, getCategoriaNombre, getPromedio, loading, error } = useLugares();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstrellas, setFiltroEstrellas] = useState(null);

  const categoryId = route.params?.categoryId ? Number(route.params.categoryId) : null;

  useEffect(() => {
    if (route.params?.categoryId) {
      setBusqueda('');
      setFiltroEstrellas(null);
    }
  }, [route.params?.categoryId]);

  const categoriaActiva = categoryId
    ? categorias.find((c) => c.id_categoria === categoryId)
    : null;

  const resultados = useMemo(() => {
    let lista = lugares;

    if (categoryId) {
      lista = lista.filter((lugar) => Number(lugar.id_categoria) === categoryId);
    }

    if (filtroEstrellas !== null) {
      lista = lista.filter((lugar) => Math.round(getPromedio(lugar.id_lugar)) === filtroEstrellas);
    }

    if (busqueda.trim()) {
      const termino = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (lugar) =>
          (lugar.nombre || '').toLowerCase().includes(termino) ||
          (lugar.descripcion || '').toLowerCase().includes(termino)
      );
    }

    return lista;
  }, [lugares, categoryId, filtroEstrellas, busqueda, getPromedio]);

  const stars = [5, 4, 3, 2, 1];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText} numberOfLines={1}>
          {categoriaActiva ? categoriaActiva.nombre : 'Destinos'}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.filters}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o descripción"
            placeholderTextColor={colors.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCapitalize="none"
          />
          {busqueda ? (
            <Pressable onPress={() => setBusqueda('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.starFilter}>
          <Pressable
            style={[styles.starChip, filtroEstrellas === null && styles.starChipActive]}
            onPress={() => setFiltroEstrellas(null)}
          >
            <Text style={[styles.starChipText, filtroEstrellas === null && styles.starChipTextActive]}>
              Todas
            </Text>
          </Pressable>
          {stars.map((n) => (
            <Pressable
              key={n}
              style={[styles.starChip, filtroEstrellas === n && styles.starChipActive]}
              onPress={() => setFiltroEstrellas(filtroEstrellas === n ? null : n)}
            >
              <Ionicons
                name="star"
                size={13}
                color={filtroEstrellas === n ? '#FFFFFF' : colors.warning}
              />
              <Text
                style={[styles.starChipText, filtroEstrellas === n && styles.starChipTextActive]}
              >
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Error"
          message={error}
          actionLabel="Reintentar"
          onAction={null}
        />
      ) : resultados.length === 0 ? (
        <EmptyState
          icon="compass-outline"
          title="Sin destinos"
          message="No hay destinos que coincidan con tu búsqueda o categoría."
        />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => String(item.id_lugar)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <DestinoCard
              lugar={item}
              promedio={getPromedio(item.id_lugar)}
              nombreCategoria={getCategoriaNombre(item.id_categoria)}
              onPress={() =>
                navigation.navigate('DestinoDetalle', { id_destino: item.id_lugar })
              }
            />
          )}
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
  filters: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  starFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: 4,
  },
  starChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  starChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  starChipTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});