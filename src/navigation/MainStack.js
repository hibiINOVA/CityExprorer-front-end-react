import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavegacionPrincipal from './NavegacionPrincipal';
import DestinosScreen from '../screens/DestinosScreen';
import DestinoDetalleScreen from '../screens/DestinoDetalleScreen';
import ComentariosScreen from '../screens/ComentariosScreen';
import ReseniaScreen from '../screens/ReseniaScreen';
import ModificarInfoScreen from '../screens/ModificarInfoScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // Libera recursos del árbol nativo para vistas no visibles,
      // optimizando el uso de memoria RAM en el dispositivo.
      detachInactiveScreens: true,
    }}
  >
    <Stack.Screen name="Tabs" component={NavegacionPrincipal} />
    <Stack.Screen name="Destinos" component={DestinosScreen} />
    <Stack.Screen name="DestinoDetalle" component={DestinoDetalleScreen} />
    <Stack.Screen name="Comentarios" component={ComentariosScreen} />
    <Stack.Screen name="Resenia" component={ReseniaScreen} />
    <Stack.Screen name="ModificarInfo" component={ModificarInfoScreen} />
  </Stack.Navigator>
);

export default MainStack;
