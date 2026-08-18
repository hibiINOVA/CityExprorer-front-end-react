import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../theme/theme';

const secciones = [
  {
    icono: '📱',
    titulo: '¿Cómo usar la app?',
    items: [
      'Navega entre secciones usando el menú inferior',
      'Filtra por categoría o busca lugares específicos',
      'Toca cualquier lugar para ver detalles completos',
      'Agrega favoritos tocando el corazón ❤️',
      'Usa el filtro de estrellas para los mejores lugares',
    ],
  },
  {
    icono: '💡',
    titulo: 'Tips Locales',
    items: [
      'Verifica horarios: algunos cierran entre semana',
      'Lleva efectivo: no todos aceptan tarjeta',
      'El atardecer desde el mirador es imperdible 📸',
      'Fines de semana: ve temprano por estacionamiento',
      'Pregunta por menús del día (más económicos)',
      'Prueba el tranvía turístico para recorridos',
      'Explora mercados locales para experiencias auténticas',
      'Lleva chamarra: el clima cambia rápido',
      'Evita tacos turísticos, busca los de locales 😉',
      'Muchos eventos culturales son gratuitos',
    ],
  },
  {
    icono: '♿',
    titulo: 'Accesibilidad',
    items: [
      'Centro histórico con escalones y empedrado',
      'Busca el ícono ♿ para acceso en silla de ruedas',
      'Jardín Principal tiene rampas en varias entradas',
      'Consulta por baños adaptados antes de visitar',
    ],
  },
];

const emergencias = [
  { nombre: 'Emergencias Generales', telefono: '911' },
  { nombre: 'Policía Municipal', telefono: '(415) 152-0022' },
  { nombre: 'Cruz Roja', telefono: '(415) 152-1616' },
  { nombre: 'Bomberos', telefono: '(415) 152-1888' },
];

const contactos = [
  { nombre: 'Email de Soporte', dato: 'ayuda@cityexplorer.mx' },
  { nombre: 'Reportar Problema', dato: 'bugs@cityexplorer.mx' },
  { nombre: 'Sugerir Lugares', dato: 'lugares@cityexplorer.mx' },
  { nombre: 'WhatsApp', dato: '+52 415 123-4567' },
];

const glosario = [
  { termino: 'El Jardín', definicion: 'La plaza principal de San Miguel (Jardín Principal)' },
  { termino: 'La Parroquia', definicion: 'La icónica iglesia rosa del centro' },
  { termino: 'Gringo/a', definicion: 'Término amigable para extranjeros (principalmente estadounidenses)' },
  { termino: 'Cantina', definicion: 'Bar tradicional mexicano' },
  { termino: 'Comida Corrida', definicion: 'Menú del día con precio fijo' },
  { termino: 'Mercado', definicion: 'Mercado local con comida y productos frescos' },
];

export default function AyudaScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>City Explorer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Ayuda e Información</Text>
          <Text style={styles.heroSubtitle}>
            Tu guía completa para descubrir los mejores lugares de San Miguel de Allende, la joya colonial de México
          </Text>
        </View>

        {secciones.map((seccion) => (
          <View key={seccion.titulo} style={styles.card}>
            <Text style={styles.cardTitle}>
              {seccion.icono} {seccion.titulo}
            </Text>
            {seccion.items.map((item, i) => (
              <Text key={i} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🆘 Información de Emergencia</Text>
          {emergencias.map((item) => (
            <Text key={item.nombre} style={styles.listItem}>
              <Text style={styles.bold}>{item.nombre}:</Text> {item.telefono}
            </Text>
          ))}
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Hospital de la Fe:</Text> Calle Insurgentes #22
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Farmacia 24hrs:</Text> Libramiento Jose Manuel Zavala
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>ATMs:</Text> Jardín Principal, Plaza Colonial, Mega
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📞 Contacto y Soporte</Text>
          {contactos.map((item) => (
            <Text key={item.nombre} style={styles.listItem}>
              <Text style={styles.bold}>{item.nombre}:</Text> {item.dato}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌐 Glosario Local</Text>
          {glosario.map((item) => (
            <Text key={item.termino} style={styles.listItem}>
              <Text style={styles.bold}>{item.termino}:</Text> {item.definicion}
            </Text>
          ))}
        </View>

        <Text style={styles.footer}>Versión 1.0 | Actualizada en Agosto 2025</Text>
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
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 24,
    color: '#FFFFFF',
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    fontSize: 17,
    marginBottom: spacing.sm,
  },
  listItem: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});