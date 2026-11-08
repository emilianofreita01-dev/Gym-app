import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrada' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Esta pantalla no existe.</Text>
        <Link href="/" style={styles.link}>Volver al inicio</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1E',
  },
  text: { fontSize: 18, color: '#F2EFE9' },
  link: { marginTop: 12, fontSize: 16, color: '#FF5A4F' },
});
