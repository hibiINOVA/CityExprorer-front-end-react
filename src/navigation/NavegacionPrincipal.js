import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DestinosScreen from '../screens/DestinosScreen';
import BuscarScreen from '../screens/BuscarScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors, radius } from '../theme/theme';

const Tab = createBottomTabNavigator();

const NavegacionPrincipal = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      lazy: true,
      unmountOnBlur: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? 76 : 60,
        paddingBottom: Platform.OS === 'ios' ? 16 : 8,
        paddingTop: 8,
      },
      tabBarIcon: ({ focused }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Destinos') {
          iconName = focused ? 'compass' : 'compass-outline';
        } else if (route.name === 'Buscar') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Favoritos') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        }

        if (focused) {
          return (
            <View style={styles.activeIconContainer}>
              <Ionicons name={iconName.replace('-outline', '')} size={22} color="#FFFFFF" />
            </View>
          );
        }

        return <Ionicons name={iconName} size={24} color={colors.textSecondary} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Destinos" component={DestinosScreen} />
    <Tab.Screen name="Buscar" component={BuscarScreen} />
    <Tab.Screen name="Favoritos" component={FavoritosScreen} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavegacionPrincipal;
