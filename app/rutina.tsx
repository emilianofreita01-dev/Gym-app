import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NuevaRutina from '../src/components/NuevaRutina';
import { buscarEjercicio } from '../src/data/exercises';
import { useStore } from '../src/store/useStore';
import { colors, radius, spacing } from '../src/theme/theme';

export default function Rutina() {
  const rutinas = useStore((s) => s.rutinas);
  const crearRutina = useStore((s) => s.crearRutina);
  const borrarRutina = useStore((s) => s.borrarRutina);
  const quitarEjercicio = useStore((s) => s.quitarEjercicio);

  const [creando, setCreando] = useState(false);
  const [abierta, setAbierta] = useState<string | null>(null);

  const confirmarBorrado = (id: string, nombre: string) =>
    Alert.alert('Borrar rutina', `¿Quieres borrar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => borrarRutina(id) },
    ]);

  const confirmarQuitar = (rutinaId: string, ejercicioId: string, nombre: string) =>
    Alert.alert('Quitar ejercicio', `¿Quitar "${nombre}" de esta rutina?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: () => quitarEjercicio(rutinaId, ejercicioId) },
    ]);

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Mi rutina</Text>

      <Pressable style={styles.botonPrincipal} onPress={() => setCreando(true)}>
        <Text style={styles.botonPrincipalTexto}>+ Nueva rutina</Text>
      </Pressable>

      {rutinas.length === 0 && (
        <Text style={styles.vacio}>Aún no tienes rutinas. Crea la primera.</Text>
      )}

      {rutinas.map((r) => {
        const expandida = abierta === r.id;
        return (
          <View key={r.id} style={styles.tarjeta}>
            <Pressable
              style={styles.tarjetaCabecera}
              onPress={() => setAbierta(expandida ? null : r.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.tarjetaNombre}>{r.nombre}</Text>
                <Text style={styles.tarjetaInfo}>
                  {r.ejercicios.length === 1 ? '1 ejercicio' : `${r.ejercicios.length} ejercicios`}
                </Text>
              </View>
              <Text style={styles.flecha}>{expandida ? '⌃' : '⌄'}</Text>
            </Pressable>

            {expandida && (
              <View style={styles.detalle}>
                {r.ejercicios.map((id) => {
                  const ej = buscarEjercicio(id);
                  if (!ej) return null;
                  return (
                    <Pressable
                      key={id}
                      style={styles.filaEjercicio}
                      onPress={() => router.push({ pathname: '/ejercicio/[id]', params: { id } })}
                    >
                      <Text style={styles.ejercicioTexto}>{ej.nombre}</Text>
                      <Pressable hitSlop={12} onPress={() => confirmarQuitar(r.id, id, ej.nombre)}>
                        <Text style={styles.quitar}>✕</Text>
                      </Pressable>
                    </Pressable>
                  );
                })}
                <Pressable
                  style={styles.empezar}
                  onPress={() => router.push({ pathname: '/entrenar/[id]', params: { id: r.id } })}
                >
                  <Text style={styles.botonPrincipalTexto}>Empezar entrenamiento</Text>
                </Pressable>
                <Pressable onPress={() => confirmarBorrado(r.id, r.nombre)}>
                  <Text style={styles.borrar}>Borrar rutina</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}

      <NuevaRutina
        visible={creando}
        onCerrar={() => setCreando(false)}
        onGuardar={(nombre, ejercicios) => crearRutina(nombre, ejercicios)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  titulo: { fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  botonPrincipal: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  botonPrincipalTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
  vacio: { color: colors.textMuted, fontSize: 16 },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tarjetaCabecera: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  tarjetaNombre: { fontSize: 18, fontWeight: '700', color: colors.text },
  tarjetaInfo: { marginTop: spacing.xs, fontSize: 13, color: colors.accent },
  flecha: { fontSize: 22, color: colors.textMuted },
  detalle: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  filaEjercicio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ejercicioTexto: { flex: 1, color: colors.text, fontSize: 16 },
  quitar: { fontSize: 18, color: colors.textMuted, paddingLeft: spacing.md },
  empezar: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  borrar: { marginTop: spacing.md, color: colors.accent, fontSize: 14, fontWeight: '600' },
});
