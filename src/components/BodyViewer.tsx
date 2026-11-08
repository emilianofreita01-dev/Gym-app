import Svg, { Path } from 'react-native-svg';
import { BASE_CENTRO, BASE_MITAD, ZONAS, type BodyView, type MuscleId } from '../data/body';
import { bodyColors, colors } from '../theme/theme';

const ESPEJO = 'translate(200 0) scale(-1 1)';

type PiezaProps = {
  d: string;
  activa: boolean;
  espejo?: boolean;
  onPress: () => void;
};

function Pieza({ d, activa, espejo, onPress }: PiezaProps) {
  const transform = espejo ? ESPEJO : undefined;
  return (
    <>
      {activa && (
        <Path
          d={d}
          transform={transform}
          fill="none"
          stroke={colors.accent}
          strokeWidth={5}
          strokeOpacity={0.35}
          strokeLinejoin="round"
        />
      )}
      <Path
        d={d}
        transform={transform}
        fill={activa ? colors.accent : bodyColors.zona}
        stroke={activa ? bodyColors.contornoActivo : colors.background}
        strokeWidth={activa ? 1.5 : 1}
        strokeLinejoin="round"
        onPress={onPress}
      />
    </>
  );
}

type Props = {
  vista: BodyView;
  seleccion: MuscleId | null;
  onSeleccionar: (id: MuscleId) => void;
};

export default function BodyViewer({ vista, seleccion, onSeleccionar }: Props) {
  // La zona seleccionada se dibuja al final para que quede por encima.
  const zonas = [...ZONAS[vista]].sort(
    (a, b) => Number(a.id === seleccion) - Number(b.id === seleccion)
  );

  return (
    <Svg viewBox="0 0 200 420" width="100%" height="100%">
      {BASE_CENTRO.map((d, i) => (
        <Path key={`c${i}`} d={d} fill={bodyColors.cabeza} />
      ))}
      {BASE_MITAD.map((d, i) => (
        <Path key={`b${i}`} d={d} fill={bodyColors.base} />
      ))}
      {BASE_MITAD.map((d, i) => (
        <Path key={`bm${i}`} d={d} fill={bodyColors.base} transform={ESPEJO} />
      ))}
      {zonas.map((zona) =>
        zona.paths.flatMap((d, i) => {
          const activa = zona.id === seleccion;
          const alTocar = () => onSeleccionar(zona.id);
          return [
            <Pieza key={`${zona.id}-${i}`} d={d} activa={activa} onPress={alTocar} />,
            <Pieza key={`${zona.id}-${i}-m`} d={d} activa={activa} espejo onPress={alTocar} />,
          ];
        })
      )}
    </Svg>
  );
}
