import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PanelesZonas from '../src/components/PanelesZonas';
import { NOMBRES } from '../src/data/body';
import { EJERCICIOS } from '../src/data/exercises';
import { ZONAS_CUERPO } from '../src/data/zonas';
import { colors, radius, spacing } from '../src/theme/theme';

const normalizar = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const texto = normalizar(busqueda.trim());
  const resultados = texto
    ? EJERCICIOS.filter((e) => normalizar(e.nombre).includes(texto))
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <TextInput
          style={styles.input}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar ejercicio"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          returnKeyType="search"
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')}>
            <Text style={styles.limpiar}>✕</Text>
          </Pressable>
        )}
      </View>

      {texto ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.lista}>
          {resultados.length === 0 && (
            <Text style={styles.vacio}>No encontramos ejercicios con ese nombre.</Text>
          )}
          {resultados.map((e) => (
            <Pressable
              key={e.id}
              style={styles.tarjeta}
              onPress={() => router.push({ pathname: '/ejercicio/[id]', params: { id: e.id } })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.nombre}>{e.nombre}</Text>
                <Text style={styles.musculos}>
                  {e.principales.map((m) => NOMBRES[m]).join(', ')}
                </Text>
              </View>
              <Text style={styles.flecha}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <PanelesZonas
          items={ZONAS_CUERPO}
          onSeleccionar={(id) => router.push({ pathname: '/zona/[id]', params: { id } })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, paddingVertical: spacing.sm, color: colors.text, fontSize: 16 },
  limpiar: { color: colors.textMuted, fontSize: 18, paddingLeft: spacing.sm },
  lista: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  vacio: { color: colors.textMuted, fontSize: 16 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nombre: { fontSize: 17, fontWeight: '700', color: colors.text },
  musculos: { marginTop: spacing.xs, fontSize: 13, color: colors.accent },
  flecha: { fontSize: 26, color: colors.textMuted },
});
