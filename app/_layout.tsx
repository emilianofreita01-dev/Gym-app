import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../src/theme/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          swipeEnabled: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.accent,
          drawerInactiveTintColor: colors.text,
          drawerActiveBackgroundColor: colors.surface,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Inicio', drawerLabel: 'Inicio' }} />
        <Drawer.Screen name="rutina" options={{ title: 'Mi rutina', drawerLabel: 'Mi rutina' }} />
        <Drawer.Screen name="entrenamientos" options={{ title: 'Mis entrenamientos', drawerLabel: 'Mis entrenamientos' }} />
        <Drawer.Screen name="comunidad" options={{ title: 'Comunidad', drawerLabel: 'Comunidad' }} />
        <Drawer.Screen name="perfil" options={{ title: 'Mi perfil', drawerLabel: 'Mi perfil' }} />
        <Drawer.Screen name="plus" options={{ title: 'Plus', drawerLabel: 'Plus' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
