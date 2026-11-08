import { StyleSheet, Text, View } from 'react-native';

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym</Text>
      <Text style={styles.subtitle}>Proyecto base listo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1E',
  },
  title: { fontSize: 32, fontWeight: '700', color: '#F2EFE9' },
  subtitle: { marginTop: 8, fontSize: 16, color: '#8E8E93' },
});
