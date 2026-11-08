import type { MuscleId } from './body';

export type ZonaId = 'tren-superior' | 'abdomen' | 'tren-inferior' | 'espalda';

export type ZonaCuerpo = {
  id: ZonaId;
  titulo: string;
  subtitulo: string;
  musculos: MuscleId[];
};

export const ZONAS_CUERPO: ZonaCuerpo[] = [
  {
    id: 'tren-superior',
    titulo: 'Tren superior',
    subtitulo: 'Pecho, hombros y brazos',
    musculos: ['pecho', 'hombros', 'biceps', 'triceps', 'antebrazos', 'trapecio'],
  },
  {
    id: 'abdomen',
    titulo: 'Abdomen',
    subtitulo: 'Fortalece tu zona core',
    musculos: ['abdominales', 'oblicuos'],
  },
  {
    id: 'tren-inferior',
    titulo: 'Tren inferior',
    subtitulo: 'Piernas y glúteos',
    musculos: ['cuadriceps', 'isquiotibiales', 'gluteos', 'pantorrillas'],
  },
  {
    id: 'espalda',
    titulo: 'Espalda',
    subtitulo: 'Construye una espalda fuerte',
    musculos: ['dorsales', 'trapecio', 'lumbares'],
  },
];

export const buscarZona = (id: string) => ZONAS_CUERPO.find((z) => z.id === id);
