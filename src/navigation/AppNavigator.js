import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '../store/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import SplashScreen from '../screens/SplashScreen';

const RootStack = createNativeStackNavigator();

// TODO deep linking (Módulo 1 - Retos de la Transformación Móvil):
// configurar aquí `linking` con los prefixes y el mapa de rutas para que
// notificaciones/enlaces compartidos abran directamente la pestaña y
// pantalla correctas (enrutamiento dinámico).
const AppNavigator = () => {
  const { isLoading, isAuthenticated, isGuest } = useAuthContext();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated || isGuest ? (
          <RootStack.Screen name="Main" component={MainStack} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
