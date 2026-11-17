import { CalendarDays, Info, Map as MapIcon, MapPin, Thermometer } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, Card, Eyebrow } from "@/shared/components/ui";
import { NIVEL_CUSTO } from "../constants/rotulos";
import type { Destino } from "../types/destino";
import type { ClimaDoDia, LiveConditions } from "../types/live-conditions";
import {
  diasAte,
  faixaDeClima,
  formatarBRL,
  formatarDiaMes,
  mesPorExtenso,
  nivelDeCusto,
  periodoDosMeses,
} from "../utils/formatadores";

/** Até onde a Open-Meteo prevê (16 dias contando hoje). */
const HORIZONTE_DA_PREVISAO_DIAS = 15;

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  /** Linha extra, mais discreta (ex.: o tempo de agora). */
  note?: string;
  badge?: string;
};

function StatCard({ icon, label, value, detail, note, badge }: StatCardProps) {
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
      {note ? (
        <span className="font-sans text-xs text-text-muted-500">{note}</span>
      ) : null}
    </Card>
  );
}

const ICONE = "h-3.5 w-3.5 shrink-0";

function avisoDeClima(
  destino: Destino,
  dataPrevista: string,
  previsaoDaViagem: ClimaDoDia | null,
): string {
  if (previsaoDaViagem) {
    return `Previsão da Open-Meteo para ${formatarDiaMes(previsaoDaViagem.data)} em ${destino.cidade}. Ela fica mais precisa conforme a data se aproxima.`;
  }

  const dias = diasAte(dataPrevista);
  const mes = mesPorExtenso(dataPrevista);

  if (dias === null || !mes) {
    return `Mostramos a média histórica de ${destino.cidade}. Defina a data da viagem para ver a época que você escolheu.`;
  }

  if (dias >= 0 && dias <= HORIZONTE_DA_PREVISAO_DIAS) {
    return `A previsão para a data da viagem não está disponível agora. Usamos a média histórica de ${mes} em ${destino.cidade}.`;
  }

  return `Não há previsão do tempo para daqui a ${dias} dias. Usamos a média histórica de ${mes} em ${destino.cidade}: boa para planejar, não para fazer as malas.`;
}

export function DestinoStats({
  destino,
  dataPrevista,
  condicoes,
}: {
  destino: Destino;
  dataPrevista: string;
  /** Dados ao vivo; enquanto não chegam (ou se falharem), vale o catálogo. */
  condicoes?: LiveConditions;
}) {
  const { clima, melhorEpoca } = destino;
  const nivel = NIVEL_CUSTO[nivelDeCusto(destino.custoDiarioBRL)].label;

  const previsaoDaViagem =
    condicoes?.clima?.dias.find((dia) => dia.data === dataPrevista) ?? null;
  const agora = condicoes?.clima?.atual;

  return (
    <div className="flex flex-col gap-stack">
      <div className="grid gap-stack sm:grid-cols-2 lg:grid-cols-4">
        {previsaoDaViagem ? (
          <StatCard
            icon={<Thermometer className={ICONE} strokeWidth={1.5} aria-hidden />}
            label="Clima · previsão"
            value={faixaDeClima(previsaoDaViagem)}
            detail={`${previsaoDaViagem.descricao} · ${previsaoDaViagem.chuvaPct}% de chance de chuva`}
            badge="Previsão"
          />
        ) : (
          <StatCard
            icon={<Thermometer className={ICONE} strokeWidth={1.5} aria-hidden />}
            label="Clima · média histórica"
            value={faixaDeClima(clima)}
            detail={`${clima.descricao} · ${clima.diasChuvososPct}% dos dias com chuva`}
            note={
              agora ? `Agora: ${agora.temperaturaC}°C, ${agora.descricao.toLowerCase()}` : undefined
            }
            badge="Estimativa"
          />
        )}
        <StatCard
          icon={<CalendarDays className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Melhor época"
          value={melhorEpoca.estacao}
          detail={periodoDosMeses(melhorEpoca.meses)}
        />
        <StatCard
          icon={<MapIcon className={ICONE} strokeWidth={1.5} aria-hidden />}
          label="Região"
          value={destino.regiao}
          detail={destino.estado}
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
        <p>{avisoDeClima(destino, dataPrevista, previsaoDaViagem)}</p>
      </Card>
    </div>
  );
}
