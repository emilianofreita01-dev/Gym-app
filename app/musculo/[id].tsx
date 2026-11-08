import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NOMBRES, type MuscleId } from '../../src/data/body';
import { ejerciciosPorMusculo } from '../../src/data/exercises';
import { colors, radius, spacing } from '../../src/theme/theme';

export default function Musculo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const valido = id in NOMBRES;
  const musculo = id as MuscleId;
  const lista = valido ? ejerciciosPorMusculo(musculo) : [];
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Pressable onPress={volver}>
        <Text style={styles.volver}>← Volver</Text>
      </Pressable>
      <Text style={styles.titulo}>{valido ? NOMBRES[musculo] : 'Músculo no encontrado'}</Text>
      <Text style={styles.subtitulo}>Ejercicios</Text>

      {valido && lista.length === 0 && (
        <Text style={styles.vacio}>Pronto habrá ejercicios para este músculo.</Text>
      )}

      {lista.map((e) => (
        <Pressable
          key={e.id}
          style={styles.tarjeta}
          onPress={() => router.push({ pathname: '/ejercicio/[id]', params: { id: e.id } })}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.nombre}>{e.nombre}</Text>
            <Text style={styles.rol}>
              {e.principales.includes(musculo) ? 'Músculo principal' : 'Músculo secundario'}
            </Text>
          </View>
          <Text style={styles.flecha}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  volver: { color: colors.accent, fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitulo: { marginTop: spacing.xs, marginBottom: spacing.lg, fontSize: 15, color: colors.textMuted },
  vacio: { color: colors.textMuted, fontSize: 16 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nombre: { fontSize: 18, fontWeight: '700', color: colors.text },
  rol: { marginTop: spacing.xs, fontSize: 13, color: colors.accent },
  flecha: { fontSize: 28, color: colors.textMuted },
});
