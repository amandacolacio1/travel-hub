type StepIndicatorProps = {
  current: number;
  total?: number;
  disabled?: boolean;
  onStepClick?: (step: number) => void;
};

export function StepIndicator({
  current,
  total = 3,
  disabled = false,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div
      className="flex w-full items-center justify-center gap-1.5 lg:justify-start lg:gap-2"
      role="group"
      aria-label={`Etapa ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isActive = step <= current;
        const isClickable = Boolean(onStepClick) && !disabled;

        return (
          <button
            key={step}
            type="button"
            onClick={() => onStepClick?.(step)}
            disabled={!isClickable}
            aria-current={step === current ? "step" : undefined}
            aria-label={`Ir para etapa ${step}`}
            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors lg:h-1 lg:w-auto lg:max-w-32 lg:flex-1 ${
              isActive ? "bg-brand-500" : "bg-surface-600"
            } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
          />
        );
      })}
    </div>
  );
}
