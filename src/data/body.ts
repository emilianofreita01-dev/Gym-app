export type BodyView = 'frente' | 'espalda';

export type MuscleId =
  | 'hombros' | 'pecho' | 'biceps' | 'triceps' | 'antebrazos'
  | 'abdominales' | 'oblicuos' | 'trapecio' | 'dorsales' | 'lumbares'
  | 'gluteos' | 'cuadriceps' | 'isquiotibiales' | 'pantorrillas';

export const NOMBRES: Record<MuscleId, string> = {
  hombros: 'Hombros',
  pecho: 'Pecho',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  antebrazos: 'Antebrazos',
  abdominales: 'Abdominales',
  oblicuos: 'Oblicuos',
  trapecio: 'Trapecio',
  dorsales: 'Dorsales',
  lumbares: 'Lumbares',
  gluteos: 'Glúteos',
  cuadriceps: 'Cuádriceps',
  isquiotibiales: 'Isquiotibiales',
  pantorrillas: 'Pantorrillas',
};

export type Zona = { id: MuscleId; paths: string[] };

// Cada forma se dibuja solo para la mitad izquierda; la derecha se espeja.
const HOMBRO = 'M70,70 C64,66 56,66 51,74 C47,84 48,94 54,100 C60,96 66,92 69,86 C71,80 71,74 70,70 Z';
const BRAZO = 'M54,104 C50,112 47,122 46,132 L60,136 C61,126 64,116 68,106 C64,108 58,108 54,104 Z';
const ANTEBRAZO = 'M46,140 C44,152 40,168 37,182 L49,186 C52,170 56,154 60,140 Z';

export const BASE_CENTRO = [
  'M100,12 C109,12 117,19 117,30 C117,42 109,50 100,50 C91,50 83,42 83,30 C83,19 91,12 100,12 Z',
  'M92,46 L108,46 L110,62 L90,62 Z',
];

export const BASE_MITAD = [
  'M100,60 L72,64 C66,80 70,100 73,120 C74,140 72,165 68,190 L100,198 Z',
  'M68,66 C56,66 48,78 46,100 C45,116 44,132 42,148 L36,184 L50,188 L56,152 L62,140 L72,104 Z',
  'M98,194 L72,200 C68,230 72,262 76,288 C75,310 77,350 80,384 L94,384 C94,350 95,310 96,288 C99,262 99,226 98,194 Z',
  'M36,184 C32,194 34,208 42,210 C50,208 52,196 48,186 Z',
  'M76,288 C74,298 78,306 86,306 C94,306 98,298 96,288 Z',
  'M78,384 C74,396 74,408 86,410 C96,410 98,400 94,384 Z',
];

export const ZONAS: Record<BodyView, Zona[]> = {
  frente: [
    { id: 'hombros', paths: [HOMBRO] },
    { id: 'pecho', paths: ['M98,70 C90,66 80,66 72,72 C68,84 70,98 78,106 C86,110 94,108 98,104 Z'] },
    { id: 'biceps', paths: [BRAZO] },
    { id: 'antebrazos', paths: [ANTEBRAZO] },
    {
      id: 'abdominales',
      paths: [
        'M87,114 L98,114 L98,126 L87,126 Z',
        'M87,129 L98,129 L98,141 L87,141 Z',
        'M87,144 L98,144 L98,156 L87,156 Z',
        'M88,159 L98,159 L98,172 C92,172 89,168 88,159 Z',
      ],
    },
    { id: 'oblicuos', paths: ['M85,114 L85,172 C79,168 75,158 74,144 C73,132 76,120 80,114 Z'] },
    { id: 'trapecio', paths: ['M96,52 C90,58 80,62 70,66 C74,72 82,68 96,64 Z'] },
    { id: 'cuadriceps', paths: ['M97,196 C90,194 78,196 72,202 C68,224 70,260 76,286 L96,286 C98,262 99,226 97,196 Z'] },
    { id: 'pantorrillas', paths: ['M78,308 C76,328 78,354 82,382 L92,382 C94,354 94,328 94,308 Z'] },
  ],
  espalda: [
    { id: 'trapecio', paths: ['M98,50 C90,56 80,60 70,66 C76,78 88,94 98,114 Z'] },
    { id: 'hombros', paths: [HOMBRO] },
    { id: 'triceps', paths: [BRAZO] },
    { id: 'antebrazos', paths: [ANTEBRAZO] },
    { id: 'dorsales', paths: ['M98,120 C90,108 80,98 72,92 C70,108 72,130 80,152 C86,156 92,156 98,154 Z'] },
    { id: 'lumbares', paths: ['M98,158 C92,158 88,158 86,162 L87,186 C90,190 94,192 98,192 Z'] },
    { id: 'gluteos', paths: ['M97,196 C90,192 78,194 72,202 C70,216 76,228 86,230 C92,230 96,224 97,218 Z'] },
    { id: 'isquiotibiales', paths: ['M97,234 C92,234 82,234 76,236 C74,254 74,272 78,286 L96,286 C98,268 99,250 97,234 Z'] },
    { id: 'pantorrillas', paths: ['M78,308 C74,324 76,346 82,366 L92,364 C96,346 96,324 94,308 Z'] },
  ],
};
