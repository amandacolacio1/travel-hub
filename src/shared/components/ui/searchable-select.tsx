"use client";

import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { type ReactNode, useState } from "react";
import { Label } from "./label";

type SearchableSelectOption = {
  value: string;
  label: string;
  prefix?: ReactNode;
};

type SearchableSelectProps = {
  label?: string;
  error?: string;
  id?: string;
  name?: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export function SearchableSelect({
  label,
  error,
  id,
  name,
  options,
  placeholder = "Selecione",
  searchPlaceholder = "Pesquisar",
  emptyMessage = "Nenhum resultado encontrado",
  disabled = false,
  className = "",
  value,
  onChange,
}: SearchableSelectProps) {
  const [aberto, setAberto] = useState(false);
  const selectId = id ?? name;
  const selecionado = options.find((option) => option.value === value);

  return (
    <div className="w-full">
      {label ? <Label htmlFor={selectId}>{label}</Label> : null}

      <Popover.Root open={aberto} onOpenChange={setAberto}>
        <Popover.Trigger
          id={selectId}
          type="button"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-paper px-3.5 py-3 text-left font-sans text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-error-500"
              : "border-surface-600 data-[state=open]:border-brand-500"
          } ${className}`}
        >
          {selecionado?.prefix}
          <span
            className={`min-w-0 flex-1 truncate ${
              selecionado ? "text-ink" : "text-text-muted-400"
            }`}
          >
            {selecionado?.label ?? placeholder}
          </span>
          <ChevronIcon />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-surface-600 bg-paper shadow-lg"
          >
            <Command
              filter={(itemValue, search) =>
                itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
              }
            >
              <div className="border-b border-surface-600 p-2">
                <Command.Input
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md border border-surface-600 bg-paper px-3 py-2 font-sans text-sm text-ink outline-none transition-colors focus:border-brand-500 placeholder:text-text-muted-400"
                />
              </div>

              <Command.List className="max-h-60 overflow-y-auto p-1.5">
                <Command.Empty className="px-3 py-6 text-center font-sans text-sm text-text-muted-400">
                  {emptyMessage}
                </Command.Empty>

                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setAberto(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 font-sans text-sm text-ink transition-colors data-[selected=true]:bg-surface-alt-500"
                  >
                    {option.prefix}
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                    {option.value === value ? <CheckIcon /> : null}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error ? (
        <p className="mt-1.5 font-sans text-xs text-error-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-text-muted-400"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-brand-500"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
