# CityExplorer RN — módulo de Navegación + Auth + Persistencia

Bloque completo de autenticación, navegación y persistencia local.
Equipo: miguel (tuyo).

## Stack

- Expo SDK 57 + React Native 0.86 + React 19
- React Navigation 7 (native-stack + bottom-tabs)
- expo-secure-store (token JWT cifrado)
- AsyncStorage (perfil cacheado + estado invitado)
- Axios (cliente HTTP con interceptor Bearer)

## Arranque rápido

```bash
npm install
npx expo prebuild
npx expo run:android
```

## Estructura

```
src/
├── navigation/
│   ├── AppNavigator.js        # NavigationContainer + condicional Auth/Main
│   ├── AuthStack.js           # IniciarRegistro → InicioSesion / Registro
│   ├── MainStack.js           # Tabs + pantallas anidadas
│   └── NavegacionPrincipal.js # Bottom Tabs (Home, Favoritos, Ayuda, Perfil)
├── store/
│   ├── AuthContext.js          # Auth global: login, register, guestLogin, logout + hidratación
│   └── DataContext.js          # Placeholder — implementar por equipo datos
├── services/
│   ├── storage.js              # SecureStore + AsyncStorage
│   └── api.js                  # Axios + endpoints auth
├── screens/                    # Placeholders funcionales (13 screens)
└── theme/
    └── theme.js                # Tokens de diseño — ajustar valores del documento
```

## Ajustar backend

En `src/services/api.js`, cambiar `BASE_URL` a IP real del backend Laravel.

## Pendientes (otros equipos)

- DataContext.js + endpoints negocio → equipo datos
- UI real pantallas → equipo negocio
- Componentes atómicos (AppButton, InputField, etc.) → equipo diseño
- Deep linking → TODO en AppNavigator.js
