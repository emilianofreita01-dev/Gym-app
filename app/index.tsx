import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import BodyViewer from '../src/components/BodyViewer';
import { NOMBRES, ZONAS, type BodyView, type MuscleId } from '../src/data/body';
import { colors, radius, spacing } from '../src/theme/theme';

const VISTAS: { id: BodyView; texto: string }[] = [
  { id: 'frente', texto: 'Frente' },
  { id: 'espalda', texto: 'Espalda' },
];

export default function Inicio() {
  const [vista, setVista] = useState<BodyView>('frente');
  const [seleccion, setSeleccion] = useState<MuscleId | null>(null);

  const alTocar = (id: MuscleId) => setSeleccion((actual) => (actual === id ? null : id));

  const cambiarVista = (nueva: BodyView) => {
    setVista(nueva);
    if (seleccion && !ZONAS[nueva].some((z) => z.id === seleccion)) setSeleccion(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        {VISTAS.map((v) => (
          <Pressable
            key={v.id}
            onPress={() => cambiarVista(v.id)}
            style={[styles.opcion, vista === v.id && styles.opcionActiva]}
          >
            <Text style={[styles.opcionTexto, vista === v.id && styles.opcionTextoActivo]}>
              {v.texto}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.cuerpo}>
        <BodyViewer vista={vista} seleccion={seleccion} onSeleccionar={alTocar} />
      </View>

      <View style={styles.etiqueta}>
        <Text style={styles.etiquetaTexto}>
          {seleccion ? NOMBRES[seleccion] : 'Tocá un músculo'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingBottom: spacing.xl },
  selector: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xs,
    marginTop: spacing.sm,
  },
  opcion: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg },
  opcionActiva: { backgroundColor: colors.accent },
  opcionTexto: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  opcionTextoActivo: { color: colors.text },
  cuerpo: { flex: 1, marginVertical: spacing.md, paddingHorizontal: spacing.lg },
  etiqueta: { alignItems: 'center', minHeight: 40, justifyContent: 'center' },
  etiquetaTexto: { fontSize: 22, fontWeight: '700', color: colors.text },
});
