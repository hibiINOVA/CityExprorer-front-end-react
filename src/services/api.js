/**
 * @file api.js
 * @description Cliente HTTP hacia el backend Laravel/Sanctum.
 * Solo se exponen aquí los endpoints de autenticación (login, register,
 * perfil, logout). Los endpoints de negocio (lugares, favoritos,
 * comentarios) los agrega quien trabaje DataContext.
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
  return data; // se espera el objeto Usuario
}

export async function logoutRequest() {
  // Revoca el token en el backend (Sanctum)
  await api.post('/logout');
}
