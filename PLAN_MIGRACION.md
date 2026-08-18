# Plan: Migrar la parte de **Usuario Final + Invitado** de Angular → React Native

## Contexto y hallazgos

**La app React (`CityExprorer-front-end-react`) ya tiene migrado el esqueleto:**
- ✅ Auth completo: login, registro, invitado, logout, hidratación con SecureStore/AsyncStorage, `RequireAuth`.
- ✅ Navegación: `AuthStack` (IniciarRegistro/InicioSesion/Registro) + `MainStack` con 5 tabs (Home, Destinos, Buscar, Favoritos, Perfil) y pantallas de detalle.
- ✅ Theme, ErrorBoundary, storage.
- ⛔ **9 pantallas son stubs** (Destinos, DestinoDetalle, Buscar, Favoritos, Comentarios, Resenia, ModificarInfo, Ayuda, Perfil).
- ⛔ `api.js` solo tiene auth; `DataContext` es esqueleto vacío.
- ⛔ Falta: restablecer contraseña, Términos/Privacidad, tracking de visitas.

**Backend confirmado** (rutas reales en `BackEnd-CityExplorer/routes/api.php` y controllers):
- Públicos: `GET /lugar` (array directo de lugares activos con `imagenes`), `GET /lugar/{id}`, `GET /lugar/{id}/imagenes` (`[{id_imagen, url}]`), `GET /categorias` (`{estatus, data}`), `GET /direccion-publica/{id}`, `GET /lugar/{id}/comentarios` (`{estatus, data, total}`), `POST /estadisticas-visitas`, `POST /password/{forgot,reset,check-status}`.
- Con Bearer: `GET /favoritos` (`{success, data}`), `GET /favoritos/check/{id}` (`{success, es_favorito}`), `POST /favoritos/toggle` (`{success, action:'added'|'removed'}`), `POST /comentarios`, `PUT /comentarios/{id}`, `GET /comentarios/{id}`, `GET /usuario/{id}`, `POST /usuario/{id}/update` (FormData), `POST /logout`.

**Decisiones tomadas:**
- Trabajar **solo** dentro de `CityExprorer-front-end-react`, **sin tocar el backend**. La URL base se deja como está (constante centralizada en `src/services/api.js`, port 8000), sin interferir.
- Completar el esqueleto existente (rellenar stubs), no reconstruir.
- **Bloquear login** para roles 2 (anunciante) y 3 (admin): tras `POST /user/login`, si `id_rol ≠ 1` → error "Módulo no disponible en la app móvil" y no se persiste sesión.
- Incluir: **restablecer contraseña**, **Términos/Privacidad**, **tracking de visitas**.

---

## Fase 1 — Capa de datos y API

**Modificar `src/services/api.js`:** agregar los endpoints de negocio:
- `getLugares()`, `getLugar(id)`, `getImagenes(id)`, `getCategorias()`, `getDireccion(id)`, `getComentarios(id)`, `getComentario(id)`, `createComentario({contenido, valoracion, id_lugar})`, `updateComentario(id, {...})`, `getFavoritos()`, `checkFavorito(id)`, `toggleFavorito(id)`, `registrarVisita({id_lugar, id_usuario, tiempo_visita})`, `getUsuario(id)`, `updateUsuario(id, formData)`, `forgotPassword(correo)`, `checkPasswordStatus(correo)`, `resetPassword({correo, code, password, password_confirmation})`.
- Agregar helper `storageUrl(path)` para construir `{base}/storage/{foto_perfil}` (el backend devuelve rutas relativas para fotos de perfil).

**Implementar `src/store/DataContext.js`:** reducer con `SET_LUGARES`, `SET_FAVORITOS`, `SET_COMENTARIOS`, `TOGGLE_FAVORITO`, `ADD/UPDATE_COMENTARIO`, `SET_LOADING`, `SET_ERROR` (arreglar el bug actual donde todos caen en el mismo case) y exponer `fetchLugares`, `fetchFavoritos`, `fetchComentarios`, `handleToggleFavorito`, `handleAgregarComentario`.

## Fase 2 — Auth: bloquear roles no-usuario

**Modificar `src/store/AuthContext.js`:** en `login()`, tras recibir el usuario, validar `user.id_rol === 1`; si es 2/3 lanzar error (mensaje claro) y **no** guardar token/perfil (no se persiste la sesión). Igual en la hidratación tras `GET /perfil` (por si hubiera una caché antigua). No tocar `register()` (siempre crea rol 1).

## Fase 3 — Pantallas de negocio (rellenar stubs)

Componentes compartidos nuevos (en `src/components/`): `StarRating`, `ImageGallery` (carrusel con flechas como en Angular), `DestinoCard`, `EmptyState`.

