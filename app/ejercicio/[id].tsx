import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NOMBRES } from '../../src/data/body';
import { buscarEjercicio } from '../../src/data/exercises';
import { useStore } from '../../src/store/useStore';
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
  const rutinas = useStore((s) => s.rutinas);
  const agregarEjercicio = useStore((s) => s.agregarEjercicio);
  const [eligiendo, setEligiendo] = useState(false);

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
      {ejercicio.secundarios.length > 0 && (
        <Text style={styles.secundarios}>
          También trabaja: {ejercicio.secundarios.map((m) => NOMBRES[m]).join(', ')}
        </Text>
      )}

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

      <Pressable style={styles.botonAgregar} onPress={() => setEligiendo((v) => !v)}>
        <Text style={styles.botonAgregarTexto}>
          {eligiendo ? 'Cerrar' : '+ Agregar a una rutina'}
        </Text>
      </Pressable>

      {eligiendo && (
        <View style={styles.lista}>
          {rutinas.length === 0 && (
            <Pressable onPress={() => router.push('/rutina')}>
              <Text style={styles.enlace}>Aún no tienes rutinas. Crea una en Mi rutina →</Text>
            </Pressable>
          )}
          {rutinas.map((r) => {
            const ya = r.ejercicios.includes(ejercicio.id);
            return (
              <Pressable
                key={r.id}
                style={styles.filaRutina}
                disabled={ya}
                onPress={() => agregarEjercicio(r.id, ejercicio.id)}
              >
                <Text style={styles.texto}>{r.nombre}</Text>
                <Text style={ya ? styles.ya : styles.mas}>{ya ? '✓ Agregado' : '+'}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
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
  botonAgregar: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  botonAgregarTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
  lista: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  enlace: { color: colors.accent, fontSize: 15, fontWeight: '600' },
  filaRutina: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ya: { color: colors.textMuted, fontSize: 14 },
  mas: { color: colors.accent, fontSize: 24, fontWeight: '700' },
});
