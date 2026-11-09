import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NOMBRES, type MuscleId } from '../data/body';
import { EJERCICIOS } from '../data/exercises';
import { colors, radius, spacing } from '../theme/theme';

const ORDEN: MuscleId[] = [
  'pecho', 'hombros', 'biceps', 'triceps', 'antebrazos', 'trapecio', 'abdominales',
  'oblicuos', 'dorsales', 'lumbares', 'cuadriceps', 'isquiotibiales', 'gluteos', 'pantorrillas',
];

const normalizar = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

type Props = {
  visible: boolean;
  onCerrar: () => void;
  onGuardar: (nombre: string, ejercicios: string[]) => void;
};

export default function NuevaRutina({ visible, onCerrar, onGuardar }: Props) {
  const [nombre, setNombre] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [abierto, setAbierto] = useState<MuscleId | null>(null);

  const puedeGuardar = nombre.trim().length > 0 && elegidos.length > 0;
  const texto = normalizar(busqueda.trim());

  const grupos = ORDEN.map((m) => ({
    id: m,
    lista: EJERCICIOS.filter((e) => e.principales[0] === m),
  })).filter((g) => g.lista.length > 0);

  const resultados = texto ? EJERCICIOS.filter((e) => normalizar(e.nombre).includes(texto)) : [];

  const alternar = (id: string) =>
    setElegidos((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const cerrar = () => {
    setNombre('');
    setBusqueda('');
    setElegidos([]);
    setAbierto(null);
    onCerrar();
  };

  const guardar = () => {
    if (!puedeGuardar) return;
    onGuardar(nombre.trim(), elegidos);
    cerrar();
  };

  const fila = (id: string, nombreEj: string) => {
    const activo = elegidos.includes(id);
    return (
      <Pressable key={id} style={styles.opcion} onPress={() => alternar(id)}>
        <View style={[styles.caja, activo && styles.cajaActiva]}>
          {activo && <Text style={styles.check}>✓</Text>}
        </View>
        <Text style={styles.opcionTexto}>{nombreEj}</Text>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={cerrar}
    >
      <View style={styles.raiz}>
        <View style={styles.cabecera}>
          <Pressable onPress={cerrar} hitSlop={10}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </Pressable>
          <Text style={styles.titulo}>Nueva rutina</Text>
          <View style={{ width: 70 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la rutina"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput
            style={[styles.input, { marginTop: spacing.sm }]}
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar ejercicio"
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
          />
          <Text style={styles.contador}>
            {elegidos.length === 1 ? '1 ejercicio elegido' : `${elegidos.length} ejercicios elegidos`}
          </Text>

          {texto ? (
            <>
              {resultados.length === 0 && (
                <Text style={styles.vacio}>No hay ejercicios con ese nombre.</Text>
              )}
              {resultados.map((e) => fila(e.id, e.nombre))}
            </>
          ) : (
            grupos.map((g) => {
              const abiertoAhora = abierto === g.id;
              const marcados = g.lista.filter((e) => elegidos.includes(e.id)).length;
              return (
                <View key={g.id} style={styles.grupo}>
                  <Pressable
                    style={styles.grupoCabecera}
                    onPress={() => setAbierto(abiertoAhora ? null : g.id)}
                  >
                    <Text style={styles.grupoNombre}>{NOMBRES[g.id]}</Text>
                    <Text style={styles.grupoInfo}>
                      {marcados > 0 ? `${marcados} elegidos · ` : ''}
                      {g.lista.length}
                    </Text>
                    <Text style={styles.flecha}>{abiertoAhora ? '⌃' : '⌄'}</Text>
                  </Pressable>
                  {abiertoAhora && (
                    <View style={styles.grupoLista}>{g.lista.map((e) => fila(e.id, e.nombre))}</View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.pie}>
          <Pressable
            style={[styles.guardar, !puedeGuardar && styles.deshabilitado]}
            onPress={guardar}
            disabled={!puedeGuardar}
          >
            <Text style={styles.guardarTexto}>Guardar rutina</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colors.background },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelar: { width: 70, color: colors.accent, fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 18, fontWeight: '700', color: colors.text },
  contenido: { padding: spacing.lg, paddingBottom: spacing.xl },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contador: { marginTop: spacing.md, marginBottom: spacing.sm, color: colors.textMuted, fontSize: 14 },
  vacio: { color: colors.textMuted, fontSize: 16 },
  grupo: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  grupoCabecera: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  grupoNombre: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  grupoInfo: { fontSize: 13, color: colors.accent, marginRight: spacing.sm },
  flecha: { fontSize: 22, color: colors.textMuted },
  grupoLista: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
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
  opcionTexto: { flex: 1, color: colors.text, fontSize: 16 },
  pie: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  guardar: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deshabilitado: { opacity: 0.4 },
  guardarTexto: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
