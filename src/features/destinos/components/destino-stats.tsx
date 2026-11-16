import { CalendarDays, Coins, Info, MapPin, Thermometer } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, Card, Eyebrow } from "@/shared/components/ui";
import { NIVEL_CUSTO } from "../constants/rotulos";
import type { Destino } from "../types/destino";
import {
  descreverCotacao,
  diasAte,
  faixaDeClima,
  formatarBRL,
  mesPorExtenso,
  nivelDeCusto,
  periodoDosMeses,
} from "../utils/formatadores";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  badge?: string;
};

function StatCard({ icon, label, value, detail, badge }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-inline">
      <div className="flex items-start justify-between gap-inline">
        <Eyebrow className="flex items-center gap-1.5 text-[10px]">
          {icon}
          {label}
        </Eyebrow>
        {badge ? <Badge tone="info">{badge}</Badge> : null}
      </div>
      <span className="font-serif text-2xl text-ink">{value}</span>
      <span className="font-sans text-xs text-text-muted-400">{detail}</span>
    </Card>
  );
}

const ICONE = "h-3.5 w-3.5 shrink-0";

function avisoDeClima(
  destino: Destino,
  dataPrevista: string,
): string {
  const dias = diasAte(dataPrevista);
  const mes = mesPorExtenso(dataPrevista);

  if (dias === null || !mes) {
    return `Mostramos a média histórica de ${destino.cidade}. Defina a data da viagem para ver a época que você escolheu.`;
  }

  return `Não há previsão do tempo para daqui a ${dias} dias. Usamos a média histórica de ${mes} em ${destino.cidade}: boa para planejar, não para fazer as malas.`;
}

export function DestinoStats({
  destino,
  dataPrevista,
}: {
  destino: Destino;
  dataPrevista: string;
}) {
  const { clima, melhorEpoca, moeda } = destino;
  const nivel = NIVEL_CUSTO[nivelDeCusto(destino.custoDiarioBRL)].label;

  return (
    <div className="flex flex-col gap-stack">
      <div className="grid gap-stack sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Thermometer className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Clima · média histórica"
          value={faixaDeClima(clima)}
          detail={`${clima.descricao} · ${clima.diasChuvososPct}% dos dias com chuva`}
          badge="Estimativa"
        />
        <StatCard
          icon={<CalendarDays className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Melhor época"
          value={melhorEpoca.estacao}
          detail={periodoDosMeses(melhorEpoca.meses)}
        />
        <StatCard
          icon={<Coins className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Moeda"
          value={moeda.codigo}
          detail={descreverCotacao(moeda)}
        />
        <StatCard
          icon={<MapPin className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Custo diário"
          value={formatarBRL(destino.custoDiarioBRL)}
          detail={`Nível ${nivel.toLowerCase()}`}
        />
      </div>

      <Card
        tone="muted"
        padding="none"
        className="flex items-start gap-inline px-stack py-3 font-sans text-xs leading-relaxed text-text-muted-500"
      >
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        <p>{avisoDeClima(destino, dataPrevista)}</p>
      </Card>
    </div>
  );
}
