type StepIndicatorProps = {
  current: number;
  total?: number;
};

export function StepIndicator({ current, total = 3 }: StepIndicatorProps) {
  return (
    <div
      className="flex w-full items-center justify-center gap-2"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Etapa ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isActive = step <= current;

        return (
          <span
            key={step}
            className={`h-1 flex-1 max-w-16 rounded-full transition-colors ${
              isActive ? "bg-brand-500" : "bg-surface-600"
            }`}
          />
        );
      })}
    </div>
  );
}
