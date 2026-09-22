"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import { Wallet } from "lucide-react";
import { Input } from "./input";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "inputMode"
> & {
  label?: string;
  error?: string;
  value: number;
  onChange: (value: number) => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatBRL(value: number) {
  if (!value) return "";
  return value.toLocaleString("pt-BR");
}

function parseBRL(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return 0;
  return Number(digits);
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    {
      label,
      error,
      value,
      onChange,
      placeholder = "0",
      ...props
    },
    ref,
  ) {
    return (
      <Input
        ref={ref}
        label={label}
        error={error}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={formatBRL(value)}
        onChange={(event) => onChange(parseBRL(event.target.value))}
        startAdornment={
          <>
            <Wallet
              className="h-4 w-4 shrink-0 text-text-muted-400"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="shrink-0 font-sans text-sm text-text-muted-400">
              R$
            </span>
          </>
        }
        {...props}
      />
    );
  },
);
