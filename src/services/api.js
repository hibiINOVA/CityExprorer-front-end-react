/**
 * @file api.js
 * @description Cliente HTTP hacia el backend Laravel/Sanctum.
 * Solo se exponen aquí los endpoints de autenticación (login, register,
 * perfil, logout). Los endpoints de negocio (lugares, favoritos,
 * comentarios) los agrega quien trabaje DataContext.
 */
import axios from 'axios';
import { getToken } from './storage';

// TODO: ajustar a la URL real del backend Laravel una vez desplegado / en LAN
const BASE_URL = 'http://127.0.0.1:8000/api';

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
  const { data } = await api.post('/login', { correo, password });
  return data; // se espera { token, user }
}

export async function registerRequest(payload) {
  // payload: { nombre, apellidoP, apellidoM, correo, password, id_rol: 1 }
  const { data } = await api.post('/register', payload);
  return data; // se espera { token, user }
}

export async function getPerfilRequest() {
  const { data } = await api.get('/perfil');
  return data; // se espera el objeto Usuario
}

export async function logoutRequest() {
  // Revoca el token en el backend (Sanctum)
  await api.post('/logout');
}
