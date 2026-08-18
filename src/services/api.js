/**
 * @file api.js
 * @description Cliente HTTP hacia el backend Laravel/Sanctum.
 * Incluye autenticación y todos los endpoints de negocio del flujo
 * de usuario final / invitado (lugares, categorías, favoritos, comentarios,
 * perfil, restablecer contraseña, estadísticas de visitas).
 */
import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from './storage';

// Configuración de la URL del backend Laravel en puerto 8000
const BASE_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api',
  default: 'http://localhost:8000/api',
});

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Adjunta el Bearer token a cada petición si existe
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Construye la URL completa de un archivo servido desde /storage.
 * El backend devuelve rutas relativas (p. ej. "fotos_perfil/xxx.jpg")
 * para fotos de perfil; los endpoints de imágenes de lugares ya
 * devuelven la URL absoluta.
 */
export function storageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = BASE_URL.replace(/\/api$/, '');
  return `${base}/storage/${path}`;
}

// ---------- Endpoints de autenticación ----------

export async function loginRequest(correo, password) {
  const { data } = await api.post('/user/login', { correo, password });
  // El backend devuelve: { estatus, access_token, data: { ...usuario } }
  return { token: data.access_token, user: data.data };
}

export async function registerRequest(payload) {
  // payload: { nombre, apellidoP, apellidoM, correo, password, id_rol, foto_perfil }
  const formData = new FormData();
  formData.append('nombre', payload.nombre);
  formData.append('apellidoP', payload.apellidoP);
  formData.append('apellidoM', payload.apellidoM || '');
  formData.append('correo', payload.correo);
  formData.append('password', payload.password);
  formData.append('id_rol', String(payload.id_rol ?? 1));

  if (payload.foto_perfil) {
    const uri = payload.foto_perfil;
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    // En React Native, adjuntamos la imagen en este formato especial para FormData
    formData.append('foto_perfil', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
  }

  const { data } = await api.post('/user/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // El backend devuelve: { estatus, data: { token, usuario: { ... } } }
  return { token: data.data.token, user: data.data.usuario };
}

export async function getPerfilRequest() {
  const { data } = await api.get('/perfil');
  // El backend devuelve { estatus, data: { ...usuario } }
  return data.data;
}

export async function logoutRequest() {
  // Revoca el token en el backend (Sanctum)
  await api.post('/logout');
}

// ---------- Lugares y categorías ----------

export async function getLugares() {
  const { data } = await api.get('/lugar');
  // Respuesta: array directo de lugares activos (con relación "imagenes")
  return data;
}

export async function getLugar(id) {
  const { data } = await api.get(`/lugar/${id}`);
  return data;
}

export async function getImagenes(id) {
  const { data } = await api.get(`/lugar/${id}/imagenes`);
  // Respuesta: [{ id_imagen, url }]
  return data;
}

export async function getCategorias() {
  const { data } = await api.get('/categorias');
  // Respuesta: { estatus, data: [{ id_categoria, nombre, descripcion, icono }] }
  return data.data;
}

export async function getDireccion(id) {
  const { data } = await api.get(`/direccion-publica/${id}`);
  return data;
}

// ---------- Comentarios / reseñas ----------

export async function getComentarios(idLugar) {
  const { data } = await api.get(`/lugar/${idLugar}/comentarios`);
  // Respuesta: { estatus, data: [...], total }
  return data;
}

export async function getEstadisticasLugar(idLugar) {
  const { data } = await api.get(`/lugar/${idLugar}/estadisticas`);
  // Respuesta: { estatus, data: { promedio_valoracion, total_comentarios } }
  return data.data;
}

export async function getComentario(id) {
  const { data } = await api.get(`/comentarios/${id}`);
  // Respuesta: { estatus, data: {...} }
  return data.data;
}

export async function createComentario({ contenido, valoracion, id_lugar }) {
  const { data } = await api.post('/comentarios', { contenido, valoracion, id_lugar });
  return data;
}

export async function updateComentario(id, { contenido, valoracion }) {
  const { data } = await api.put(`/comentarios/${id}`, { contenido, valoracion });
  return data;
}

// ---------- Favoritos ----------

export async function getFavoritos() {
  const { data } = await api.get('/favoritos');
  // Respuesta: { success, data: [{ id_favorito, id_usuario, id_lugar, fecha_agregado, lugar }] }
  return data.data;
}

export async function checkFavorito(idLugar) {
  const { data } = await api.get(`/favoritos/check/${idLugar}`);
  // Respuesta: { success, es_favorito }
  return data.es_favorito;
}

export async function toggleFavorito(idLugar) {
  const { data } = await api.post('/favoritos/toggle', { id_lugar: idLugar });
  // Respuesta: { success, action: 'added' | 'removed', message }
  return data;
}

// ---------- Usuario / perfil ----------

export async function getUsuario(id) {
  const { data } = await api.get(`/usuario/${id}`);
  // Respuesta: { estatus, data: { ...usuario } }
  return data.data;
}

export async function updateUsuario(id, formData) {
  const { data } = await api.post(`/usuario/${id}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ---------- Estadísticas de visitas ----------

export async function registrarVisita({ id_lugar, id_usuario, tiempo_visita }) {
  const { data } = await api.post('/estadisticas-visitas', {
    id_lugar,
    id_usuario,
    tiempo_visita,
  });
  return data;
}

// ---------- Restablecer contraseña ----------

export async function forgotPassword(correo) {
  const { data } = await api.post('/password/forgot', { correo });
  return data;
}

export async function checkPasswordStatus(correo) {
  const { data } = await api.post('/password/check-status', { correo });
  return data;
}

export async function resetPassword({ correo, code, password, password_confirmation }) {
  const { data } = await api.post('/password/reset', {
    correo,
    code,
    password,
    password_confirmation,
  });
  return data;
}