import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type Fase = 'listo' | 'serie' | 'descanso' | 'fin';
const OPCIONES = [60, 90, 120];
const formato = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

async function prepararNotificaciones() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('descanso', {
      name: 'Descanso',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
    });
  }
  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) return true;
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

export default function Descanso() {
  const [fase, setFase] = useState<Fase>('listo');
  const [duracion, setDuracion] = useState(90);
  const [inicio, setInicio] = useState(0);
  const [fin, setFin] = useState(0);
  const [ahora, setAhora] = useState(Date.now());
  const idAviso = useRef<string | null>(null);

  useEffect(() => {
    if (fase !== 'serie' && fase !== 'descanso') return;
    const id = setInterval(() => setAhora(Date.now()), 250);
    return () => clearInterval(id);
  }, [fase]);

  useEffect(() => {
    if (fase === 'descanso' && ahora >= fin) {
      setFase('fin');
      Vibration.vibrate([0, 400, 200, 400]);
    }
  }, [fase, ahora, fin]);

  useEffect(() => {
    if (fase === 'fin') idAviso.current = null;
  }, [fase]);

  const cancelarAviso = async () => {
    if (idAviso.current) {
      await Notifications.cancelScheduledNotificationAsync(idAviso.current).catch(() => {});
      idAviso.current = null;
    }
  };

  const empezarSerie = () => {
    const t = Date.now();
    setInicio(t);
    setAhora(t);
    setFase('serie');
  };

  const terminarSerie = async () => {
    const t = Date.now();
    setAhora(t);
    setFin(t + duracion * 1000);
    setFase('descanso');
    const permitido = await prepararNotificaciones().catch(() => false);
    if (permitido) {
      idAviso.current = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Descanso terminado',
          body: '¡A entrenar! Toca Empezar cuando estés listo.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: duracion,
          channelId: 'descanso',
        },
      }).catch(() => null);
    }
  };

  const saltar = async () => {
    await cancelarAviso();
    setFase('listo');
  };

  const restante = Math.max(0, Math.ceil((fin - ahora) / 1000));
  const transcurrido = Math.max(0, Math.floor((ahora - inicio) / 1000));

  return (
    <View style={styles.barra}>
      {fase === 'serie' && (
        <>
          <View>
            <Text style={styles.etiqueta}>Serie en curso</Text>
            <Text style={styles.tiempo}>{formato(transcurrido)}</Text>
          </View>
          <Pressable style={styles.principal} onPress={terminarSerie}>
            <Text style={styles.principalTexto}>Terminar serie</Text>
          </Pressable>
        </>
      )}

      {fase === 'descanso' && (
        <>
          <View>
            <Text style={styles.etiqueta}>Descanso</Text>
            <Text style={styles.tiempo}>{formato(restante)}</Text>
          </View>
          <Pressable style={styles.secundario} onPress={saltar}>
            <Text style={styles.secundarioTexto}>Saltar</Text>
          </Pressable>
        </>
      )}

      {(fase === 'listo' || fase === 'fin') && (
        <>
          <View>
            <Text style={fase === 'fin' ? styles.aviso : styles.etiqueta}>
              {fase === 'fin' ? '¡A entrenar!' : 'Descanso entre series'}
            </Text>
            <View style={styles.opciones}>
              {OPCIONES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setDuracion(s)}
                  style={[styles.chip, duracion === s && styles.chipActivo]}
                >
                  <Text style={[styles.chipTexto, duracion === s && styles.chipTextoActivo]}>
                    {s} s
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable style={styles.principal} onPress={empezarSerie}>
            <Text style={styles.principalTexto}>Empezar</Text>
          </Pressable>
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
  etiqueta: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  aviso: { fontSize: 16, fontWeight: '800', color: colors.accent },
  tiempo: { fontSize: 30, fontWeight: '800', color: colors.accent },
  opciones: { flexDirection: 'row', marginTop: spacing.sm },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActivo: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipTexto: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  chipTextoActivo: { color: colors.text },
  principal: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  principalTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
  secundario: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secundarioTexto: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