| Pantalla | Archivo | Funcionalidad a implementar (API) |
|---|---|---|
| **Destinos** | `DestinosScreen.js` | Listado de lugares activos: `getLugares` + `getImagenes` + `getComentarios` (promedio estrellas). Buscador por nombre/descripción y filtro por estrellas (como `destinos.component.ts`). Recibe `categoryId` del Home para filtrar (función de `categoria-vista`). Navega a DestinoDetalle. |
| **Detalle** | `DestinoDetalleScreen.js` | `getLugar`, `getDireccion`, `getImagenes`, `getComentarios`, `getCategorias`, `checkFavorito` (si logueado). Galería, descripción, web/teléfono/horarios/días, dirección, categoría, promedio + última reseña. Botón corazón → `toggleFavorito` (invitado → alerta → login). Botones "Escribir/Modificar Reseña" y "Todas las Reseñas". **Tracking de visitas** con AppState (≥5s, ping cada 30s → `registrarVisita`). |
| **Comentarios** | `ComentariosScreen.js` | `getComentarios(id)` → lista de reseñas con autor, fecha, estrellas, promedio y total. Invitado → prompt de login (como Angular). |
| **Reseña** | `ReseniaScreen.js` (ya en `RequireAuth`) | Form crear/editar: 1-5 estrellas + texto (30–500 chars). Si el usuario ya reseñó → modo edición (`id_resenia` desde `getComentarios`), `PUT /comentarios/{id}`, si no `POST /comentarios`. |
| **Favoritos** | `FavoritosScreen.js` | `getFavoritos` + filtro por categoría (`getCategorias`) + `getImagenes` + promedio. Botón corazón para quitar (`toggleFavorito` → recarga). **Invitado → EmptyState con prompt de login.** |
| **Buscar** | `BuscarScreen.js` | Búsqueda por nombre/descripción sobre `getLugares` + filtro de estrellas. Navega a detalle. |
| **Perfil** | `PerfilScreen.js` | Resumen del perfil (`userSession`: avatar `storageUrl(foto_perfil)`, nombre, correo). Acciones: **Modificar Información** (→ ModificarInfo, protegida), **Cerrar Sesión**, links a Ayuda/Términos/Privacidad. Invitado → login. |
| **Modificar Info** | `ModificarInfoScreen.js` (ya en `RequireAuth`) | Form nombre/apellidos (correo deshabilitado), foto con `expo-image-picker` (≤2MB, reutilizar patrón de Registro), `getUsuario(id)` para precargar y `updateUsuario(id, FormData)` para guardar. |
| **Ayuda** | `AyudaScreen.js` | FAQ estático (copiar contenido de `ayuda.component.html`). |
| **Términos** (nuevo) | `TerminosScreen.js` | Estática (copiar de `terminos-del-servicio.component.html`, adaptada a móvil). |
| **Privacidad** (nuevo) | `PrivacidadScreen.js` | Estática (copiar de `politicas-de-privacidad.component.html`). |
| **Restablecer** (nuevo) | `RestablecerScreen.js` | 3 pasos: correo (`password/forgot`) → código con cuenta regresiva y reenvío (`password/check-status`) → nueva clave (`password/reset`). |
| **Home** | `HomeScreen.js` | Reemplazar categorías hardcodeadas por `getCategorias` (mapeando iconos Ionicons). Mantener hero, banner invitado y FAB. |

## Fase 4 — Navegación y flujos

- **`AuthStack.js`**: agregar `Restablecer` y conectar el link "¿Olvidaste tu contraseña?" de `InicioSesionScreen` (hoy es un `Pressable` sin acción).
- **`MainStack.js`**: registrar `Ayuda`, `Terminos`, `Privacidad`. Resolver la duplicidad del nombre `Destinos` (tab vs. pantalla de stack): dejar el tab como listado y usar la pantalla de stack para recibir `categoryId`/deep-links (o renombrar la del stack) para que `navigation.navigate` no sea ambiguo.
- Flujo invitado: todas las acciones que requieren sesión (favoritos, reseñas, comentarios, modificar perfil) detectan `isGuest` y redirigen a login (patrón ya usado en `RequireAuth`).
- Perfil: en `PerfilScreen`/`ModificarInfo` usar `userSession.id_usuario` para armar las rutas de `usuario/{id}`.

## Fase 5 — Verificación

- No hay lint/test configurados en el repo React. Verificación: `npx expo export --platform web` (o `npx expo start`) para comprobar que el bundle compila sin errores de sintaxis/imports, y prueba manual del flujo contra el backend (login rol 1, invitado, favoritos, reseñas, restablecer).
- No se toca el backend ni la app Angular.

---

**Orden sugerido de ejecución:** Fase 1 (API+DataContext) → Fase 2 (bloqueo de roles) → Fase 3 (pantallas, de las más simples a las más complejas: Ayuda/Términos/Privacidad → Buscar → Destinos → Favoritos → Comentarios → Reseña → Detalle → Modificar/Perfil → Restablecer → Home) → Fase 4 (navegación) → Fase 5 (verificación).
