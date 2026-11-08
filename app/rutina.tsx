import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EJERCICIOS, buscarEjercicio } from '../src/data/exercises';
import { useStore } from '../src/store/useStore';
import { colors, radius, spacing } from '../src/theme/theme';

export default function Rutina() {
  const rutinas = useStore((s) => s.rutinas);
  const crearRutina = useStore((s) => s.crearRutina);
  const borrarRutina = useStore((s) => s.borrarRutina);

  const [creando, setCreando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [abierta, setAbierta] = useState<string | null>(null);

  const puedeGuardar = nombre.trim().length > 0 && elegidos.length > 0;

  const alternar = (id: string) =>
    setElegidos((actual) =>
      actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id]
    );

  const cerrarFormulario = () => {
    setCreando(false);
    setNombre('');
    setElegidos([]);
  };

  const guardar = () => {
    if (!puedeGuardar) return;
    crearRutina(nombre.trim(), elegidos);
    cerrarFormulario();
  };

  const confirmarBorrado = (id: string, nombreRutina: string) =>
    Alert.alert('Borrar rutina', `¿Quieres borrar "${nombreRutina}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => borrarRutina(id) },
    ]);

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Mi rutina</Text>

      {!creando && (
        <Pressable style={styles.botonPrincipal} onPress={() => setCreando(true)}>
          <Text style={styles.botonPrincipalTexto}>+ Nueva rutina</Text>
        </Pressable>
      )}

      {creando && (
        <View style={styles.formulario}>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la rutina"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.etiqueta}>Elige los ejercicios</Text>
          {EJERCICIOS.map((e) => {
            const activo = elegidos.includes(e.id);
            return (
              <Pressable key={e.id} style={styles.opcion} onPress={() => alternar(e.id)}>
                <View style={[styles.caja, activo && styles.cajaActiva]}>
                  {activo && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.opcionTexto}>{e.nombre}</Text>
              </Pressable>
            );
          })}
          <View style={styles.botones}>
            <Pressable style={styles.botonSecundario} onPress={cerrarFormulario}>
              <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.botonGuardar, !puedeGuardar && styles.botonDeshabilitado]}
              onPress={guardar}
              disabled={!puedeGuardar}
            >
              <Text style={styles.botonPrincipalTexto}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {rutinas.length === 0 && !creando && (
        <Text style={styles.vacio}>Aún no tienes rutinas. Crea la primera.</Text>
      )}

      {rutinas.map((r) => {
        const expandida = abierta === r.id;
        return (
          <View key={r.id} style={styles.tarjeta}>
            <Pressable style={styles.tarjetaCabecera} onPress={() => setAbierta(expandida ? null : r.id)}>
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
                      <Text style={styles.opcionTexto}>{ej.nombre}</Text>
                      <Text style={styles.flecha}>›</Text>
                    </Pressable>
                  );
                })}
                <Pressable style={styles.botonPrincipal} onPress={() => router.push({ pathname: "/entrenar/[id]", params: { id: r.id } })}><Text style={styles.botonPrincipalTexto}>Empezar entrenamiento</Text></Pressable>
                <Pressable onPress={() => confirmarBorrado(r.id, r.nombre)}>
                  <Text style={styles.borrar}>Borrar rutina</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
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
  formulario: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  etiqueta: { marginTop: spacing.md, marginBottom: spacing.sm, color: colors.textMuted, fontSize: 14 },
  opcion: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  caja: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaActiva: { backgroundColor: colors.accent, borderColor: colors.accent },
  check: { color: colors.text, fontSize: 14, fontWeight: '800' },
  opcionTexto: { color: colors.text, fontSize: 16 },
  botones: { flexDirection: 'row', marginTop: spacing.md },
  botonSecundario: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  botonSecundarioTexto: { color: colors.text, fontSize: 16, fontWeight: '600' },
  botonGuardar: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  botonDeshabilitado: { opacity: 0.4 },
  vacio: { color: colors.textMuted, fontSize: 16, marginTop: spacing.sm },
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
  borrar: { marginTop: spacing.md, color: colors.accent, fontSize: 14, fontWeight: '600' },
});
