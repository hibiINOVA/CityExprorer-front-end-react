import React from 'react';
import { useAuthContext } from '../store/AuthContext';
import ModalInfo from './common/ModalInfo';

/**
 * RequireAuth - HOC que intercepta componentes o pantallas
 * y requiere que el usuario esté autenticado.
 * Si es un invitado (isGuest = true), despliega un ModalInfo
 * y un botón para forzar el inicio de sesión.
 */
export default function RequireAuth({ children }) {
  const { isGuest, logout } = useAuthContext();

  if (isGuest) {
    return (
      <ModalInfo
        visible
        title="Acceso Restringido"
        message="Debes iniciar sesión para acceder a esta función. Únete a CityExplorer para disfrutar de todas las herramientas."
        buttonText="Ir a Iniciar Sesión"
        onClose={() => {
          // El logout limpia isGuest=false y la sesión, lo que
          // fuerza al AuthStack a mostrar la pantalla de Login.
          logout().catch(() => {});
        }}
      />
    );
  }

  // Si no es invitado, renderizamos el contenido protegido
  return <>{children}</>;
}