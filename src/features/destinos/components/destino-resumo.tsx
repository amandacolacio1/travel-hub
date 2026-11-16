import { CircleCheck, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { TRAVEL_PROFILES } from "@/features/auth/constants/travel-profiles";
import { Card, SectionHeading } from "@/shared/components/ui";
import type { Session } from "@/shared/session";
import type { Destino } from "../types/destino";
import { interessesEmComum, motivosDeCompatibilidade } from "../utils/analise";

type ColunaProps = {
  titulo: string;
  texto: string;
  itens: string[];
  icone: ReactNode;
};

function Coluna({ titulo, texto, itens, icone }: ColunaProps) {
  return (
    <div className="flex flex-col gap-stack">
      <h3 className="border-l-2 border-brand-500 pl-2.5 font-sans text-sm font-semibold text-ink">
        {titulo}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-text-muted-500">
        {texto}
      </p>
      <ul className="flex flex-col gap-inline">
        {itens.map((item) => (
          <li
            key={item}
            className="flex items-start gap-inline font-sans text-xs leading-relaxed font-medium text-ink"
          >
            {icone}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DestinoResumo({
  destino,
  session,
}: {
  destino: Destino;
  session: Session;
}) {
  const perfil = TRAVEL_PROFILES.find((item) => item.id === session.perfilViagem);
  const emComum = interessesEmComum(destino, session);
  const [orcamento] = motivosDeCompatibilidade(destino, session);

  const porQueAmar = emComum.length
    ? `${destino.descricao} Combina com o que você busca: ${emComum.join(", ").toLowerCase()}.`
    : destino.descricao;

  return (
    <section className="flex flex-col gap-stack">
      <SectionHeading
        title="Resumo do destino"
        description={
          perfil ? `Personalizado para o seu perfil de viajante: ${perfil.titulo}.` : undefined
        }
      />

      <Card padding="lg" className="grid gap-block border-brand-500 lg:grid-cols-2 lg:gap-8">
        <Coluna
          titulo="Por que você vai amar"
          texto={porQueAmar}
          itens={destino.pontosFortes}
          icone={
            <CircleCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-700"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        />
        <Coluna
          titulo="Pontos de atenção"
          texto={orcamento.descricao}
          itens={destino.pontosDeAtencao}
          icone={
            <TriangleAlert
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-700"
              strokeWidth={1.75}
              aria-hidden
            />
          }
        />
      </Card>
    </section>
  );
}
