"use client";

import { useMemo, useState } from "react";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import type { DestinoDesejado, PerfilViagem } from "@/features/auth/types/auth";
import { Button, Eyebrow, Modal, SearchableSelect } from "@/shared/components/ui";
import { useCities, useStates } from "@/shared/locations";
import type { DestinoComScore } from "../types/destino";

const MAX_SUGESTOES = 4;

type AdicionarDestinoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sugestoes: DestinoComScore[];
  perfilViagem?: PerfilViagem;
  /** Quantas vagas ainda restam na lista e o máximo permitido. */
  limite?: { vagas: number; max: number };
  onAdicionar: (destino: DestinoDesejado) => void;
};

/** Escolha de estado → cidade (IBGE), com atalhos para os destinos que mais combinam. */
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
  const base = "Escolha um estado e uma cidade do Brasil para adicionar à sua lista.";

  return titulo
    ? `${base} Calculamos clima e custo para o seu perfil ${titulo.toLowerCase()}.`
    : base;
}

function Formulario({
  onOpenChange,
  sugestoes,
  limite,
  onAdicionar,
}: AdicionarDestinoModalProps) {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const estados = useStates();
  const cidades = useCities(uf);

  const opcoesDeEstado = useMemo(
    () => (estados.data ?? []).map((item) => ({ value: item.uf, label: item.nome })),
    [estados.data],
  );
  const opcoesDeCidade = useMemo(
    () => (cidades.data ?? []).map((item) => ({ value: item.nome, label: item.nome })),
    [cidades.data],
  );

  function escolher(destino: DestinoDesejado) {
    setUf(destino.uf);
    setCidade(destino.cidade);
  }

  function confirmar() {
    if (!uf || !cidade) return;

    onAdicionar({ uf, cidade });
    onOpenChange(false);
  }

  const selecionada = (destino: DestinoDesejado) =>
    destino.uf === uf && destino.cidade === cidade;

  return (
    <div className="flex flex-col gap-block">
      <div className="grid gap-inline sm:grid-cols-2">
        <SearchableSelect
          label="Estado"
          placeholder={estados.isPending ? "Carregando…" : "Estado"}
          searchPlaceholder="Pesquisar estado"
          value={uf}
          options={opcoesDeEstado}
          onChange={(valor) => {
            setUf(valor);
            setCidade("");
          }}
        />
        <SearchableSelect
          label="Cidade"
          placeholder={uf && cidades.isPending ? "Carregando…" : "Cidade"}
          searchPlaceholder="Pesquisar cidade"
          value={cidade}
          disabled={!uf}
          options={opcoesDeCidade}
          onChange={setCidade}
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
                  aria-pressed={selecionada(destino)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-paper p-2.5 text-left transition-colors hover:border-brand-300 ${
                    selecionada(destino)
                      ? "border-brand-500"
                      : "border-surface-600"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-500 font-sans text-[11px] font-semibold text-text-muted-500">
                    {destino.uf}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-sans text-sm font-semibold text-ink">
                      {destino.cidade}
                    </span>
                    <span className="truncate font-sans text-xs text-text-muted-400">
                      {destino.estado}, {destino.regiao}
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
        <Button fullWidth={false} disabled={!uf || !cidade} onClick={confirmar}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}
