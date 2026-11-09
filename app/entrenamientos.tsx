import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Calendario from '../src/components/Calendario';
import GraficoLinea from '../src/components/GraficoLinea';
import { buscarEjercicio } from '../src/data/exercises';
import { useStore, type Entrenamiento } from '../src/store/useStore';
import { colors, radius, spacing } from '../src/theme/theme';
import { MESES, claveDia } from '../src/utils/fechas';

const formatoFecha = (t: number) =>
  new Date(t).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

const resumen = (e: Entrenamiento) => {
  const todas = e.ejercicios.flatMap((x) => x.series);
  const volumen = todas.reduce((suma, s) => suma + s.peso * s.repeticiones, 0);
  return `${todas.length} ${todas.length === 1 ? 'serie' : 'series'} · ${Math.round(volumen)} kg`;
};

type Sesion = { fecha: number; peso: number; reps: number };

function sesionesPorEjercicio(entrenamientos: Entrenamiento[]) {
  const mapa: Record<string, Sesion[]> = {};
  for (const e of entrenamientos) {
    for (const x of e.ejercicios) {
      if (x.series.length === 0) continue;
      if (!mapa[x.ejercicioId]) mapa[x.ejercicioId] = [];
      mapa[x.ejercicioId].push({
        fecha: e.fecha,
        peso: Math.max(...x.series.map((s) => s.peso)),
        reps: Math.max(...x.series.map((s) => s.repeticiones)),
      });
    }
  }
  for (const id of Object.keys(mapa)) mapa[id].sort((a, b) => a.fecha - b.fecha);
  return mapa;
}

function Progreso({ entrenamientos }: { entrenamientos: Entrenamiento[] }) {
  const mapa = useMemo(() => sesionesPorEjercicio(entrenamientos), [entrenamientos]);
  const ids = Object.keys(mapa);
  const [sel, setSel] = useState<string | null>(null);

  if (ids.length === 0) {
    return <Text style={styles.vacio}>Registra entrenamientos para ver tu progreso.</Text>;
  }

  const actual = sel && mapa[sel] ? sel : ids[0];
  const sesiones = mapa[actual];
  const usaPeso = sesiones.some((s) => s.peso > 0);
  const valores = sesiones.map((s) => (usaPeso ? s.peso : s.reps));
  const unidad = usaPeso ? 'kg' : 'reps';
  const primero = valores[0];
  const ultimo = valores[valores.length - 1];
  const dif = Math.round((ultimo - primero) * 10) / 10;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {ids.map((id) => (
          <Pressable
            key={id}
            onPress={() => setSel(id)}
            style={[styles.chip, id === actual && styles.chipActivo]}
          >
            <Text style={[styles.chipTexto, id === actual && styles.chipTextoActivo]}>
              {buscarEjercicio(id)?.nombre ?? id}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.tarjetaGrafico}>
        <Text style={styles.graficoTitulo}>
          {usaPeso ? 'Mejor peso por sesión' : 'Mejores repeticiones por sesión'}
        </Text>
        <GraficoLinea valores={valores} unidad={unidad} />
        <View style={styles.estadisticas}>
          <View style={styles.estadistica}>
            <Text style={styles.estValor}>{primero} {unidad}</Text>
            <Text style={styles.estTexto}>Primera</Text>
          </View>
          <View style={styles.estadistica}>
            <Text style={styles.estValor}>{ultimo} {unidad}</Text>
            <Text style={styles.estTexto}>Última</Text>
          </View>
          <View style={styles.estadistica}>
            <Text style={styles.estValor}>
              {dif > 0 ? '+' : ''}
              {dif} {unidad}
            </Text>
            <Text style={styles.estTexto}>Cambio</Text>
          </View>
        </View>
        <Text style={styles.sesiones}>
          {sesiones.length === 1 ? '1 sesión registrada' : `${sesiones.length} sesiones registradas`}
        </Text>
      </View>
    </View>
  );
}

export default function Entrenamientos() {
  const entrenamientos = useStore((s) => s.entrenamientos);
  const borrarEntrenamiento = useStore((s) => s.borrarEntrenamiento);
  const [pestana, setPestana] = useState<'historial' | 'progreso'>('historial');
  const [abierto, setAbierto] = useState<string | null>(null);
  const [dia, setDia] = useState<string | null>(null);

  const dias = useMemo(
    () => new Set(entrenamientos.map((e) => claveDia(e.fecha))),
    [entrenamientos]
  );
  const lista = dia ? entrenamientos.filter((e) => claveDia(e.fecha) === dia) : entrenamientos;

  const textoDia = () => {
    if (!dia) return '';
    const [, m, d] = dia.split('-').map(Number);
    return `${d} de ${MESES[m - 1]}`;
  };

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

      <View style={styles.selector}>
        {(['historial', 'progreso'] as const).map((p) => (
          <Pressable
            key={p}
            onPress={() => setPestana(p)}
            style={[styles.opcion, pestana === p && styles.opcionActiva]}
          >
            <Text style={[styles.opcionTexto, pestana === p && styles.opcionTextoActivo]}>
              {p === 'historial' ? 'Historial' : 'Progreso'}
            </Text>
          </Pressable>
        ))}
      </View>

      {pestana === 'progreso' ? (
        <Progreso entrenamientos={entrenamientos} />
      ) : (
        <>
          <Calendario dias={dias} seleccionado={dia} onSeleccionar={setDia} />

          {dia && (
            <Pressable onPress={() => setDia(null)}>
              <Text style={styles.filtro}>Mostrando el {textoDia()} · Ver todos</Text>
            </Pressable>
          )}

          {entrenamientos.length === 0 && (
            <Pressable style={styles.boton} onPress={() => router.push('/rutina')}>
              <Text style={styles.botonTexto}>Empezar desde Mi rutina</Text>
            </Pressable>
          )}

          {dia && lista.length === 0 && <Text style={styles.vacio}>No entrenaste ese día.</Text>}

          {lista.map((e) => {
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  info: { marginTop: spacing.xs, marginBottom: spacing.md, fontSize: 15, color: colors.textMuted },
  selector: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  opcion: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg },
  opcionActiva: { backgroundColor: colors.accent },
  opcionTexto: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  opcionTextoActivo: { color: colors.text },
  filtro: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: spacing.md },
  vacio: { color: colors.textMuted, fontSize: 16, marginTop: spacing.sm },
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
  chips: { marginBottom: spacing.md },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActivo: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTexto: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  chipTextoActivo: { color: colors.text },
  tarjetaGrafico: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  graficoTitulo: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  estadisticas: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  estadistica: { alignItems: 'center', flex: 1 },
  estValor: { fontSize: 17, fontWeight: '800', color: colors.accent },
  estTexto: { marginTop: spacing.xs, fontSize: 12, color: colors.textMuted },
  sesiones: { marginTop: spacing.md, textAlign: 'center', fontSize: 12, color: colors.textMuted },
});
