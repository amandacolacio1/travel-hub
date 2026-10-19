"use client";

import * as Popover from "@radix-ui/react-popover";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { Button, CurrencyInput } from "@/shared/components/ui";

type BudgetChipProps = {
  inicial: number;
  final: number;
  onChange: (valores: { inicial: number; final: number }) => void;
};

function formatarBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function BudgetChip({ inicial, final, onChange }: BudgetChipProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger className="flex cursor-pointer items-center gap-2 rounded-full border border-surface-600 bg-paper px-3.5 py-2 font-sans text-sm text-ink transition-colors hover:border-brand-300 data-[state=open]:border-brand-500">
        <Wallet
          className="h-4 w-4 shrink-0 text-text-muted-400"
          strokeWidth={1.5}
          aria-hidden
        />
        <span>
          {formatarBRL(inicial)} – {formatarBRL(final)}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-surface-600 bg-paper p-4 shadow-lg"
        >
          {/* Monta só quando abre: o rascunho nasce dos valores salvos. */}
          <BudgetChipForm
            inicialSalvo={inicial}
            finalSalvo={final}
            onCancel={() => setAberto(false)}
            onSave={(valores) => {
              onChange(valores);
              setAberto(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

type BudgetChipFormProps = {
  inicialSalvo: number;
  finalSalvo: number;
  onCancel: () => void;
  onSave: (valores: { inicial: number; final: number }) => void;
};

function BudgetChipForm({
  inicialSalvo,
  finalSalvo,
  onCancel,
  onSave,
}: BudgetChipFormProps) {
  const [rascunhoInicial, setRascunhoInicial] = useState(inicialSalvo);
  const [rascunhoFinal, setRascunhoFinal] = useState(finalSalvo);

  const erro =
    rascunhoFinal < rascunhoInicial
      ? "O valor final deve ser maior ou igual ao inicial"
      : undefined;

  return (
    <>
      <div className="flex flex-col gap-3">
        <CurrencyInput
          label="Orçamento inicial"
          value={rascunhoInicial}
          onChange={setRascunhoInicial}
        />
        <CurrencyInput
          label="Orçamento final"
          value={rascunhoFinal}
          onChange={setRascunhoFinal}
          error={erro}
        />
      </div>

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
          onClick={() =>
            onSave({ inicial: rascunhoInicial, final: rascunhoFinal })
          }
        >
          Salvar
        </Button>
      </div>
    </>
  );
}
