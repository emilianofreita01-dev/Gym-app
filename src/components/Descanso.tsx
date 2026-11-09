import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

const OPCIONES = [60, 90, 120];
const formato = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Descanso() {
  const [fin, setFin] = useState<number | null>(null);
  const [restante, setRestante] = useState(0);
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    if (fin === null) return;
    const tick = () => {
      const seg = Math.ceil((fin - Date.now()) / 1000);
      if (seg <= 0) {
        setFin(null);
        setRestante(0);
        setAviso(true);
        Vibration.vibrate([0, 400, 200, 400]);
      } else {
        setRestante(seg);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [fin]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(false), 4000);
    return () => clearTimeout(t);
  }, [aviso]);

  const empezar = (segundos: number) => {
    setAviso(false);
    setFin(Date.now() + segundos * 1000);
  };

  return (
    <View style={styles.barra}>
      {fin !== null ? (
        <>
          <Text style={styles.tiempo}>{formato(restante)}</Text>
          <Pressable style={styles.cancelar} onPress={() => setFin(null)}>
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={aviso ? styles.aviso : styles.etiqueta}>
            {aviso ? '¡A entrenar!' : 'Descanso'}
          </Text>
          {OPCIONES.map((s) => (
            <Pressable key={s} style={styles.opcion} onPress={() => empezar(s)}>
              <Text style={styles.opcionTexto}>{s} s</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  etiqueta: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  aviso: { fontSize: 15, fontWeight: '800', color: colors.accent },
  opcion: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  opcionTexto: { color: colors.text, fontSize: 15, fontWeight: '600' },
  tiempo: { fontSize: 30, fontWeight: '800', color: colors.accent },
  cancelar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelarTexto: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
