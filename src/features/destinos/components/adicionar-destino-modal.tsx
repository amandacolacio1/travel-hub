"use client";

import { useMemo, useState } from "react";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import type { PerfilViagem } from "@/features/auth/types/auth";
import { Button, Eyebrow, Modal, Select } from "@/shared/components/ui";
import type { Destino, DestinoComScore } from "../types/destino";

const MAX_SUGESTOES = 4;

type AdicionarDestinoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogo: Destino[];
  sugestoes: DestinoComScore[];
  perfilViagem?: PerfilViagem;
  /** Quantas vagas ainda restam na lista e o máximo permitido. */
  limite?: { vagas: number; max: number };
  onAdicionar: (destino: Destino) => void;
};

/** Escolha de país → cidade, com atalhos para os destinos que mais combinam. */
export function AdicionarDestinoModal(props: AdicionarDestinoModalProps) {
  const { open, onOpenChange } = props;

  // Remonta o formulário a cada abertura, descartando a escolha anterior.
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="centered"
      title="Adicionar destino"
      description={descricao(props.perfilViagem)}
    >
      <Formulario {...props} />
    </Modal>
  );
}

function descricao(perfil?: PerfilViagem): string {
  const titulo = TRAVEL_PROFILES.find((item) => item.id === perfil)?.titulo;
  const base = "Escolha um país e uma cidade para adicionar à sua lista.";

  return titulo
    ? `${base} Calculamos clima, câmbio e custo para o seu perfil ${titulo.toLowerCase()}.`
    : base;
}

function Formulario({
  onOpenChange,
  catalogo,
  sugestoes,
  limite,
  onAdicionar,
}: AdicionarDestinoModalProps) {
  const [pais, setPais] = useState("");
  const [slug, setSlug] = useState("");

  const paises = useMemo(
    () => [...new Set(catalogo.map((destino) => destino.pais))].sort(),
    [catalogo],
  );
  const cidades = useMemo(
    () => catalogo.filter((destino) => destino.pais === pais),
    [catalogo, pais],
  );

  function escolher(destino: Destino) {
    setPais(destino.pais);
    setSlug(destino.slug);
  }

  function confirmar() {
    const destino = catalogo.find((item) => item.slug === slug);
    if (!destino) return;

    onAdicionar(destino);
    onOpenChange(false);
  }

  return (
    <div className="flex flex-col gap-block">
      <div className="grid gap-inline sm:grid-cols-2">
        <Select
          aria-label="País"
          placeholder="País"
          value={pais}
          options={paises.map((nome) => ({ value: nome, label: nome }))}
          onChange={(evento) => {
            setPais(evento.target.value);
            setSlug("");
          }}
        />
        <Select
          aria-label="Cidade"
          placeholder="Cidade"
          value={slug}
          disabled={!pais}
          options={cidades.map((destino) => ({
            value: destino.slug,
            label: destino.cidade,
          }))}
          onChange={(evento) => setSlug(evento.target.value)}
        />
      </div>

      {sugestoes.length > 0 ? (
        <section className="flex flex-col gap-inline">
          <div className="flex items-center gap-inline">
            <Eyebrow className="text-[10px]">Sugestões para você</Eyebrow>
            <span aria-hidden className="h-px flex-1 bg-surface-600" />
          </div>

          <ul className="flex flex-col gap-inline">
            {sugestoes.slice(0, MAX_SUGESTOES).map(({ destino }) => (
              <li key={destino.slug}>
                <button
                  type="button"
                  onClick={() => escolher(destino)}
                  aria-pressed={destino.slug === slug}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-paper p-2.5 text-left transition-colors hover:border-brand-300 ${
                    destino.slug === slug
                      ? "border-brand-500"
                      : "border-surface-600"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-500 font-sans text-[11px] font-semibold text-text-muted-500">
                    {destino.codigoPais}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-sans text-sm font-semibold text-ink">
                      {destino.cidade}
                    </span>
                    <span className="truncate font-sans text-xs text-text-muted-400">
                      {destino.pais}, {destino.continente}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-inline">
        {limite ? (
          <p className="basis-full font-sans text-xs text-text-muted-400 sm:mr-auto sm:basis-auto">
            {limite.vagas} de {limite.max} vagas disponíveis
          </p>
        ) : null}
        <Button
          variant="ghost"
          fullWidth={false}
          className="bg-transparent"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button fullWidth={false} disabled={!slug} onClick={confirmar}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}
