import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';

const secciones = [
  {
    titulo: 'ACEPTACIÓN DE LAS CONDICIONES',
    contenido:
      'Usted acepta que, al acceder o utilizar la Aplicación, ha leído, comprendido y aceptado todos estos Términos y Condiciones. Si no está de acuerdo, se le prohíbe expresamente utilizar la Aplicación y debe interrumpir su uso inmediatamente.',
  },
  {
    titulo: 'OBJETO DE LA APLICACIÓN',
    contenido:
      'La Aplicación ha sido diseñada con el objetivo principal de centralizar y actualizar la información turística de San Miguel de Allende (SMA), para mejorar la experiencia de los visitantes y fomentar el desarrollo económico local y sostenible.',
    items: [
      'Categorías detalladas: contenido organizado por intereses como comida, fiesta, bebidas, relax y sitios históricos.',
      'Comunidad activa: espacio para comentarios y valoraciones.',
      'Personalización: herramientas para guardar lugares favoritos.',
      'Sitios históricos: acceso a información cultural detallada.',
      'Gestión y moderación: un administrador responsable de mantener la calidad y seguridad del contenido.',
    ],
  },
  {
    titulo: 'DERECHOS DE PROPIEDAD INTELECTUAL',
    contenido:
      'A menos que se indique lo contrario, la Aplicación, su código fuente, funcionalidad, diseño, contenido y marcas son propiedad exclusiva de ExploreTech o han sido licenciados a esta. Se prohíbe cualquier copia, modificación no autorizada, extracción del código fuente o creación de versiones derivadas.',
  },
  {
    titulo: 'OBLIGACIONES DEL USUARIO',
    items: [
      'Mantener la seguridad de su dispositivo y el acceso a la Aplicación.',
      'No utilizar la Aplicación para fines ilegales o no autorizados.',
      'No recopilar sistemáticamente datos o contenidos sin permiso.',
      'No eludir, desactivar o interferir con las funciones de seguridad.',
      'No realizar ningún uso automatizado del sistema.',
      'Participar activamente en la comunidad de manera respetuosa y veraz.',
    ],
  },
  {
    titulo: 'CONTRIBUCIONES Y RESEÑAS DE USUARIOS',
    contenido:
      'Al crear comentarios, valoraciones o sugerencias, usted declara que su contenido es verdadero, preciso, no engañoso y no infringe derechos de terceros. El Proveedor del Servicio se reserva el derecho de editar, eliminar o cambiar la categoría de cualquier contribución en cualquier momento y sin previo aviso.',
  },
  {
    titulo: 'SERVICIOS DE PUBLICIDAD PARA NEGOCIOS LOCALES',
    items: [
      'Plan Mensual: $580 MXN/mes (base $500 + IVA $80).',
      'Plan Anual: $5,800 MXN/año (base $5,000 + IVA $800), con ahorro de $1,160 MXN (16.7% de descuento).',
      'ExploreTech no emite facturas por los servicios de publicidad, pero proporciona un comprobante de transacción comercial.',
      'Los anunciantes son responsables de sus propias obligaciones fiscales.',
    ],
  },
  {
    titulo: 'RESPONSABILIDADES Y LIMITACIONES',
    items: [
      'Algunas funciones requieren una conexión a internet activa.',
      'Usted es responsable de los cargos por uso de datos móviles, incluido roaming.',
      'El Proveedor no asume responsabilidad si su dispositivo se queda sin batería.',
      'La información puede basarse en terceros y estar sujeta a interrupciones por fallas ajenas.',
    ],
  },
  {
    titulo: 'SEGURIDAD Y PROTECCIÓN DE DATOS',
    contenido:
      'La información personal será almacenada y procesada para fines de servicio, en conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Consulte el Aviso de Privacidad para más detalles.',
  },
  {
    titulo: 'ACTUALIZACIONES Y TERMINACIÓN',
    contenido:
      'El Proveedor del Servicio puede actualizar la Aplicación en cualquier momento y puede cesar su provisión y terminar su uso en cualquier momento sin previo aviso.',
  },
  {
    titulo: 'CAMBIOS EN LOS TÉRMINOS',
    contenido:
      'Los presentes Términos pueden modificarse. Se recomienda revisar esta sección periódicamente. El uso continuado de la Aplicación tras un cambio implica la aceptación de los nuevos términos.',
  },
];

export default function TerminosScreen({ navigation }) {
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
        <Text style={styles.title}>Términos y Condiciones</Text>

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
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderColor: colors.border,
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
});