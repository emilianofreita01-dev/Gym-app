import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Perfil = { nombre: string; setNombre: (nombre: string) => void };

export const usePerfil = create<Perfil>()(
  persist(
    (set) => ({ nombre: '', setNombre: (nombre) => set({ nombre }) }),
    { name: 'gym-perfil', storage: createJSONStorage(() => AsyncStorage) }
  )
);
