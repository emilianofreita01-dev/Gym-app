import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import PanelesZonas from '../src/components/PanelesZonas';
import { ZONAS_CUERPO } from '../src/data/zonas';
import { colors } from '../src/theme/theme';

export default function Inicio() {
  return (
    <View style={styles.container}>
      <PanelesZonas
        items={ZONAS_CUERPO}
        onSeleccionar={(id) => router.push({ pathname: '/zona/[id]', params: { id } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
