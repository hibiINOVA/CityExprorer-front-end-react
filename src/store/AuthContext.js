/**
 * @file AuthContext.js
 * @description Gestiona el estado global de autenticación.
 * Estados: isAuthenticated, isGuest, isLoading, userSession, token
 * Funciones expuestas: login(), register(), logout(), guestLogin()
 *
 * La hidratación al arrancar sigue el "Diagrama de Deshidratación":
 *  1. isLoading = true -> se muestra SplashScreen
 *  2. Leer access_token desde SecureStore
 *     - Si NO hay token -> leer isGuest desde AsyncStorage
 *         - isGuest true  -> isGuest = true, navegar a MainStack
 *         - isGuest false -> mostrar AuthStack (LoginScreen)
 *     - Si SÍ hay token -> leer perfil cacheado desde AsyncStorage
 *         -> mostrar datos cacheados mientras se valida
 *         -> GET /perfil con Bearer Token
 *             - éxito  -> guardar perfil en AsyncStorage, isAuthenticated = true, navegar a MainStack
 *             - error  -> limpiar SecureStore y AsyncStorage, mostrar AuthStack (LoginScreen)
 */
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import {
  saveToken,
  deleteToken,
  saveCachedProfile,
  getCachedProfile,
  saveIsGuest,
  getIsGuest,
  clearSession,
  getToken,
} from '../services/storage';
import {
  loginRequest,
  registerRequest,
  getPerfilRequest,
  logoutRequest,
} from '../services/api';

const initialState = {
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  userSession: null,
  token: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_START':
      return { ...state, isLoading: true };
    case 'HYDRATE_AS_GUEST':
      return { ...state, isLoading: false, isGuest: true };
    case 'HYDRATE_SHOW_CACHED_PROFILE':
      return { ...state, userSession: action.payload };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        isGuest: false,
        userSession: action.payload.user,
        token: action.payload.token,
      };
    case 'HYDRATE_FAIL':
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ---------- Hidratación al montar la app ----------
  useEffect(() => {
    (async () => {
      dispatch({ type: 'HYDRATE_START' });
      try {
        const token = await getToken();

        if (!token) {
          const isGuest = await getIsGuest();
          if (isGuest) {
            dispatch({ type: 'HYDRATE_AS_GUEST' });
          } else {
            dispatch({ type: 'HYDRATE_FAIL' });
          }
          return;
        }

        // Hay token: mostrar caché mientras se valida contra el servidor
        const cachedProfile = await getCachedProfile();
        if (cachedProfile) {
          dispatch({ type: 'HYDRATE_SHOW_CACHED_PROFILE', payload: cachedProfile });
        }

        const perfil = await getPerfilRequest();
        await saveCachedProfile(perfil);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: perfil, token } });
      } catch (error) {
        // Token inválido/expirado -> limpiar todo y mandar a AuthStack
        try { await clearSession(); } catch (_) { /* seguro falla silencioso */ }
        dispatch({ type: 'HYDRATE_FAIL' });
      }
    })();
  }, []);

  // ---------- login ----------
  const login = useCallback(async (correo, password) => {
    const { token, user } = await loginRequest(correo, password);
    if (!token || !user) throw new Error('Login: respuesta inválida del servidor');
    await saveToken(token);
    await saveCachedProfile(user);
    await saveIsGuest(false);
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
  }, []);

  const register = useCallback(async ({ nombre, apellidoP, apellidoM, correo, password, foto_perfil }) => {
    const { token, user } = await registerRequest({
      nombre,
      apellidoP,
      apellidoM,
      correo,
      password,
      id_rol: 1,
      foto_perfil,
    });
    if (!token || !user) throw new Error('Register: respuesta inválida del servidor');
    await saveToken(token);
    await saveCachedProfile(user);
    await saveIsGuest(false);
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
  }, []);

  // ---------- guestLogin ----------
  const guestLogin = useCallback(async () => {
    await saveIsGuest(true);
    dispatch({ type: 'HYDRATE_AS_GUEST' });
  }, []);

  // ---------- logout ----------
  // Sigue el diagrama: POST /logout -> SecureStore.delete -> AsyncStorage.clear -> reset -> AuthStack
  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Si el backend ya no responde o el token expiró, igual limpiamos localmente
    }
    await clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  return context;
};
