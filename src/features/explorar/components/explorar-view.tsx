"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Chip,
  Page,
  PageHeader,
  SearchableSelect,
  StateMessage,
} from "@/shared/components/ui";
import { useDestinosRanking } from "@/features/destinos/api/use-destinos";
import { CATEGORIAS_EXPERIENCIA } from "@/features/destinos/constants/rotulos";
import type { ExperienciaCategoria } from "@/features/destinos/types/destino";
import {
  compatibilidadeDaExperiencia,
  experienciaCombina,
} from "@/features/destinos/utils/analise";
import {
  useSavedTourIds,
  useToggleSavedTourMutation,
} from "../api/use-saved-tours";
import { ExperienciaCard } from "./experiencia-card";
import {
  ExperienciaModal,
  type ExperienciaSelecionada,
} from "./experiencia-modal";

type FiltroCategoria = ExperienciaCategoria | "todas";

export function ExplorarView() {
  const router = useRouter();
  const pathname = usePathname();
  const slugNaUrl = useSearchParams().get("destino");
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");
  const [selecionada, setSelecionada] = useState<ExperienciaSelecionada | null>(
    null,
  );
  const { destinos, ranking, session, isPending, isError } =
    useDestinosRanking();
  const salvos = useSavedTourIds();
  const alternarSalvo = useToggleSavedTourMutation();

  function toggleSalvo(apiId: string) {
    alternarSalvo.mutate({ apiId, salvar: !salvos.has(apiId) });
  }

  // Sem `?destino=`, começa pelo destino que mais combina com o usuário.
  const destino = useMemo(
    () =>
      destinos?.find((item) => item.slug === slugNaUrl) ?? ranking[0]?.destino,
    [destinos, ranking, slugNaUrl],
  );

  const experiencias = useMemo(() => {
    if (!destino || !session) return [];

    return destino.experiencias
      .filter((item) => categoria === "todas" || item.categoria === categoria)
      .map((experiencia) => ({
        experiencia,
        combina: experienciaCombina(experiencia, session),
        match: compatibilidadeDaExperiencia(experiencia, destino, session),
      }))
      .sort((a, b) => Number(b.combina) - Number(a.combina) || b.match - a.match);
  }, [destino, session, categoria]);

  if (isPending) {
    return <StateMessage variant="loading" title="Buscando experiências…" />;
  }

  if (isError || !destino) {
    return (
      <StateMessage
        variant="error"
        title="Não foi possível carregar as experiências"
        description="Tente recarregar a página em instantes."
      />
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Explore o inesperado"
        title={`${destino.cidade}, ${destino.uf}`}
        description="Experiências selecionadas para o seu perfil de viagem."
        actions={
          <div className="w-full sm:w-64">
            <SearchableSelect
              value={destino.slug}
              options={(destinos ?? []).map((item) => ({
                value: item.slug,
                label: `${item.cidade}, ${item.uf}`,
              }))}
              onChange={(slug) => router.replace(`${pathname}?destino=${slug}`)}
              searchPlaceholder="Buscar destino"
            />
          </div>
        }
      />

      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="-mx-1 flex gap-inline overflow-x-auto px-1 pb-1"
      >
        <Chip
          selected={categoria === "todas"}
          onClick={() => setCategoria("todas")}
          className="shrink-0"
        >
          Todas as experiências
        </Chip>
        {CATEGORIAS_EXPERIENCIA.map(({ id, label, icon: Icone }) => (
          <Chip
            key={id}
            selected={categoria === id}
            onClick={() => setCategoria(id)}
            icon={<Icone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
            className="shrink-0"
          >
            {label}
          </Chip>
        ))}
      </div>

      {alternarSalvo.error ? (
        <p
          role="alert"
          className="rounded-lg bg-error-50 px-3.5 py-2.5 font-sans text-xs text-error-500"
        >
          {alternarSalvo.error.message}
        </p>
      ) : null}

      {experiencias.length === 0 ? (
        <StateMessage
          variant="empty"
          title="Nada por aqui ainda"
          description={`Não há experiências desta categoria em ${destino.cidade}. Tente outra categoria.`}
        />
      ) : (
        <ul className="grid gap-block md:grid-cols-2 xl:grid-cols-3">
          {experiencias.map((item) => (
            <li key={item.experiencia.id} className="flex min-w-0">
              <ExperienciaCard
                experiencia={item.experiencia}
                destino={destino}
                combina={item.combina}
                salvo={salvos.has(item.experiencia.id)}
                onSelect={() => setSelecionada(item)}
                onToggleSalvo={() => toggleSalvo(item.experiencia.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <ExperienciaModal
        item={selecionada}
        destino={destino}
        salvo={selecionada ? salvos.has(selecionada.experiencia.id) : false}
        onToggleSalvo={() => selecionada && toggleSalvo(selecionada.experiencia.id)}
        onClose={() => setSelecionada(null)}
      />
    </Page>
  );
}
