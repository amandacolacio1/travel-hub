"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Clock, Gauge, Heart, X } from "lucide-react";
import { Badge, Button, CoverImage, Eyebrow } from "@/shared/components/ui";
import type { Destino, Experiencia } from "@/features/destinos/types/destino";
import { formatarMoedaLocal } from "@/features/destinos/utils/formatadores";
import { rotuloCategoria } from "./experiencia-card";

export type ExperienciaSelecionada = {
  experiencia: Experiencia;
  combina: boolean;
  /** Compatibilidade de 0 a 99. */
  match: number;
};

type ExperienciaModalProps = {
  item: ExperienciaSelecionada | null;
  destino: Destino;
  salvo: boolean;
  onToggleSalvo: () => void;
  onClose: () => void;
};

/** Detalhe da experiência: foto, descrição, compatibilidade e preço. */
export function ExperienciaModal({
  item,
  destino,
  salvo,
  onToggleSalvo,
  onClose,
}: ExperienciaModalProps) {
  return (
    <Dialog.Root open={item !== null} onOpenChange={(aberto) => !aberto && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-500/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-paper shadow-xl outline-none">
          {item ? (
            <>
              <CoverImage
                src={item.experiencia.imagem ?? destino.imagem}
                alt=""
                sizes="448px"
                className="aspect-[4/3] w-full"
              >
                <Dialog.Close
                  aria-label="Fechar"
                  className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Dialog.Close>
              </CoverImage>

              <div className="flex flex-col gap-stack p-card-lg">
                <div className="flex flex-col gap-1">
                  <Eyebrow className="text-[10px]">
                    {item.combina
                      ? "Match perfeito"
                      : rotuloCategoria(item.experiencia)}
                  </Eyebrow>
                  <Dialog.Title className="font-serif text-xl text-ink">
                    {item.experiencia.titulo}
                  </Dialog.Title>
                </div>

                <Dialog.Description className="font-sans text-sm leading-relaxed text-text-muted-500">
                  {item.experiencia.descricao}
                </Dialog.Description>

                <ul className="flex flex-wrap gap-inline">
                  <li>
                    <Badge className="py-1.5">{item.match}% match</Badge>
                  </li>
                  <li>
                    <Badge className="py-1.5">
                      <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      {item.experiencia.duracao}
                    </Badge>
                  </li>
                  <li>
                    <Badge className="py-1.5">
                      <Gauge className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      {item.experiencia.nivel}
                    </Badge>
                  </li>
                </ul>

                <p className="font-sans text-sm text-ink">
                  <span className="text-text-muted-400">A partir de </span>
                  <strong className="font-semibold">
                    {formatarMoedaLocal(item.experiencia.preco, destino.moeda.codigo)}
                  </strong>
                </p>

                <div className="flex flex-col gap-1.5">
                  <Button
                    variant="secondary"
                    aria-pressed={salvo}
                    onClick={onToggleSalvo}
                  >
                    <Heart
                      className={`h-4 w-4 ${salvo ? "fill-current" : ""}`}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    {salvo ? "Experiência salva" : "Salvar experiência"}
                  </Button>
                  <Button disabled className="uppercase tracking-[0.06em]">
                    Reservar experiência
                  </Button>
                  <p className="text-center font-sans text-xs text-text-muted-400">
                    As reservas ainda não estão disponíveis.
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
