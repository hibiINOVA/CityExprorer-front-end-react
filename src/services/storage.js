/**
 * @file storage.js
 * @description Capa de persistencia local para CityExplorer.
 *
 * Regla del documento (sección 5.2 - Capa de Persistencia Local):
 *  - access_token  -> expo-secure-store  (dato sensible, cifrado en el llavero del SO)
 *  - perfil cacheado (nombre, correo, id_rol) -> AsyncStorage (no sensible)
 *  - isGuest -> AsyncStorage (se persiste entre sesiones)
 *
 * En web, expo-secure-store no está disponible, por lo que el token se
 * respalda en AsyncStorage (misma capa que el resto de datos no sensibles).
 */
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEYS = {
  TOKEN: 'access_token',
  PROFILE: 'cached_profile',
  IS_GUEST: 'is_guest',
};

// ---------- Token (SecureStore nativo / AsyncStorage en web) ----------

async function secureGetItem(key) {
  if (Platform.OS === 'web') return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function secureSetItem(key, value) {
  if (Platform.OS === 'web') return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

async function secureDeleteItem(key) {
  if (Platform.OS === 'web') return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export async function saveToken(token) {
  await secureSetItem(KEYS.TOKEN, token);
}

export async function getToken() {
  return secureGetItem(KEYS.TOKEN);
}

export async function deleteToken() {
  await secureDeleteItem(KEYS.TOKEN);
}

// ---------- Perfil cacheado (AsyncStorage) ----------

export async function saveCachedProfile(profile) {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function getCachedProfile() {
  const raw = await AsyncStorage.getItem(KEYS.PROFILE);
  return raw ? JSON.parse(raw) : null;
}

// ---------- Estado de invitado (AsyncStorage) ----------

export async function saveIsGuest(value) {
  await AsyncStorage.setItem(KEYS.IS_GUEST, value ? '1' : '0');
}

export async function getIsGuest() {
  const raw = await AsyncStorage.getItem(KEYS.IS_GUEST);
  return raw === '1';
}

// ---------- Limpieza total (logout) ----------

export async function clearSession() {
  await deleteToken();
  await AsyncStorage.removeMany([KEYS.PROFILE, KEYS.IS_GUEST]);
}
