import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buscarEjercicio } from '../src/data/exercises';
import { useStore, type Entrenamiento } from '../src/store/useStore';
import { colors, radius, spacing } from '../src/theme/theme';

const formatoFecha = (t: number) =>
  new Date(t).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

const resumen = (e: Entrenamiento) => {
  const todas = e.ejercicios.flatMap((x) => x.series);
  const volumen = todas.reduce((suma, s) => suma + s.peso * s.repeticiones, 0);
  return `${todas.length} ${todas.length === 1 ? 'serie' : 'series'} · ${Math.round(volumen)} kg`;
};

export default function Entrenamientos() {
  const entrenamientos = useStore((s) => s.entrenamientos);
  const borrarEntrenamiento = useStore((s) => s.borrarEntrenamiento);
  const [abierto, setAbierto] = useState<string | null>(null);

  const confirmarBorrado = (id: string) =>
    Alert.alert('Borrar entrenamiento', '¿Quieres borrar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => borrarEntrenamiento(id) },
    ]);

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Mis entrenamientos</Text>
      <Text style={styles.info}>
        {entrenamientos.length === 1
          ? '1 entrenamiento registrado'
          : `${entrenamientos.length} entrenamientos registrados`}
      </Text>

      {entrenamientos.length === 0 && (
        <Pressable style={styles.boton} onPress={() => router.push('/rutina')}>
          <Text style={styles.botonTexto}>Empezar desde Mi rutina</Text>
        </Pressable>
      )}

      {entrenamientos.map((e) => {
        const expandido = abierto === e.id;
        return (
          <View key={e.id} style={styles.tarjeta}>
            <Pressable style={styles.cabecera} onPress={() => setAbierto(expandido ? null : e.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{e.nombreRutina}</Text>
                <Text style={styles.fecha}>{formatoFecha(e.fecha)}</Text>
                <Text style={styles.resumen}>{resumen(e)}</Text>
              </View>
              <Text style={styles.flecha}>{expandido ? '⌃' : '⌄'}</Text>
            </Pressable>

            {expandido && (
              <View style={styles.detalle}>
                {e.ejercicios.map((x) => (
                  <View key={x.ejercicioId} style={styles.bloque}>
                    <Text style={styles.ejercicio}>
                      {buscarEjercicio(x.ejercicioId)?.nombre ?? 'Ejercicio'}
                    </Text>
                    {x.series.map((s, i) => (
                      <Text key={i} style={styles.serie}>
                        {i + 1}. {s.peso} kg × {s.repeticiones}
                      </Text>
                    ))}
                  </View>
                ))}
                <Pressable onPress={() => confirmarBorrado(e.id)}>
                  <Text style={styles.borrar}>Borrar registro</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  info: { marginTop: spacing.xs, marginBottom: spacing.lg, fontSize: 15, color: colors.textMuted },
  boton: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  botonTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  nombre: { fontSize: 18, fontWeight: '700', color: colors.text },
  fecha: { marginTop: spacing.xs, fontSize: 13, color: colors.textMuted },
  resumen: { marginTop: spacing.xs, fontSize: 13, color: colors.accent },
  flecha: { fontSize: 22, color: colors.textMuted },
  detalle: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  bloque: { paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  ejercicio: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  serie: { fontSize: 14, color: colors.textMuted, marginBottom: 2 },
  borrar: { marginTop: spacing.sm, color: colors.accent, fontSize: 14, fontWeight: '600' },
});
