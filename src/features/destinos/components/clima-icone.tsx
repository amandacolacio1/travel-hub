import {
  CloudRain,
  CloudSun,
  type LucideIcon,
  Snowflake,
  Sun,
} from "lucide-react";
import type { ClimaTipo } from "../types/destino";

const ICONES: Record<ClimaTipo, LucideIcon> = {
  sol: Sun,
  parcial: CloudSun,
  frio: Snowflake,
  chuva: CloudRain,
};

export function ClimaIcone({
  tipo,
  className = "h-4 w-4",
}: {
  tipo: ClimaTipo;
  className?: string;
}) {
  const Icone = ICONES[tipo];
  return <Icone className={className} strokeWidth={1.5} aria-hidden />;
}
