import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IniciarRegistroScreen from '../screens/IniciarRegistroScreen';
import InicioSesionScreen from '../screens/InicioSesionScreen';
import RegistroScreen from '../screens/RegistroScreen';
import RestablecerScreen from '../screens/RestablecerScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="IniciarRegistro" component={IniciarRegistroScreen} />
    <Stack.Screen name="InicioSesion" component={InicioSesionScreen} />
    <Stack.Screen name="Registro" component={RegistroScreen} />
    <Stack.Screen name="Restablecer" component={RestablecerScreen} />
  </Stack.Navigator>
);

export default AuthStack;
