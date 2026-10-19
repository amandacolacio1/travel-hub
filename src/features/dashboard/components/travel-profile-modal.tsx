"use client";

import { Check } from "lucide-react";
import { AuthIcon } from "@/features/auth";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import type { PerfilViagem } from "@/features/auth/types/auth";
import { Button, Modal } from "@/shared/components/ui";

type TravelProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: PerfilViagem;
  onSelect: (perfil: PerfilViagem) => void;
};

export function TravelProfileModal({
  open,
  onOpenChange,
  value,
  onSelect,
}: TravelProfileModalProps) {
  function escolher(perfil: PerfilViagem) {
    onSelect(perfil);
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Como você vai viajar?"
      description="Isso ajusta as recomendações de destino."
    >
      <div className="flex flex-col gap-2.5">
        {TRAVEL_PROFILES.map((perfil) => {
          const selecionado = perfil.id === value;

          return (
            <button
              key={perfil.id}
              type="button"
              onClick={() => escolher(perfil.id)}
              aria-pressed={selecionado}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                selecionado
                  ? "border-brand-500 bg-surface-alt-500"
                  : "border-surface-600 bg-paper hover:border-brand-300"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  selecionado
                    ? "bg-brand-500 text-paper"
                    : "bg-surface-alt-500 text-brand-alt-400"
                }`}
              >
                <AuthIcon name={perfil.icon} className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-sans text-sm font-semibold text-ink">
                  {perfil.titulo}
                </span>
                <span className="mt-0.5 block font-sans text-xs leading-snug text-text-muted-400">
                  {perfil.descricao}
                </span>
              </span>

              {selecionado ? (
                <Check
                  className="h-4 w-4 shrink-0 text-brand-500"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* No mobile o sheet precisa de uma saída explícita, como no design. */}
      <Button
        variant="ghost"
        type="button"
        className="mt-4 sm:hidden"
        onClick={() => onOpenChange(false)}
      >
        CANCELAR
      </Button>
    </Modal>
  );
}
