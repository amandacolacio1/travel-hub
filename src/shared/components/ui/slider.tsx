import { type InputHTMLAttributes, forwardRef } from "react";
import { Label } from "./label";

type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  formatValue?: (value: number) => string;
};

function defaultFormat(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider(
    {
      className = "",
      label,
      value,
      onChange,
      min = 0,
      max = 100,
      step = 500,
      minLabel,
      maxLabel,
      formatValue = defaultFormat,
      id,
      ...props
    },
    ref,
  ) {
    const sliderId = id ?? props.name;
    const minNum = Number(min);
    const maxNum = Number(max);
    const percent = ((value - minNum) / (maxNum - minNum)) * 100;

    return (
      <div className={`w-full ${className}`}>
        {label ? <Label htmlFor={sliderId}>{label}</Label> : null}
        <div className="relative mb-2 flex justify-center">
          <span className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-medium text-paper">
            {formatValue(value)}
          </span>
        </div>
        <input
          ref={ref}
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="auth-slider w-full cursor-pointer appearance-none bg-transparent"
          style={{
            background: `linear-gradient(to right, var(--color-brand-500) 0%, var(--color-brand-500) ${percent}%, var(--color-surface-600) ${percent}%, var(--color-surface-600) 100%)`,
          }}
          {...props}
        />
        <div className="mt-1.5 flex justify-between text-xs text-text-muted-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    );
  },
);
