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
 * Corrige doble codificación UTF-8 ("mojibake").
 * El backend puede devolver p. ej. "emblemÃ¡tico" en lugar de "emblemático"
 * porque los bytes UTF-8 (0xC3 0xA1) se interpretaron como Latin-1.
 * Solo actúa cuando la cadena contiene caracteres U+00C2/U+00C3
 * (que nunca aparecen en español correcto) y valida la secuencia UTF-8.
 */
function fixUtf8(str) {
  if (typeof str !== 'string') return str;
  if (!/[\u00C2\u00C3]/.test(str)) return str;

  try {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code <= 0xff) {
        bytes.push(code);
      } else {
        // Carácter fuera de Latin-1: no es mojibake puro, devolver original.
        return str;
      }
    }

    const out = [];
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if (b < 0x80) {
        out.push(String.fromCharCode(b));
      } else if ((b & 0xe0) === 0xc0 && i + 1 < bytes.length) {
        const b2 = bytes[i + 1];
        if ((b2 & 0xc0) !== 0x80) return str;
        i += 1;
        out.push(String.fromCharCode(((b & 0x1f) << 6) | (b2 & 0x3f)));
      } else if ((b & 0xf0) === 0xe0 && i + 2 < bytes.length) {
        const b2 = bytes[i + 1];
        const b3 = bytes[i + 2];
        if ((b2 & 0xc0) !== 0x80 || (b3 & 0xc0) !== 0x80) return str;
        i += 2;
        out.push(String.fromCharCode(((b & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f)));
      } else {
        // Secuencia UTF-8 inválida: no corregir.
        return str;
      }
    }
    return out.join('');
  } catch (_) {
    return str;
  }
}

/** Recorre la respuesta y corrige todas las cadenas de texto. */
function deepFixUtf8(value) {
  if (Array.isArray(value)) {
    return value.map(deepFixUtf8);
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = deepFixUtf8(value[key]);
    }
    return result;
  }
  if (typeof value === 'string') {
    return fixImageUrl(fixUtf8(value));
  }
  return value;
}

// El backend guardó la URL completa (https://images.unsplash.com/...) y luego
// la devolvió prefijada con /storage/, generando URLs rotas. Aquí se limpian.
const STORAGE_PREFIX = `${BASE_URL.replace(/\/api$/, '')}/storage/`;

function fixImageUrl(url) {
  if (typeof url !== 'string') return url;
  if (url.startsWith(STORAGE_PREFIX)) {
    const rest = url.slice(STORAGE_PREFIX.length);
    if (/^https?:\/\//.test(rest)) return rest;
  }
  return url;
}

// Sanitiza el texto y las URLs de imágenes de las respuestas.
api.interceptors.response.use((response) => {
  if (response && response.data) {
    response.data = deepFixUtf8(response.data);
  }
  return response;
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