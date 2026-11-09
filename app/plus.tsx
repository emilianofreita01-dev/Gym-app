import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../src/theme/theme';

const BENEFICIOS = [
  'Sin anuncios',
  'Rutinas ilimitadas',
  'Progreso y estadísticas avanzadas',
  'Comunidad completa: publica y guarda rutinas',
];

export default function Plus() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Plus</Text>
      <Text style={styles.subtitulo}>Beneficios previstos para la suscripción</Text>

      <View style={styles.tarjeta}>
        {BENEFICIOS.map((b) => (
          <View key={b} style={styles.fila}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.beneficio}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.boton}>
        <Text style={styles.botonTexto}>Próximamente</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 34, fontWeight: '800', color: colors.accent },
  subtitulo: { marginTop: spacing.xs, marginBottom: spacing.lg, fontSize: 15, color: colors.textMuted },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fila: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  check: { color: colors.accent, fontSize: 18, fontWeight: '800', marginRight: spacing.md },
  beneficio: { flex: 1, color: colors.text, fontSize: 16 },
  boton: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  botonTexto: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
});
