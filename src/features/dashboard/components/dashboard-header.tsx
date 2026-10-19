"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import type { PerfilViagem } from "@/features/auth/types/auth";
import { Avatar, Logo } from "@/shared/components/ui";
import {
  useUpdatePerfilViagemMutation,
  useUpdatePreferenciasMutation,
} from "@/shared/session";
import type { Session } from "@/shared/session";
import { BudgetChip } from "./budget-chip";
import { DateChip } from "./date-chip";
import { TravelProfileModal } from "./travel-profile-modal";

type DashboardHeaderProps = {
  session: Session;
  onOpenMenu: () => void;
};

function rotuloPerfil(perfil: PerfilViagem) {
  return (
    TRAVEL_PROFILES.find((item) => item.id === perfil)?.titulo ?? perfil
  );
}

export function DashboardHeader({
  session,
  onOpenMenu,
}: DashboardHeaderProps) {
  const [perfilModalAberto, setPerfilModalAberto] = useState(false);
  const atualizarPerfil = useUpdatePerfilViagemMutation();
  const atualizarPreferencias = useUpdatePreferenciasMutation();

  const { usuario, preferencias, perfilViagem } = session;
  const primeiroNome = usuario.nome.split(" ")[0];

  const seletorPerfil = (
    <button
      type="button"
      onClick={() => setPerfilModalAberto(true)}
      className="flex max-w-full cursor-pointer items-center gap-1 font-sans text-xs text-text-muted-400 transition-colors hover:text-ink"
    >
      <span className="truncate">
        Viagem em {rotuloPerfil(perfilViagem)}
      </span>
      <ChevronDown
        className="h-3.5 w-3.5 shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
    </button>
  );

  return (
    <>
      <header className="border-b border-surface-600 bg-paper">
        {/* Desktop: filtros à esquerda, identidade à direita. */}
        <div className="hidden items-center justify-between gap-4 px-6 py-3.5 lg:flex">
          <div className="flex items-center gap-2.5">
            <DateChip
              value={preferencias.dataPrevista}
              onChange={(dataPrevista) =>
                atualizarPreferencias.mutate({ dataPrevista })
              }
            />
            <BudgetChip
              inicial={preferencias.orcamentoInicial}
              final={preferencias.orcamentoFinal}
              onChange={({ inicial, final }) =>
                atualizarPreferencias.mutate({
                  orcamentoInicial: inicial,
                  orcamentoFinal: final,
                })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-sans text-sm font-semibold text-ink">
                Olá, {primeiroNome}!
              </span>
              {seletorPerfil}
            </div>
            <Avatar src={usuario.fotoUrl} nome={usuario.nome} />
          </div>
        </div>

        {/* Mobile: menu + logo à esquerda, identidade à direita. */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
          <div className="flex min-w-0 shrink items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Abrir menu"
              className="shrink-0 cursor-pointer rounded-md p-1.5 text-ink transition-colors hover:bg-surface-alt-500"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>
            {/* Largura explícita (não `w-auto`): assim a caixa da imagem
                acompanha a logo desenhada e ela não invade a saudação. */}
            <Logo variant="dark" className="h-auto w-32 shrink-0" />
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            {/* Abaixo de 400px não cabe saudação + perfil + logo na mesma
                linha; o seletor de perfil continua acessível pelo avatar. */}
            <div className="hidden min-w-0 flex-col items-end min-[400px]:flex">
              <span className="truncate font-sans text-xs font-semibold text-ink">
                Olá, {primeiroNome}!
              </span>
              {seletorPerfil}
            </div>
            <button
              type="button"
              onClick={() => setPerfilModalAberto(true)}
              aria-label={`Viagem em ${rotuloPerfil(perfilViagem)} — alterar perfil`}
              className="cursor-pointer rounded-full min-[400px]:pointer-events-none"
            >
              <Avatar src={usuario.fotoUrl} nome={usuario.nome} size="sm" />
            </button>
          </div>
        </div>

        {/* Mobile: filtros numa segunda linha, roláveis se faltar largura. */}
        <div className="flex gap-2.5 overflow-x-auto border-t border-surface-600 px-4 py-2.5 lg:hidden">
          <DateChip
            value={preferencias.dataPrevista}
            onChange={(dataPrevista) =>
              atualizarPreferencias.mutate({ dataPrevista })
            }
          />
          <BudgetChip
            inicial={preferencias.orcamentoInicial}
            final={preferencias.orcamentoFinal}
            onChange={({ inicial, final }) =>
              atualizarPreferencias.mutate({
                orcamentoInicial: inicial,
                orcamentoFinal: final,
              })
            }
          />
        </div>
      </header>

      <TravelProfileModal
        open={perfilModalAberto}
        onOpenChange={setPerfilModalAberto}
        value={perfilViagem}
        onSelect={(perfil) => atualizarPerfil.mutate(perfil)}
      />
    </>
  );
}
