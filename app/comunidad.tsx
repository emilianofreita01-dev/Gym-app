import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../src/theme/theme';

const GRATIS = ['Ver una selección de rutinas y publicaciones'];
const PLUS = ['Acceso completo a rutinas y publicaciones', 'Publicar tus propias rutinas', 'Guardar rutinas de otras personas'];

function Bloque({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.tarjetaTitulo}>{titulo}</Text>
      {items.map((i) => (
        <Text key={i} style={styles.item}>
          • {i}
        </Text>
      ))}
    </View>
  );
}

export default function Comunidad() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Comunidad</Text>
      <Text style={styles.subtitulo}>Descubre y comparte rutinas con otras personas.</Text>

      <Bloque titulo="Plan gratuito" items={GRATIS} />
      <Bloque titulo="Con Plus" items={PLUS} />

      <Pressable style={styles.boton} onPress={() => router.push('/plus')}>
        <Text style={styles.botonTexto}>Ver Plus</Text>
      </Pressable>
      <Text style={styles.nota}>Disponible en una próxima versión.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitulo: { marginTop: spacing.xs, marginBottom: spacing.lg, fontSize: 15, color: colors.textMuted },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tarjetaTitulo: { fontSize: 18, fontWeight: '700', color: colors.accent, marginBottom: spacing.sm },
  item: { fontSize: 16, lineHeight: 24, color: colors.text, opacity: 0.9 },
  boton: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  botonTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
  nota: { marginTop: spacing.md, textAlign: 'center', fontSize: 13, color: colors.textMuted },
});
