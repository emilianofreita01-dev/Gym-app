import { StyleSheet, Text } from 'react-native';
import { useStore } from '../store/useStore';
import { colors, spacing } from '../theme/theme';

export default function UltimaVez({ ejercicioId }: { ejercicioId: string }) {
  const registro = useStore((s) => {
    for (const e of s.entrenamientos) {
      const x = e.ejercicios.find((j) => j.ejercicioId === ejercicioId);
      if (x) return x;
    }
    return undefined;
  });

  if (!registro) return null;

  const texto = registro.series.map((s) => `${s.peso} kg × ${s.repeticiones}`).join('  ·  ');
  return <Text style={styles.texto}>Última vez: {texto}</Text>;
}

const styles = StyleSheet.create({
  texto: { marginBottom: spacing.sm, fontSize: 13, color: colors.accent },
});
