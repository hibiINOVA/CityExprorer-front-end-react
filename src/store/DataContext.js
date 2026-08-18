/**
 * @file DataContext.js
 * @description Contexto de datos de negocio (lugares, favoritos, comentarios)
 * para el flujo de usuario final / invitado.
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  getLugares,
  getFavoritos,
  getComentarios,
  toggleFavorito,
  createComentario,
  updateComentario,
} from '../services/api';

const DataContext = createContext(null);

const initialState = {
  lugares: [],
  favoritos: [],
  comentarios: {},
  loading: false,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LUGARES':
      return { ...state, lugares: action.payload, loading: false };
    case 'SET_FAVORITOS':
      return { ...state, favoritos: action.payload, loading: false };
    case 'SET_COMENTARIOS':
      return {
        ...state,
        comentarios: { ...state.comentarios, [action.payload.idLugar]: action.payload.comentarios },
        loading: false,
      };
    case 'ADD_FAVORITO':
      return { ...state, favoritos: [...state.favoritos, action.payload] };
    case 'REMOVE_FAVORITO':
      return {
        ...state,
        favoritos: state.favoritos.filter((fav) => fav.id_lugar !== action.payload),
      };
    case 'ADD_COMENTARIO':
      return {
        ...state,
        comentarios: {
          ...state.comentarios,
          [action.payload.idLugar]: [
            action.payload.comentario,
            ...(state.comentarios[action.payload.idLugar] || []),
          ],
        },
      };
    case 'UPDATE_COMENTARIO': {
      const lista = state.comentarios[action.payload.idLugar] || [];
      return {
        ...state,
        comentarios: {
          ...state.comentarios,
          [action.payload.idLugar]: lista.map((c) =>
            c.id_comentario === action.payload.comentario.id_comentario
              ? action.payload.comentario
              : c
          ),
        },
      };
    }
    default:
      return state;
  }
}

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchLugares = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const lugares = await getLugares();
      dispatch({ type: 'SET_LUGARES', payload: lugares });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al cargar lugares' });
    }
  }, []);

  const fetchFavoritos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const favoritos = await getFavoritos();
      dispatch({ type: 'SET_FAVORITOS', payload: favoritos });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al cargar favoritos' });
    }
  }, []);

  const fetchComentarios = useCallback(async (idLugar) => {
    try {
      const { data: comentarios } = await getComentarios(idLugar);
      dispatch({ type: 'SET_COMENTARIOS', payload: { idLugar, comentarios } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al cargar comentarios' });
    }
  }, []);

  const handleToggleFavorito = useCallback(async (idLugar) => {
    try {
      const res = await toggleFavorito(idLugar);
      if (res?.action === 'added') {
        dispatch({ type: 'ADD_FAVORITO', payload: res.data || { id_lugar: idLugar } });
      } else if (res?.action === 'removed') {
        dispatch({ type: 'REMOVE_FAVORITO', payload: idLugar });
      }
      return res;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al cambiar favorito' });
      throw error;
    }
  }, []);

  const handleAgregarComentario = useCallback(async ({ contenido, valoracion, id_lugar, id_comentario }) => {
    try {
      if (id_comentario) {
        const res = await updateComentario(id_comentario, { contenido, valoracion });
        dispatch({
          type: 'UPDATE_COMENTARIO',
          payload: { idLugar: id_lugar, comentario: res.data },
        });
        return res;
      }
      const res = await createComentario({ contenido, valoracion, id_lugar });
      dispatch({
        type: 'ADD_COMENTARIO',
        payload: { idLugar: id_lugar, comentario: res.data },
      });
      return res;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al guardar reseña' });
      throw error;
    }
  }, []);

  const value = {
    ...state,
    dispatch,
    fetchLugares,
    fetchFavoritos,
    fetchComentarios,
    handleToggleFavorito,
    handleAgregarComentario,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext debe usarse dentro de DataProvider');
  return context;
};