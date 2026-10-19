"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "@/shared/components/ui";
import { getTodayISO, validateFutureDate } from "@/features/auth/utils/date";

type DateChipProps = {
  /** ISO `yyyy-mm-dd`; vazio quando ainda não há data escolhida. */
  value: string;
  onChange: (value: string) => void;
};

function formatarData(iso: string) {
  if (!iso) return "Escolher data";

  // Monta a data em horário local: `new Date("2026-03-10")` seria UTC e, em
  // fusos negativos, exibiria o dia anterior.
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DateChip({ value, onChange }: DateChipProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger className="flex cursor-pointer items-center gap-2 rounded-full border border-surface-600 bg-paper px-3.5 py-2 font-sans text-sm text-ink transition-colors hover:border-brand-300 data-[state=open]:border-brand-500">
        <Calendar
          className="h-4 w-4 shrink-0 text-text-muted-400"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className={value ? "text-ink" : "text-text-muted-400"}>
          {formatarData(value)}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-xl border border-surface-600 bg-paper p-4 shadow-lg"
        >
          {/* Monta só quando abre, então o rascunho sempre nasce do valor
              salvo — sem precisar de efeito para ressincronizar. */}
          <DateChipForm
            valorInicial={value}
            onCancel={() => setAberto(false)}
            onSave={(data) => {
              onChange(data);
              setAberto(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

type DateChipFormProps = {
  valorInicial: string;
  onCancel: () => void;
  onSave: (value: string) => void;
};

function DateChipForm({ valorInicial, onCancel, onSave }: DateChipFormProps) {
  const [rascunho, setRascunho] = useState(valorInicial);
  const erro = validateFutureDate(rascunho);

  return (
    <>
      <Input
        label="Data prevista"
        type="date"
        min={getTodayISO()}
        value={rascunho}
        onChange={(event) => setRascunho(event.target.value)}
        error={erro}
      />

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          type="button"
          className="w-auto px-3 py-2 text-xs"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="button"
          className="w-auto px-3 py-2 text-xs"
          disabled={Boolean(erro)}
          onClick={() => onSave(rascunho)}
        >
          Salvar
        </Button>
      </div>
    </>
  );
}
