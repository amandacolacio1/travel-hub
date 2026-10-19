"use client";

import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import { useSession } from "@/shared/session";

export default function DashboardPage() {
  const { session } = useSession();

  // O layout já segura a renderização até a sessão existir.
  if (!session) return null;

  const { usuario, preferencias, perfilViagem } = session;
  const perfil = TRAVEL_PROFILES.find((item) => item.id === perfilViagem);

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl text-ink">
          Olá, {usuario.nome.split(" ")[0]}!
        </h1>
        <p className="mt-1 font-sans text-sm text-text-muted-400">
          Aqui vai entrar o ranking de destinos recomendados para você.
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ResumoCard titulo="Perfil de viagem" valor={perfil?.titulo ?? "—"} />
        <ResumoCard
          titulo="Orçamento"
          valor={`${formatarBRL(preferencias.orcamentoInicial)} – ${formatarBRL(
            preferencias.orcamentoFinal,
          )}`}
        />
        <ResumoCard
          titulo="Interesses"
          valor={
            preferencias.interesses.length
              ? preferencias.interesses.join(", ")
              : "Nenhum selecionado"
          }
        />
      </dl>
    </section>
  );
}

function formatarBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function ResumoCard({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-surface-600 bg-paper p-4">
      <dt className="font-sans text-xs text-text-muted-400">{titulo}</dt>
      <dd className="mt-1 font-sans text-sm font-semibold text-ink capitalize">
        {valor}
      </dd>
    </div>
  );
}
