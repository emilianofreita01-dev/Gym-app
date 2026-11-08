import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Rutina = { id: string; nombre: string; ejercicios: string[]; creada: number };

export type SerieRegistrada = { peso: number; repeticiones: number };
export type EjercicioRegistrado = { ejercicioId: string; series: SerieRegistrada[] };
export type Entrenamiento = {
  id: string;
  fecha: number;
  nombreRutina: string;
  ejercicios: EjercicioRegistrado[];
};

type Estado = {
  rutinas: Rutina[];
  entrenamientos: Entrenamiento[];
  crearRutina: (nombre: string, ejercicios: string[]) => void;
  borrarRutina: (id: string) => void;
  guardarEntrenamiento: (datos: Omit<Entrenamiento, 'id' | 'fecha'>) => void;
  borrarEntrenamiento: (id: string) => void;
};

const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useStore = create<Estado>()(
  persist(
    (set) => ({
      rutinas: [],
      entrenamientos: [],
      crearRutina: (nombre, ejercicios) =>
        set((s) => ({
          rutinas: [{ id: nuevoId(), nombre, ejercicios, creada: Date.now() }, ...s.rutinas],
        })),
      borrarRutina: (id) => set((s) => ({ rutinas: s.rutinas.filter((r) => r.id !== id) })),
      guardarEntrenamiento: (datos) =>
        set((s) => ({
          entrenamientos: [{ ...datos, id: nuevoId(), fecha: Date.now() }, ...s.entrenamientos],
        })),
      borrarEntrenamiento: (id) =>
        set((s) => ({ entrenamientos: s.entrenamientos.filter((e) => e.id !== id) })),
    }),
    { name: 'gym-datos', storage: createJSONStorage(() => AsyncStorage) }
  )
);
