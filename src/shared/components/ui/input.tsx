import { type InputHTMLAttributes, forwardRef } from "react";
import { Label } from "./label";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", label, error, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border bg-paper px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-text-muted-400 focus:border-brand-500 ${
          error ? "border-error-500" : "border-surface-600"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-error-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
