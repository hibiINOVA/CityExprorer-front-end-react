# Reporte de Avances: Módulos de Arquitectura, Autenticación y Persistencia

**De:** Miguel  
**Para:** Equipo de Desarrollo CityExplorer  
**Fecha:** 27 de Julio de 2026  

---

## 1. Resumen Ejecutivo

Se concluyeron al 100% las tareas asignadas de las Semanas 1, 2 y 4. 
La app móvil (React Native) cuenta con: navegación funcional (pestañas + stacks), 
persistencia local cifrada para tokens, flujo completo de autenticación 
(invitado, registro, inicio de sesión, cierre de sesión, hidratación al arranque)
y un HOC `RequireAuth` que protege pantallas restringidas.

El repositorio está listo para que el equipo de la Semana 3 desarrolle 
las pantallas de negocio sobre la infraestructura ya establecida.

---

## 2. Entregables y Estado del Frontend

### Arquitectura y Navegación
* **AppNavigator / MainStack / AuthStack / NavegacionPrincipal** — navegación anidada (tabs + stacks) operativa.
* **Optimización:** `lazy: true` en tabs, `detachInactiveScreens` en stack principal.
* **SplashScreen** — pantalla de carga mientras se hidrata la sesión.

### Autenticación (AuthContext)
* **Estados:** `isLoading`, `isAuthenticated`, `isGuest`, `userSession`, `token`.
* **Funciones:** `login()`, `register()`, `logout()`, `guestLogin()`.
* **Hidratación al arranque:** Lee `SecureStore` → ¿hay token? → valida contra backend o cae en invitado/login.
* **Controles de seguridad:** Validación de que `token` y `user` existan antes de persistir.

### Control de Acceso
* **RequireAuth (HOC)** — protege `ReseniaScreen` y `ModificarInfoScreen`. Usuario invitado ve mensaje + botón "Ir a Iniciar Sesión".

### API (capa de servicios)
* **Base URL:** `http://10.0.2.2:80/api` (emulador Android).
* **Endpoints:** `POST /user/login`, `POST /user/register`, `GET /perfil`, `POST /logout`.
* **Normalización de respuesta:** `normalizeAuth()` mapea `access_token` o `data.token` de Laravel a `{ token, user }`.

### Persistencia
* **SecureStore** — token guardado/leído/eliminado con cifrado nativo.
* **AsyncStorage** — perfil cacheado + estado de invitado.
* **Compatibilidad:** Adaptado a AsyncStorage v3 (`removeMany` en vez de `multiRemove`).

---

## 3. Observaciones Técnicas

### Backend (Laravel)
1. **Migraciones incompletas** — `php artisan migrate` falla porque faltan `CREATE TABLE` para `Usuario`, `Pago`, `Lugar`, etc. Se necesitan migraciones desde cero.
2. **Seeders requeridos** — La tabla `Rol` se genera vacía. El registro asigna `id_rol: 1` y Laravel responde HTTP 422 porque no existe ese rol. Hace falta un Seeder con los roles del sistema.
3. **Puerto 80 en Docker** — Laravel Sail expone en puerto `80`. La app apunta a `10.0.2.2:80/api` desde el emulador. Si cambian el puerto, actualizar `api.js`.
4. **Formato de respuesta** — La app espera que login/register devuelvan `{ token: string, user: object }` o `{ access_token: string, ... }`. Si la estructura difiere, solo hay que ajustar la función `normalizeAuth()` en `src/services/api.js`.

### Frontend (para el equipo)
5. **Pantallas placeholder** — `HomeScreen`, `DestinosScreen`, `DestinoDetalleScreen`, `FavoritosScreen`, `AyudaScreen` son stubs. El equipo de negocio/diseño debe reemplazarlos.
6. **DataContext** — `src/store/DataContext.js` es un esqueleto. Quien implemente favoritos/comentarios debe poblarlo.
7. **theme.js** — Tokens de diseño placeholder. El equipo de diseño debe reemplazar valores.
8. **`ASIGNACION_MODULOS.md`** — Archivo de referencia local, excluido de git. No subirlo.

---

## 4. Siguientes Pasos

| Equipo | Acción |
|---|---|
| Backend | Corregir migraciones, agregar seeders, confirmar estructura de respuestas |
| Diseño | Reemplazar tokens en `theme.js`, pulir pantallas de auth |
| Negocio/Datos | Implementar `DataContext`, pantallas de Semana 3, componentes atómicos |
| Miguel | Soporte para integración, ajustes en capa de API según backend real |
