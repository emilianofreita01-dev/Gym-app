import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors, spacing } from '../theme/theme';

type Item = { id: string; titulo: string; subtitulo: string };
type Props = { items: Item[]; onSeleccionar: (id: string) => void };

const INCLINACION = 34; // diferencia de altura entre el borde izquierdo y el derecho
const FONDOS = ['#222226', '#2A2A2F'];

export default function PanelesZonas({ items, onSeleccionar }: Props) {
  const [tam, setTam] = useState({ w: 0, h: 0 });
  const alMedir = (e: LayoutChangeEvent) =>
    setTam({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const n = items.length;
  const alto = tam.h / n;

  // Altura del borde superior de cada panel, en el lado izquierdo y en el derecho.
  const borde = (k: number) => {
    if (k <= 0) return { izq: 0, der: 0 };
    if (k >= n) return { izq: tam.h, der: tam.h };
    const y = k * alto;
    const mitad = INCLINACION / 2;
    return k % 2 === 1
      ? { izq: y + mitad, der: y - mitad }
      : { izq: y - mitad, der: y + mitad };
  };

  return (
    <View style={styles.contenedor} onLayout={alMedir}>
      {tam.w > 0 && (
        <>
          <Svg width={tam.w} height={tam.h} style={StyleSheet.absoluteFill}>
            {items.map((item, i) => {
              const arriba = borde(i);
              const abajo = borde(i + 1);
              const puntos = `0,${arriba.izq} ${tam.w},${arriba.der} ${tam.w},${abajo.der} 0,${abajo.izq}`;
              return (
                <Polygon
                  key={item.id}
                  points={puntos}
                  fill={FONDOS[i % 2]}
                  stroke={colors.background}
                  strokeWidth={4}
                  onPress={() => onSeleccionar(item.id)}
                />
              );
            })}
          </Svg>

          {items.map((item, i) => (
            <View
              key={`t-${item.id}`}
              pointerEvents="none"
              style={[styles.fila, { top: i * alto, height: alto }]}
            >
              <View style={styles.textos}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.subtitulo}>{item.subtitulo}</Text>
              </View>
              <View style={styles.flecha}>
                <Text style={styles.flechaTexto}>›</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colors.background },
  fila: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  textos: { flex: 1 },
  titulo: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitulo: { marginTop: spacing.xs, fontSize: 15, color: colors.textMuted },
  flecha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flechaTexto: { fontSize: 26, lineHeight: 30, fontWeight: '700', color: colors.text },
});
