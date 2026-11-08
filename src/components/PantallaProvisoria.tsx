import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

type Props = { titulo: string; descripcion: string };

export default function PantallaProvisoria({ titulo, descripcion }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  titulo: { fontSize: 28, fontWeight: '700', color: colors.text },
  descripcion: {
    marginTop: spacing.sm,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
