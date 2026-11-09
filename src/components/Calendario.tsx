import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';
import { MESES, claveDia } from '../utils/fechas';

const SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

type Props = {
  dias: Set<string>;
  seleccionado: string | null;
  onSeleccionar: (clave: string | null) => void;
};

export default function Calendario({ dias, seleccionado, onSeleccionar }: Props) {
  const hoy = new Date();
  const [vista, setVista] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() });

  const cambiarMes = (delta: number) => {
    const d = new Date(vista.anio, vista.mes + delta, 1);
    setVista({ anio: d.getFullYear(), mes: d.getMonth() });
  };

  const offset = (new Date(vista.anio, vista.mes, 1).getDay() + 6) % 7;
  const total = new Date(vista.anio, vista.mes + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  const filas: (number | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) filas.push(celdas.slice(i, i + 7));
  const claveHoy = claveDia(hoy);

  return (
    <View style={styles.caja}>
      <View style={styles.cabecera}>
        <Pressable onPress={() => cambiarMes(-1)} hitSlop={14}>
          <Text style={styles.flecha}>‹</Text>
        </Pressable>
        <Text style={styles.mes}>
          {MESES[vista.mes]} {vista.anio}
        </Text>
        <Pressable onPress={() => cambiarMes(1)} hitSlop={14}>
          <Text style={styles.flecha}>›</Text>
        </Pressable>
      </View>

      <View style={styles.fila}>
        {SEMANA.map((d) => (
          <Text key={d} style={styles.semana}>
            {d}
          </Text>
        ))}
      </View>

      {filas.map((fila, i) => (
        <View key={i} style={styles.fila}>
          {fila.map((dia, j) => {
            if (dia === null) return <View key={j} style={styles.celda} />;
            const clave = claveDia(new Date(vista.anio, vista.mes, dia));
            const entreno = dias.has(clave);
            const activo = seleccionado === clave;
            return (
              <Pressable
                key={j}
                style={styles.celda}
                onPress={() => onSeleccionar(activo ? null : clave)}
              >
                <View
                  style={[
                    styles.circulo,
                    entreno && styles.circuloEntreno,
                    clave === claveHoy && !entreno && styles.circuloHoy,
                    activo && styles.circuloActivo,
                  ]}
                >
                  <Text style={styles.dia}>{dia}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  flecha: { fontSize: 30, color: colors.accent, paddingHorizontal: spacing.sm },
  mes: { fontSize: 17, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  fila: { flexDirection: 'row' },
  semana: { width: '14.2857%', textAlign: 'center', fontSize: 12, color: colors.textMuted, paddingBottom: spacing.xs },
  celda: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  circulo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circuloEntreno: { backgroundColor: colors.accent },
  circuloHoy: { borderColor: colors.accent },
  circuloActivo: { borderColor: colors.text },
  dia: { fontSize: 14, color: colors.text },
});
