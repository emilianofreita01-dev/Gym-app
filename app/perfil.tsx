import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePerfil } from '../src/store/usePerfil';
import { useStore } from '../src/store/useStore';
import { colors, radius, spacing } from '../src/theme/theme';

function Dato({ valor, texto }: { valor: number; texto: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.datoValor}>{valor}</Text>
      <Text style={styles.datoTexto}>{texto}</Text>
    </View>
  );
}

export default function Perfil() {
  const nombre = usePerfil((s) => s.nombre);
  const setNombre = usePerfil((s) => s.setNombre);
  const entrenamientos = useStore((s) => s.entrenamientos);
  const rutinas = useStore((s) => s.rutinas);

  const hace7dias = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recientes = entrenamientos.filter((e) => e.fecha >= hace7dias).length;

  const borrarTodo = () =>
    Alert.alert(
      'Borrar mis datos',
      'Se borrarán tus rutinas y entrenamientos de este dispositivo. No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: () => useStore.setState({ rutinas: [], entrenamientos: [] }),
        },
      ]
    );

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>{nombre.trim() ? `Hola, ${nombre.trim()}` : 'Mi perfil'}</Text>

      <Text style={styles.etiqueta}>Tu nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="¿Cómo te llamas?"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.etiqueta}>Tu actividad</Text>
      <View style={styles.datos}>
        <Dato valor={entrenamientos.length} texto="Entrenamientos" />
        <Dato valor={recientes} texto="Últimos 7 días" />
        <Dato valor={rutinas.length} texto="Rutinas" />
      </View>

      <Text style={styles.etiqueta}>Datos</Text>
      <Pressable style={styles.botonPeligro} onPress={borrarTodo}>
        <Text style={styles.botonPeligroTexto}>Borrar mis datos</Text>
      </Pressable>

      <Text style={styles.aviso}>
        Los ejercicios son orientativos. Consulta con un profesional antes de empezar un plan de
        entrenamiento, sobre todo si tienes alguna lesión o condición de salud.
      </Text>
      <Text style={styles.version}>Versión de prueba</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  etiqueta: { marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: 14, color: colors.textMuted },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datos: { flexDirection: 'row', justifyContent: 'space-between' },
  dato: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  datoValor: { fontSize: 26, fontWeight: '800', color: colors.accent },
  datoTexto: { marginTop: spacing.xs, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  botonPeligro: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  botonPeligroTexto: { color: colors.accent, fontSize: 16, fontWeight: '700' },
  aviso: { marginTop: spacing.xl, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  version: { marginTop: spacing.md, fontSize: 12, color: colors.textMuted },
});
