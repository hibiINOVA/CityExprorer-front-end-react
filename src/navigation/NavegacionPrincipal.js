import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import AyudaScreen from '../screens/AyudaScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const NavegacionPrincipal = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      // Carga perezosa de secciones para evitar fetches innecesarios.
      lazy: true,
      unmountOnBlur: false, // Mantiene el estado de scroll del usuario.
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Favoritos" component={FavoritosScreen} />
    <Tab.Screen name="Ayuda" component={AyudaScreen} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
);

export default NavegacionPrincipal;
