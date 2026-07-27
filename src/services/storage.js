/**
 * @file storage.js
 * @description Capa de persistencia local para CityExplorer.
 *
 * Regla del documento (sección 5.2 - Capa de Persistencia Local):
 *  - access_token  -> expo-secure-store  (dato sensible, cifrado en el llavero del SO)
 *  - perfil cacheado (nombre, correo, id_rol) -> AsyncStorage (no sensible)
 *  - isGuest -> AsyncStorage (se persiste entre sesiones)
 */
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: 'access_token',
  PROFILE: 'cached_profile',
  IS_GUEST: 'is_guest',
};

// ---------- Token (SecureStore) ----------

export async function saveToken(token) {
  await SecureStore.setItemAsync(KEYS.TOKEN, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(KEYS.TOKEN);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(KEYS.TOKEN);
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
  await AsyncStorage.multiRemove([KEYS.PROFILE, KEYS.IS_GUEST]);
}
