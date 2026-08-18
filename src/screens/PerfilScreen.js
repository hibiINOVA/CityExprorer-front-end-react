import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../store/AuthContext';
import { storageUrl } from '../services/api';
import EmptyState from '../components/EmptyState';
import { colors, typography, spacing, radius } from '../theme/theme';

const nombreRol = (idRol) => {
  if (idRol === 2) return 'Anunciante';
  if (idRol === 3) return 'Administrador';
  return 'Usuario';
};

export default function PerfilScreen({ navigation }) {
  const { userSession, isGuest, logout } = useAuthContext();

  if (isGuest) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Perfil</Text>
        </View>
        <EmptyState
          icon="person-circle-outline"
          title="Perfil"
          message="Regístrate o inicia sesión para guardar tus favoritos, escribir reseñas y personalizar tu perfil."
          actionLabel="Iniciar Sesión"
          onAction={logout}
        />
      </SafeAreaView>
    );
  }

  const nombreCompleto = [
    userSession?.nombre,
    userSession?.apellidoP,
    userSession?.apellidoM,
  ]
    .filter(Boolean)
    .join(' ');

  const opciones = [
    {
      key: 'modificar',
      icono: 'create-outline',
      label: 'Modificar Información',
      onPress: () => navigation.navigate('ModificarInfo'),
    },
    {
      key: 'ayuda',
      icono: 'help-circle-outline',
      label: 'Ayuda',
      onPress: () => navigation.navigate('Ayuda'),
    },
    {
      key: 'terminos',
      icono: 'document-text-outline',
      label: 'Términos del Servicio',
      onPress: () => navigation.navigate('Terminos'),
    },
    {
      key: 'privacidad',
      icono: 'shield-checkmark-outline',
      label: 'Política de Privacidad',
      onPress: () => navigation.navigate('Privacidad'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cardHeader}>
          {userSession?.foto_perfil ? (
            <Image source={{ uri: storageUrl(userSession.foto_perfil) }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={44} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{nombreCompleto || 'Usuario'}</Text>
            <Text style={styles.email}>{userSession?.correo || ''}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{nombreRol(userSession?.id_rol)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menu}>
          {opciones.map((opcion) => (
            <Pressable
              key={opcion.key}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={opcion.onPress}
            >
              <Ionicons name={opcion.icono} size={22} color={colors.primary} />
              <Text style={styles.menuLabel}>{opcion.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerText: {
    fontSize: 18,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EEE8E3',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.h2,
    fontSize: 20,
  },
  email: {
    ...typography.caption,
    fontSize: 14,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 223, 217, 0.5)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  menu: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuItemPressed: {
    backgroundColor: '#FAF7F4',
  },
  menuLabel: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 15,
  },
});