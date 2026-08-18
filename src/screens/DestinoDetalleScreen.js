import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import {
  getLugar,
  getDireccion,
  getImagenes,
  getCategorias,
  getComentarios,
  checkFavorito,
  toggleFavorito,
  registrarVisita,
} from '../services/api';
import ImageGallery from '../components/ImageGallery';
import StarRating from '../components/StarRating';
import { formatDate } from '../utils/format';
import { colors, typography, spacing, radius } from '../theme/theme';

const TIEMPO_MINIMO = 5; // segundos mínimos para registrar visita
const INTERVALO_GUARDADO = 30; // guardar cada 30 segundos

function formatHora(hora) {
  if (!hora) return null;
  const str = String(hora);
  if (str.length >= 5 && str.includes(':')) return str.slice(0, 5);
  return str;
}

export default function DestinoDetalleScreen({ navigation, route }) {
  const { userSession, isGuest, logout } = useAuthContext();
  const idDestino = route.params?.id_destino;
  const idUsuario = !isGuest ? userSession?.id_usuario : null;

  const [lugar, setLugar] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [esFavorito, setEsFavorito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // 🕒 Tracking de tiempo de visita
  const tiempoInicio = useRef(0);
  const ultimoPing = useRef(0);
  const tiempoTotal = useRef(0);
  const visitaRegistrada = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!idDestino) return;
    (async () => {
      setLoading(true);
      try {
        const [lugarData, imgs, comentariosRes, cats] = await Promise.all([
          getLugar(idDestino),
          getImagenes(idDestino).catch(() => []),
          getComentarios(idDestino).catch(() => ({ data: [] })),
          getCategorias().catch(() => []),
        ]);
        setLugar(lugarData);
        setImagenes(imgs);
        setComentarios(comentariosRes.data || []);
        setCategorias(cats);

        if (lugarData?.id_direccion) {
          getDireccion(lugarData.id_direccion)
            .then(setDireccion)
            .catch(() => setDireccion(null));
        }

        if (idUsuario) {
          checkFavorito(idDestino).then(setEsFavorito).catch(() => setEsFavorito(false));
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo cargar la información del lugar.');
      } finally {
        setLoading(false);
      }
    })();
  }, [idDestino, idUsuario]);

  // 🕒 Lógica de tracking
  const guardarVisita = useCallback(
    (segundos, esFinal = false) => {
      if (!idDestino) return;
      if (visitaRegistrada.current && !esFinal) return;
      if (segundos < TIEMPO_MINIMO) return;
      registrarVisita({
        id_lugar: Number(idDestino),
        id_usuario: idUsuario || null,
        tiempo_visita: segundos,
      })
        .then(() => {
          visitaRegistrada.current = true;
        })
        .catch(() => {});
    },
    [idDestino, idUsuario]
  );

  useEffect(() => {
    tiempoInicio.current = Date.now();
    ultimoPing.current = Date.now();
    tiempoTotal.current = 0;
    visitaRegistrada.current = false;

    intervalRef.current = setInterval(() => {
      if (ultimoPing.current > 0) {
        const transcurrido = Date.now() - ultimoPing.current;
        tiempoTotal.current += transcurrido;
        ultimoPing.current = Date.now();
        guardarVisita(Math.floor(tiempoTotal.current / 1000));
      }
    }, INTERVALO_GUARDADO * 1000);

    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        if (ultimoPing.current > 0) {
          tiempoTotal.current += Date.now() - ultimoPing.current;
          ultimoPing.current = 0;
        }
      } else if (ultimoPing.current === 0) {
        ultimoPing.current = Date.now();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sub.remove();
      if (ultimoPing.current > 0) {
        tiempoTotal.current += Date.now() - ultimoPing.current;
      }
      guardarVisita(Math.floor(tiempoTotal.current / 1000), true);
    };
  }, [guardarVisita]);

  const categoriaNombre = () => {
    const cat = categorias.find((c) => c.id_categoria === lugar?.id_categoria);
    return cat ? cat.nombre : 'Categoría';
  };

  const promedio = comentarios.length
    ? +(comentarios.reduce((acc, c) => acc + Number(c.valoracion || 0), 0) / comentarios.length).toFixed(1)
    : 0;

  const ordenados = [...comentarios].sort(
    (a, b) =>
      new Date(b.fecha_creacion || b.created_at || 0) - new Date(a.fecha_creacion || a.created_at || 0)
  );
  const ultimoComentario = ordenados[0] || null;

  const miResenia = idUsuario
    ? comentarios.find((c) => Number(c.id_usuario) === Number(idUsuario)) || null
    : null;

  const requiereLogin = (accion) => {
    Alert.alert(
      '¿Ya tienes una cuenta?',
      `Para ${accion} necesitas iniciar sesión o crear una cuenta. ¿Deseas ir a la página de inicio de sesión?`,
      [
        { text: 'No, gracias', style: 'cancel' },
        { text: 'Sí, quiero iniciar sesión', onPress: logout },
      ]
    );
  };

  const onToggleFavorito = async () => {
    if (isGuest || !idUsuario) {
      requiereLogin('agregar favoritos');
      return;
    }
    setToggling(true);
    try {
      const res = await toggleFavorito(Number(idDestino));
      setEsFavorito(res?.action === 'added');
      Alert.alert(
        res?.action === 'added' ? 'Agregado a Favoritos' : 'Eliminado de Favoritos',
        res?.message || '',
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el favorito.');
    } finally {
      setToggling(false);
    }
  };

  const onEscribirResenia = () => {
    if (isGuest || !idUsuario) {
      requiereLogin('escribir una reseña');
      return;
    }
    navigation.navigate('Resenia', {
      id_destino: Number(idDestino),
      id_resenia: miResenia ? miResenia.id_comentario : 0,
    });
  };

  const onVerResenas = () => {
    if (isGuest || !idUsuario) {
      requiereLogin('ver las reseñas');
      return;
    }
    navigation.navigate('Comentarios', { id_destino: Number(idDestino) });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText} numberOfLines={1}>
          {lugar?.nombre || 'Detalle'}
        </Text>
        <Pressable style={styles.headerButton} onPress={onToggleFavorito} disabled={toggling}>
          <Ionicons
            name={esFavorito ? 'heart' : 'heart-outline'}
            size={26}
            color={esFavorito ? colors.primary : colors.textSecondary}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ImageGallery images={imagenes.map((i) => i.url)} height={260} />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{lugar?.nombre}</Text>
            <Text style={styles.category}>{categoriaNombre()}</Text>
          </View>

          <View style={styles.ratingRow}>
            <StarRating value={promedio} size={18} />
            <Text style={styles.ratingText}>
              {promedio} · {comentarios.length} {comentarios.length === 1 ? 'reseña' : 'reseñas'}
            </Text>
          </View>

          {lugar?.descripcion ? (
            <Text style={styles.description}>{lugar.descripcion}</Text>
          ) : null}

          <View style={styles.infoGrid}>
            {lugar?.paginaWeb ? (
              <View style={styles.infoItem}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>{lugar.paginaWeb}</Text>
              </View>
            ) : null}
            {lugar?.num_telefonico ? (
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>{lugar.num_telefonico}</Text>
              </View>
            ) : null}
            {formatHora(lugar?.horario_apertura) ? (
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>
                  {formatHora(lugar.horario_apertura)} - {formatHora(lugar.horario_cierre)}
                </Text>
              </View>
            ) : null}
            {lugar?.dias_servicio && lugar.dias_servicio.length ? (
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>{lugar.dias_servicio.join(', ')}</Text>
              </View>
            ) : null}
            {direccion ? (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>
                  {[direccion.calle, direccion.numero_ext, direccion.colonia, direccion.codigo_postal]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.actionButton, styles.actionPrimary]} onPress={onEscribirResenia}>
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionPrimaryText}>
                {miResenia ? 'Modificar tu reseña' : 'Escribir reseña'}
              </Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={onVerResenas}>
              <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Todas las reseñas</Text>
            </Pressable>
          </View>

          {ultimoComentario ? (
            <View style={styles.lastReviewCard}>
              <Text style={styles.sectionTitle}>Última reseña</Text>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>
                  {ultimoComentario.usuario?.nombre || 'Usuario'}
                </Text>
                <StarRating value={Number(ultimoComentario.valoracion)} size={13} />
              </View>
              <Text style={styles.reviewDate}>
                {formatDate(ultimoComentario.fecha_creacion || ultimoComentario.created_at)}
              </Text>
              <Text style={styles.reviewContent} numberOfLines={4}>
                {ultimoComentario.contenido}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  titleRow: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
  },
  category: {
    ...typography.caption,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingText: {
    ...typography.caption,
    fontSize: 13,
  },
  description: {
    ...typography.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoGrid: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    ...typography.body,
    fontSize: 14,
    color: colors.text,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  actionPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  lastReviewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
  },
  reviewDate: {
    ...typography.caption,
    fontSize: 12,
  },
  reviewContent: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
});