import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Label } from "./label";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", label, error, id, startAdornment, endAdornment, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  const fieldClasses = error
    ? "border-error-500"
    : "border-surface-600 focus-within:border-brand-500 focus:border-brand-500";

  return (
    <div className="w-full">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}

      {startAdornment || endAdornment ? (
        <div
          className={`flex w-full items-center gap-2 rounded-lg border bg-paper px-3.5 py-3 transition-colors ${fieldClasses} ${className}`}
        >
          {startAdornment}
          <input
            ref={ref}
            id={inputId}
            className="min-w-0 flex-1 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-text-muted-400"
            {...props}
          />
          {endAdornment}
        </div>
      ) : (
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-paper px-3.5 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-text-muted-400 focus:border-brand-500 ${fieldClasses} ${className}`}
          {...props}
        />
      )}

      {error ? (
        <p className="mt-1.5 font-sans text-xs text-error-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
