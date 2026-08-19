import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';

const secciones = [
  {
    titulo: '📍 Información del Responsable',
    items: [
      'Empresa: ExploreTech',
      'Domicilio: Calle Cardón 70, Palmita de Landeta, San Miguel De Allende, Guanajuato, México',
      'Teléfono: 4151123646',
      'Soporte: exploretech.support@gmail.com',
    ],
  },
  {
    titulo: '🎯 Finalidades del Tratamiento de Datos',
    items: [
      'Crear una cuenta en nuestro software.',
      'Acceder a las funcionalidades según el tipo de usuario.',
      'Utilizar el sistema de promoción de negocios.',
      'Procesar pagos con tarjeta de crédito o débito.',
      'Permitir descubrir lugares destacados en San Miguel de Allende.',
      'Mejorar la experiencia del usuario y la plataforma.',
      'Comunicarnos sobre actualizaciones, promociones y noticias relevantes.',
    ],
  },
  {
    titulo: '📊 Datos Personales que Recabamos',
    items: [
      'Nombre completo: identificación personal.',
      'Teléfono: contacto directo.',
      'Correo electrónico: comunicación y notificaciones.',
      'Dirección completa: calle, colonia, número, CP.',
      'Datos de tarjeta: número, fecha de expiración, titular y CVV.',
      'Datos de otras fuentes legales: directorios telefónicos, laborales e instituciones financieras.',
      'Nota: este proyecto NO recaba datos sensibles.',
    ],
  },
  {
    titulo: '📞 Contactos para Ejercer tus Derechos',
    items: [
      'Soporte General: exploretech.support@gmail.com',
      'Derechos ARCO: exploretech.heltp@gmail.com',
      'Atención al Cliente: exploretech.atencionalcliente@gmail.com',
      'Revocar Consentimiento: exploretech.atencionalcliente@gmail.com',
    ],
  },
  {
    titulo: '🚫 Cómo Limitar el Uso de tus Datos',
    items: [
      'Dejar de recibir promociones: desactiva notificaciones desde el último correo recibido.',
      'Correo postal: sigue las instrucciones del material publicitario.',
      'Solicitud directa: envía tu petición a exploretech.heltp@gmail.com.',
    ],
  },
  {
    titulo: '⚖️ Derechos ARCO',
    contenido:
      'Para ejercer los derechos de Acceso, Rectificación, Cancelación u Oposición, envía una solicitud que incluya: nombre del solicitante, teléfono de contacto, asunto (tipo de derecho) y una descripción clara de la solicitud con los documentos que la respalden.',
  },
  {
    titulo: '🔄 Cambios en el Aviso de Privacidad',
    contenido:
      'Este Aviso puede modificarse o actualizarse en cualquier momento. Te recomendamos revisar esta página periódicamente. Se notificará a los usuarios sobre cambios importantes mediante la aplicación y los medios de contacto proporcionados.',
  },
];

export default function PrivacidadScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerText}>City Explorer</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔒 Aviso de Privacidad</Text>

        {secciones.map((seccion) => (
          <View key={seccion.titulo} style={styles.card}>
            <Text style={styles.sectionTitle}>{seccion.titulo}</Text>
            {seccion.contenido ? <Text style={styles.text}>{seccion.contenido}</Text> : null}
            {seccion.items
              ? seccion.items.map((item, i) => (
                  <Text key={i} style={styles.listItem}>
                    • {item}
                  </Text>
                ))
              : null}
          </View>
        ))}

        <Text style={styles.footer}>
          Si tienes dudas sobre este Aviso de Privacidad o necesitas ejercer alguno de tus derechos,
          no dudes en contactarnos a exploretech.support@gmail.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.surface,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: typography.h1.fontFamily,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  listItem: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  footer: {
    ...typography.caption,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});