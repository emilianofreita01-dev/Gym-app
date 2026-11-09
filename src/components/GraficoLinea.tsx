import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { colors } from '../theme/theme';

type Props = { valores: number[]; unidad: string };

const ALTO = 170;
const MARGEN_X = 46;
const MARGEN_Y = 18;

export default function GraficoLinea({ valores, unidad }: Props) {
  const [ancho, setAncho] = useState(0);
  const alMedir = (e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width);

  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const plano = max === min;

  const x = (i: number) =>
    valores.length === 1
      ? MARGEN_X + (ancho - MARGEN_X - 12) / 2
      : MARGEN_X + (i * (ancho - MARGEN_X - 12)) / (valores.length - 1);
  const y = (v: number) =>
    plano ? ALTO / 2 : MARGEN_Y + (1 - (v - min) / (max - min)) * (ALTO - 2 * MARGEN_Y);

  return (
    <View style={styles.contenedor} onLayout={alMedir}>
      {ancho > 0 && (
        <Svg width={ancho} height={ALTO}>
          {[0, 0.5, 1].map((t) => {
            const yy = MARGEN_Y + t * (ALTO - 2 * MARGEN_Y);
            return (
              <Line key={t} x1={MARGEN_X} x2={ancho - 12} y1={yy} y2={yy} stroke={colors.border} strokeWidth={1} />
            );
          })}
          {valores.length > 1 && (
            <Polyline
              points={valores.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={colors.accent}
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {valores.map((v, i) => (
            <Circle key={i} cx={x(i)} cy={y(v)} r={5} fill={colors.accent} />
          ))}
        </Svg>
      )}
      {ancho > 0 && (
        <>
          <Text style={[styles.etiqueta, { top: y(max) - 8 }]}>
            {max} {unidad}
          </Text>
          {!plano && (
            <Text style={[styles.etiqueta, { top: y(min) - 8 }]}>
              {min} {unidad}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { height: ALTO, width: '100%' },
  etiqueta: { position: 'absolute', left: 0, fontSize: 11, color: colors.textMuted },
});
