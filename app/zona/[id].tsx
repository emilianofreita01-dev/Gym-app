import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NOMBRES } from '../../src/data/body';
import { ejerciciosPorMusculo } from '../../src/data/exercises';
import { buscarZona } from '../../src/data/zonas';
import { colors, radius, spacing } from '../../src/theme/theme';

export default function Zona() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const zona = buscarZona(id);
  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!zona) {
    return (
      <View style={styles.centro}>
        <Text style={styles.subtitulo}>No encontramos esta zona.</Text>
        <Pressable onPress={volver}>
          <Text style={styles.volver}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Pressable onPress={volver}>
        <Text style={styles.volver}>← Volver</Text>
      </Pressable>
      <Text style={styles.titulo}>{zona.titulo}</Text>
      <Text style={styles.subtitulo}>Elige el músculo que quieres trabajar</Text>

      <View style={styles.grilla}>
        {zona.musculos.map((m) => {
          const cantidad = ejerciciosPorMusculo(m).length;
          return (
            <Pressable
              key={m}
              style={styles.tarjeta}
              onPress={() => router.push({ pathname: '/musculo/[id]', params: { id: m } })}
            >
              <View style={styles.punto} />
              <Text style={styles.nombre}>{NOMBRES[m]}</Text>
              <Text style={styles.cantidad}>
                {cantidad === 0
                  ? 'Próximamente'
                  : cantidad === 1
                    ? '1 ejercicio'
                    : `${cantidad} ejercicios`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  volver: { color: colors.accent, fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitulo: { marginTop: spacing.xs, fontSize: 15, color: colors.textMuted },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  tarjeta: {
    width: '48%',
    minHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'flex-end',
  },
  punto: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
  },
  nombre: { fontSize: 19, fontWeight: '700', color: colors.text },
  cantidad: { marginTop: spacing.xs, fontSize: 13, color: colors.textMuted },
});
