import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NOMBRES } from '../../src/data/body';
import { buscarEjercicio } from '../../src/data/exercises';
import { colors, radius, spacing } from '../../src/theme/theme';

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

export default function FichaEjercicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ejercicio = buscarEjercicio(id);

  const volver = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!ejercicio) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>No encontramos este ejercicio.</Text>
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

      <Text style={styles.titulo}>{ejercicio.nombre}</Text>
      <Text style={styles.principales}>
        {ejercicio.principales.map((m) => NOMBRES[m]).join(', ')}
      </Text>
      <Text style={styles.secundarios}>
        También trabaja: {ejercicio.secundarios.map((m) => NOMBRES[m]).join(', ')}
      </Text>

      <View style={styles.espacioVisual}>
        <Text style={styles.espacioTexto}>Animación e ilustración anatómica: próximamente</Text>
      </View>

      <Seccion titulo="Posición inicial">
        <Text style={styles.texto}>{ejercicio.posicionInicial}</Text>
      </Seccion>
      <Seccion titulo="Ejecución">
        <Text style={styles.texto}>{ejercicio.ejecucion}</Text>
      </Seccion>
      <Seccion titulo="Respiración">
        <Text style={styles.texto}>{ejercicio.respiracion}</Text>
      </Seccion>
      <Seccion titulo="Errores frecuentes">
        {ejercicio.errores.map((e) => (
          <Text key={e} style={styles.texto}>
            • {e}
          </Text>
        ))}
      </Seccion>
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
  principales: { marginTop: spacing.xs, fontSize: 16, fontWeight: '600', color: colors.accent },
  secundarios: { marginTop: spacing.xs, fontSize: 14, color: colors.textMuted },
  espacioVisual: {
    height: 220,
    marginVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  espacioTexto: { color: colors.textMuted, textAlign: 'center' },
  seccion: { marginBottom: spacing.lg },
  seccionTitulo: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  texto: { fontSize: 16, lineHeight: 24, color: colors.text, opacity: 0.9, marginBottom: spacing.xs },
});
