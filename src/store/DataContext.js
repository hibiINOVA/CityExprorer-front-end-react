/**
 * @file DataContext.js
 * @description Contexto de datos de negocio (lugares, favoritos, comentarios).
 *
 * Este archivo será implementado por el equipo de datos.
 * Mientras tanto, exportamos un provider placeholder para que
 * la app compile sin error.
 *
 * Pendiente del documento:
 * - Reducer con acciones: SET_LUGARES, ADD_FAVORITO, REMOVE_FAVORITO,
 *   ADD_COMENTARIO, SET_ERROR
 * - Entidades JSON: Usuario, Rol, Lugar, CategoriaLugar, Direccion,
 *   Imagen, Comentario, Favorito
 * - handleToggleFavorito y handleAgregarComentario (sección 4.2)
 */
import React, { createContext, useContext, useReducer } from 'react';

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
    // TODO: implementar casos del reducer según documento
    case 'SET_LUGARES':
      return { ...state, lugares: action.payload };
    case 'ADD_FAVORITO':
    case 'REMOVE_FAVORITO':
    case 'ADD_COMENTARIO':
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const value = {
    ...state,
    // TODO: exponer funciones handleToggleFavorito, handleAgregarComentario
    dispatch,
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
