import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NOMBRES, type MuscleId } from '../data/body';
import { ejerciciosPorMusculo } from '../data/exercises';
import { colors, radius, spacing } from '../theme/theme';

type Props = { seleccion: MuscleId | null };

export default function PanelEjercicios({ seleccion }: Props) {
  const lista = seleccion ? ejerciciosPorMusculo(seleccion) : [];

  return (
    <View style={styles.panel}>
      <Text style={styles.titulo}>{seleccion ? NOMBRES[seleccion] : 'Toca un músculo'}</Text>

      {seleccion && lista.length === 0 && (
        <Text style={styles.vacio}>Pronto habrá ejercicios para este músculo.</Text>
      )}

      {lista.length > 0 && (
        <FlatList
          horizontal
          style={styles.flat}
          showsHorizontalScrollIndicator={false}
          data={lista}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tarjeta}
              onPress={() =>
                router.push({ pathname: '/ejercicio/[id]', params: { id: item.id } })
              }
            >
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.rol}>
                {seleccion !== null && item.principales.includes(seleccion)
                  ? 'Principal'
                  : 'Secundario'}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { minHeight: 150, paddingTop: spacing.sm },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  vacio: { color: colors.textMuted, textAlign: 'center', fontSize: 15 },
  flat: { flexGrow: 0 },
  lista: { paddingHorizontal: spacing.lg },
  tarjeta: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nombre: { fontSize: 17, fontWeight: '600', color: colors.text },
  rol: { marginTop: spacing.xs, fontSize: 13, color: colors.accent },
});
