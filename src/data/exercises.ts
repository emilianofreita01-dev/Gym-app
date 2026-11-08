import type { MuscleId } from './body';

export type Ejercicio = {
  id: string;
  nombre: string;
  principales: MuscleId[];
  secundarios: MuscleId[];
  posicionInicial: string;
  ejecucion: string;
  respiracion: string;
  errores: string[];
};

const EJERCICIOS_BASE: Ejercicio[] = [
  {
    id: 'press-banca',
    nombre: 'Press de banca',
    principales: ['pecho'],
    secundarios: ['hombros', 'triceps'],
    posicionInicial:
      'Acuéstate en el banco con los pies firmes en el suelo, los hombros hacia atrás y abajo, y la espalda con su arco natural. Toma la barra un poco más abierta que el ancho de los hombros y sostenla con los brazos extendidos sobre el pecho.',
    ejecucion:
      'Baja la barra de forma controlada hasta rozar la parte media del pecho, con los codos en un ángulo cómodo, ni pegados al cuerpo ni abiertos en cruz. Empuja hacia arriba hasta extender los brazos, sin bloquear los codos de golpe.',
    respiracion: 'Inhala mientras bajas la barra y exhala al empujar hacia arriba.',
    errores: [
      'Rebotar la barra en el pecho.',
      'Levantar la cadera del banco al empujar.',
      'Abrir los codos en cruz, lo que carga demasiado los hombros.',
      'Usar mucho peso sin soportes de seguridad ni alguien que te asista.',
    ],
  },
  {
    id: 'sentadilla',
    nombre: 'Sentadilla', 
    principales: ['cuadriceps', 'gluteos'],
    secundarios: ['isquiotibiales', 'lumbares'],
    posicionInicial:
      'De pie, con los pies al ancho de los hombros o un poco más y las puntas ligeramente hacia afuera. Apoya la barra sobre la parte alta de la espalda, con el pecho arriba y el abdomen firme.',
    ejecucion:
      'Flexiona cadera y rodillas a la vez, como si te sentaras hacia atrás, con la espalda recta y las rodillas en línea con las puntas de los pies. Baja hasta donde puedas sin perder la postura, idealmente con los muslos paralelos al suelo, y sube empujando el suelo con todo el pie.',
    respiracion:
      'Inhala antes de bajar y mantén el abdomen firme. Exhala mientras subes.',
    errores: [
      'Dejar que las rodillas se vayan hacia adentro.',
      'Despegar los talones del suelo.',
      'Redondear la espalda baja al bajar.',
      'Inclinarse demasiado hacia adelante.',
    ],
  },
  {
    id: 'dominadas',
    nombre: 'Dominadas',
    principales: ['dorsales'],
    secundarios: ['biceps', 'antebrazos', 'trapecio'],
    posicionInicial:
      'Cuélgate de la barra con las palmas hacia adelante y las manos un poco más abiertas que los hombros. Mantén los brazos extendidos, los hombros activos, sin encogerlos hacia las orejas, y las piernas juntas.',
    ejecucion:
      'Tira del cuerpo hacia arriba llevando los codos hacia abajo y atrás, hasta que el mentón supere la barra. Baja de forma lenta y controlada hasta extender los brazos.',
    respiracion: 'Exhala al subir e inhala al bajar.',
    errores: [
      'Balancearse para tomar impulso.',
      'No extender los brazos del todo al bajar.',
      'Encoger los hombros hacia las orejas.',
      'Estirar el cuello hacia adelante para llegar a la barra.',
    ],
  },
];

export const ejerciciosPorMusculo = (id: MuscleId) =>
  EJERCICIOS.filter((e) => e.principales.includes(id) || e.secundarios.includes(id));

export const buscarEjercicio = (id: string) => EJERCICIOS.find((e) => e.id === id);

import { EJERCICIOS_EXTRA } from './exercises-extra';

export const EJERCICIOS: Ejercicio[] = [...EJERCICIOS_BASE, ...EJERCICIOS_EXTRA];
