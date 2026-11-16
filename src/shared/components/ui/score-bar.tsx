type ScoreBarTone = "dark" | "muted" | "light";

type ScoreBarProps = {
  /** 0 a 100. */
  value: number;
  /** Lido por tecnologias assistivas, ex.: "Score de Lisboa". */
  label: string;
  tone?: ScoreBarTone;
  className?: string;
};

const FILLS: Record<ScoreBarTone, string> = {
  dark: "bg-brand-500",
  muted: "bg-brand-300",
  light: "bg-surface-700",
};

export function ScoreBar({
  value,
  label,
  tone = "dark",
  className = "",
}: ScoreBarProps) {
  const percentual = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentual}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-surface-500 ${className}`}
    >
      <div
        className={`h-full rounded-full ${FILLS[tone]}`}
        style={{ width: `${percentual}%` }}
      />
    </div>
  );
}
