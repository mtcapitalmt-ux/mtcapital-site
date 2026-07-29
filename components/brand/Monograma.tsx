type Props = {
  className?: string;
  corM?: string;
  corT?: string;
  title?: string;
};

/**
 * Monograma "MT" vetorizado a partir da referência oficial
 * (avatares - wpp-03.png): M em zigue-zague de traço uniforme com
 * haste vertical à esquerda; T com haste vertical à direita cuja barra
 * atravessa o vão do M na diagonal.
 */
export function Monograma({
  className,
  corM = "currentColor",
  corT = "var(--gold-lt)",
  title = "MT Capital",
}: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* M — haste vertical esquerda + zigue-zague */}
      <path
        fill={corM}
        d="M2,10 L2,106 L18,106 L18,10 Z M2,10 L60,64 L109,10 L60,52 L18,10 Z"
      />
      {/* T — barra diagonal atravessando o vão do M + haste vertical direita */}
      <path
        fill={corT}
        d="M30,98 L97,48 L97,64 L46,102 Z M97,46 L113,46 L113,104 L97,104 Z"
      />
    </svg>
  );
}
