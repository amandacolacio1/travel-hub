"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /**
   * No mobile o conteúdo sobe como bottom sheet; no desktop fica centralizado.
   * `centered` força o diálogo centralizado em qualquer largura.
   */
  variant?: "responsive" | "centered";
};

/**
 * Diálogo acessível sobre o Radix Dialog: foco preso no conteúdo, Esc fecha e
 * o restante da página é escondido de leitores de tela.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  variant = "responsive",
}: ModalProps) {
  const posicao =
    variant === "centered"
      ? "left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl"
      : "inset-x-0 bottom-0 rounded-t-2xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-500/40 backdrop-blur-[2px]" />
        <Dialog.Content
          className={`fixed z-50 flex max-h-[90dvh] flex-col overflow-y-auto border border-surface-600 bg-paper p-5 shadow-xl ${posicao}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="font-serif text-lg text-ink">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="font-sans text-sm text-text-muted-400">
                  {description}
                </Dialog.Description>
              ) : (
                // O Radix avisa no console se o diálogo não descreve a si mesmo.
                <Dialog.Description className="sr-only">
                  {title}
                </Dialog.Description>
              )}
            </div>

            <Dialog.Close
              aria-label="Fechar"
              className="shrink-0 cursor-pointer rounded-md p-1 text-text-muted-400 transition-colors hover:bg-surface-alt-500 hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Dialog.Close>
          </div>

          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
