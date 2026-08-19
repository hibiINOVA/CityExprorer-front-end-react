import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getLugares, getCategorias, getEstadisticasLugar } from '../services/api';

/**
 * useLugares - carga lugares activos, categorías y el promedio de valoración
 * de cada lugar (endpoint de estadísticas, evita N+1 de comentarios).
 *
 * Recarga en silencio cada vez que la pantalla recupera el foco (p. ej.
 * después de escribir una reseña) para mantener promedios y contadores
 * actualizados sin parpadear el spinner en cada pestaña.
 */
export default function useLugares() {
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cargado = useRef(false);

  const load = useCallback(async () => {
    if (!cargado.current) setLoading(true);
    setError(null);
    try {
      const [lugaresData, categoriasData] = await Promise.all([getLugares(), getCategorias()]);
      setLugares(lugaresData);
      setCategorias(categoriasData);

      const statsPromises = lugaresData.map(async (lugar) => {
        try {
          const stats = await getEstadisticasLugar(lugar.id_lugar);
          return [lugar.id_lugar, stats];
        } catch (_) {
          return [lugar.id_lugar, { promedio_valoracion: 0, total_comentarios: 0 }];
        }
      });

      const statsList = await Promise.all(statsPromises);
      setEstadisticas(Object.fromEntries(statsList));
    } catch (e) {
      setError(e.message || 'Error al cargar los lugares');
    } finally {
      setLoading(false);
      cargado.current = true;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const getCategoriaNombre = useCallback(
    (idCategoria) => {
      const cat = categorias.find((c) => c.id_categoria === idCategoria);
      return cat ? cat.nombre : 'Sin Categoría';
    },
    [categorias]
  );

  const getPromedio = useCallback(
    (idLugar) => Number(estadisticas[idLugar]?.promedio_valoracion || 0),
    [estadisticas]
  );

  const getTotalComentarios = useCallback(
    (idLugar) => Number(estadisticas[idLugar]?.total_comentarios || 0),
    [estadisticas]
  );

  return {
    lugares,
    categorias,
    loading,
    error,
    reload: load,
    getCategoriaNombre,
    getPromedio,
    getTotalComentarios,
  };
}