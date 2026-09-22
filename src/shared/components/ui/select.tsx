import { type SelectHTMLAttributes, forwardRef } from "react";
import { Label } from "./label";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className = "",
      label,
      error,
      id,
      options,
      placeholder = "Selecione",
      ...props
    },
    ref,
  ) {
    const selectId = id ?? props.name;

    return (
      <div className="w-full">
        {label ? <Label htmlFor={selectId}>{label}</Label> : null}
        <select
          ref={ref}
          id={selectId}
          className={`w-full cursor-pointer appearance-none rounded-lg border bg-paper px-3.5 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-brand-500 disabled:cursor-not-allowed ${
            error ? "border-error-500" : "border-surface-600"
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1.5 font-sans text-xs text-error-500" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
