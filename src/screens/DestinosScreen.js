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

function normalizar(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function contienePalabraCompleta(texto, termino) {
  if (!texto || !termino) return false;
  if (termino.includes(' ')) {
    return texto.includes(termino);
  }
  const regex = new RegExp(`(^|[^a-z0-9])${termino}([^a-z0-9]|$)`, 'i');
  return regex.test(texto);
}

export default function DestinosScreen({ navigation, route }) {
  const { lugares, categorias, getCategoriaNombre, getPromedio, loading, error } = useLugares();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstrellas, setFiltroEstrellas] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    route.params?.categoryId ? Number(route.params.categoryId) : null
  );
  const [modoActivo, setModoActivo] = useState(route.params?.modo || null);

  // Sincronizar parámetros cuando se navega con nuevos valores
  useEffect(() => {
    if (route.params?.modo !== undefined) {
      setModoActivo(route.params.modo);
      if (route.params.modo) {
        setCategoriaSeleccionada(null);
      }
    }
    if (route.params?.categoryId !== undefined) {
      const catId = route.params.categoryId ? Number(route.params.categoryId) : null;
      setCategoriaSeleccionada(catId);
      if (catId) {
        setModoActivo(null);
      }
    }
    setBusqueda('');
    setFiltroEstrellas(null);
  }, [route.params?.categoryId, route.params?.modo, route.params?.timestamp]);

  const categoriaActiva = categoriaSeleccionada
    ? categorias.find((c) => Number(c.id_categoria) === Number(categoriaSeleccionada))
    : null;

  const resultados = useMemo(() => {
    let lista = Array.isArray(lugares) ? lugares : [];

    // Filtro por categoría específica (si viene de selección de categoría)
    if (categoriaSeleccionada) {
      lista = lista.filter((lugar) => Number(lugar.id_categoria) === Number(categoriaSeleccionada));
    }

    // Filtro por Modo de Exploración / Ambiente
    if (modoActivo) {
      const keywords = (modoActivo.keywords || []).map(normalizar).filter(Boolean);
      const catKeywords = (modoActivo.categorias || []).map(normalizar).filter(Boolean);

      lista = lista.filter((lugar) => {
        const nombre = normalizar(lugar.nombre);
        const desc = normalizar(lugar.descripcion);
        const catNombre = normalizar(getCategoriaNombre(lugar.id_categoria));

        // 1. Coincidencia por categoría del modo
        const matchCat = catKeywords.some((ck) => catNombre === ck || catNombre.includes(ck));
        if (matchCat) return true;

        // 2. Coincidencia por palabras clave específicas en nombre o descripción
        const matchKeywords = keywords.some((kw) =>
          contienePalabraCompleta(nombre, kw) ||
          contienePalabraCompleta(desc, kw)
        );

        return matchKeywords;
      });
    }

    // Filtro por valoración de estrellas
    if (filtroEstrellas !== null) {
      lista = lista.filter((lugar) => Math.round(getPromedio(lugar.id_lugar)) === filtroEstrellas);
    }

    // Filtro por término de búsqueda en tiempo real
    if (busqueda.trim()) {
      const termino = normalizar(busqueda.trim());
      lista = lista.filter((lugar) => {
        const nombre = normalizar(lugar.nombre);
        const desc = normalizar(lugar.descripcion);
        const catNombre = normalizar(getCategoriaNombre(lugar.id_categoria));
        return nombre.includes(termino) || desc.includes(termino) || catNombre.includes(termino);
      });
    }

    return lista;
  }, [lugares, categoriaSeleccionada, modoActivo, filtroEstrellas, busqueda, getPromedio, getCategoriaNombre]);

  const stars = [5, 4, 3, 2, 1];

  const tituloHeader = categoriaActiva
    ? categoriaActiva.nombre
    : modoActivo
    ? modoActivo.titulo
    : 'Destinos';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText} numberOfLines={1}>
          {tituloHeader}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.filters}>
        {modoActivo ? (
          <View style={styles.activeModoBadge}>
            <View style={styles.activeModoContent}>
              <Ionicons name={modoActivo.icono || 'sparkles'} size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activeModoTitle}>Modo: {modoActivo.titulo}</Text>
                <Text style={styles.activeModoDesc} numberOfLines={1}>
                  {modoActivo.subtitulo}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setModoActivo(null)} style={styles.clearModoBtn}>
              <Ionicons name="close-circle" size={20} color={colors.primary} />
            </Pressable>
          </View>
        ) : null}

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
          message="No hay destinos que coincidan con este modo o búsqueda."
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
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
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
    borderColor: colors.border.light,
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
    color: colors.text.primary,
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
  activeModoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F4',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  activeModoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  activeModoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  activeModoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  clearModoBtn: {
    padding: spacing.xs,
  },
});