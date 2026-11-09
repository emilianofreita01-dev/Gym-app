import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { buscarEjercicio } from '../../src/data/exercises';
import { useStore } from '../../src/store/useStore';
import Descanso from '../../src/components/Descanso';
import UltimaVez from '../../src/components/UltimaVez';
import { colors, radius, spacing } from '../../src/theme/theme';

type Fila = { peso: string; reps: string };
const FILA_VACIA: Fila = { peso: '', reps: '' };

export default function Entrenar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rutina = useStore((s) => s.rutinas.find((r) => r.id === id));
  const guardarEntrenamiento = useStore((s) => s.guardarEntrenamiento);
  const [series, setSeries] = useState<Record<string, Fila[]>>({});

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/rutina'));

  if (!rutina) {
    return (
      <View style={styles.centro}>
        <Text style={styles.info}>No encontramos esta rutina.</Text>
        <Pressable onPress={volver}>
          <Text style={styles.volver}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  const filas = (ejId: string) => series[ejId] ?? [FILA_VACIA];

  const cambiar = (ejId: string, i: number, campo: keyof Fila, valor: string) =>
    setSeries((s) => {
      const lista = [...(s[ejId] ?? [FILA_VACIA])];
      lista[i] = { ...lista[i], [campo]: valor };
      return { ...s, [ejId]: lista };
    });

  const agregarSerie = (ejId: string) =>
    setSeries((s) => ({ ...s, [ejId]: [...(s[ejId] ?? [FILA_VACIA]), FILA_VACIA] }));

  const terminar = () => {
    const ejercicios = rutina.ejercicios
      .map((ejId) => ({
        ejercicioId: ejId,
        series: filas(ejId)
          .map((f) => ({
            peso: parseFloat(f.peso.replace(',', '.')) || 0,
            repeticiones: parseInt(f.reps, 10) || 0,
          }))
          .filter((s) => s.repeticiones > 0),
      }))
      .filter((e) => e.series.length > 0);

    if (ejercicios.length === 0) {
      Alert.alert('Sin datos', 'Anota al menos una serie con repeticiones.');
      return;
    }
    guardarEntrenamiento({ nombreRutina: rutina.nombre, ejercicios });
    router.replace('/entrenamientos');
  };

  return (
    <View style={styles.raiz}>
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Pressable onPress={volver}>
        <Text style={styles.volver}>← Volver</Text>
      </Pressable>
      <Text style={styles.titulo}>{rutina.nombre}</Text>
      <Text style={styles.info}>Anota tus series. Deja vacías las que no hagas.</Text>

      {rutina.ejercicios.map((ejId) => {
        const ej = buscarEjercicio(ejId);
        if (!ej) return null;
        return (
          <View key={ejId} style={styles.bloque}>
            <Text style={styles.nombre}>{ej.nombre}</Text>
            <UltimaVez ejercicioId={ejId} />
            <View style={styles.fila}>
              <Text style={[styles.cabecera, styles.colSerie]}>Serie</Text>
              <Text style={[styles.cabecera, styles.colCampo]}>Kg</Text>
              <Text style={[styles.cabecera, styles.colCampo]}>Reps</Text>
            </View>
            {filas(ejId).map((f, i) => (
              <View key={i} style={styles.fila}>
                <Text style={[styles.numero, styles.colSerie]}>{i + 1}</Text>
                <TextInput
                  style={[styles.input, styles.colCampo]}
                  value={f.peso}
                  onChangeText={(v) => cambiar(ejId, i, 'peso', v)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                <TextInput
                  style={[styles.input, styles.colCampo]}
                  value={f.reps}
                  onChangeText={(v) => cambiar(ejId, i, 'reps', v)}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            ))}
            <Pressable onPress={() => agregarSerie(ejId)}>
              <Text style={styles.agregar}>+ Serie</Text>
            </Pressable>
          </View>
        );
      })}

      <Pressable style={styles.terminar} onPress={terminar}>
        <Text style={styles.terminarTexto}>Terminar entrenamiento</Text>
      </Pressable>
    </ScrollView>
    <Descanso />
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colors.background },
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  volver: { color: colors.accent, fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  info: { marginTop: spacing.xs, marginBottom: spacing.md, fontSize: 15, color: colors.textMuted },
  bloque: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nombre: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  fila: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  colSerie: { width: 50 },
  colCampo: { flex: 1, marginRight: spacing.sm },
  cabecera: { fontSize: 13, color: colors.textMuted },
  numero: { fontSize: 16, color: colors.text },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  agregar: { color: colors.accent, fontSize: 15, fontWeight: '600', marginTop: spacing.xs },
  terminar: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  terminarTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
