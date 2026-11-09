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
  quitarEjercicio: (rutinaId: string, ejercicioId: string) => void;
  agregarEjercicio: (rutinaId: string, ejercicioId: string) => void;
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
      quitarEjercicio: (rutinaId, ejercicioId) =>
        set((s) => ({
          rutinas: s.rutinas.map((r) =>
            r.id === rutinaId
              ? { ...r, ejercicios: r.ejercicios.filter((x) => x !== ejercicioId) }
              : r
          ),
        })),
      agregarEjercicio: (rutinaId, ejercicioId) =>
        set((s) => ({
          rutinas: s.rutinas.map((r) =>
            r.id === rutinaId && !r.ejercicios.includes(ejercicioId)
              ? { ...r, ejercicios: [...r.ejercicios, ejercicioId] }
              : r
          ),
        })),
      guardarEntrenamiento: (datos) =>
        set((s) => ({
          entrenamientos: [{ ...datos, id: nuevoId(), fecha: Date.now() }, ...s.entrenamientos],
        })),
      borrarEntrenamiento: (id) =>
        set((s) => ({ entrenamientos: s.entrenamientos.filter((e) => e.id !== id) })),
    }),
    {
      name: 'gym-datos',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Si algún día cambia la forma de los datos, se adaptan aquí sin perder lo guardado.
      migrate: (guardado) => guardado as Estado,
    }
  )
);
