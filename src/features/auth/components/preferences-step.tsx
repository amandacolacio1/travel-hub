import {
  Button,
  CurrencyInput,
  Select,
  StepHeading,
} from "@/shared/components/ui";
import { DESTINATIONS } from "../constants/destinations";
import { INTERESTS } from "../constants/interests";
import { AuthIcon } from "./auth-icon";
import { InterestCard } from "./interest-card";

type PreferencesStepProps = {
  interesses: string[];
  onToggleInterest: (id: string) => void;
  pais: string;
  onCountryChange: (value: string) => void;
  cidade: string;
  onCityChange: (value: string) => void;
  orcamentoInicial: number;
  onInitialBudgetChange: (value: number) => void;
  orcamentoFinal: number;
  onFinalBudgetChange: (value: number) => void;
  onAdvance: () => void;
  onBack: () => void;
};

export function PreferencesStep({
  interesses,
  onToggleInterest,
  pais,
  onCountryChange,
  cidade,
  onCityChange,
  orcamentoInicial,
  onInitialBudgetChange,
  orcamentoFinal,
  onFinalBudgetChange,
  onAdvance,
  onBack,
}: PreferencesStepProps) {
  const cidades =
    DESTINATIONS.find((item) => item.nome === pais)?.cidades.map((item) => ({
      value: item,
      label: item,
    })) ?? [];

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Personalize sua jornada"
        subtitle="O Travel Hub compara destinos, custos e experiências para você viajar com mais clareza e menos risco."
      />

      <div className="mt-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-ink">Interesses</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {INTERESTS.map((option) => (
              <InterestCard
                key={option.id}
                option={option}
                selected={interesses.includes(option.id)}
                onToggle={onToggleInterest}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            label="País"
            placeholder="País"
            value={pais}
            onChange={(event) => onCountryChange(event.target.value)}
            options={DESTINATIONS.map((item) => ({
              value: item.nome,
              label: item.nome,
            }))}
          />
          <Select
            label="Cidade"
            placeholder="Cidade"
            value={cidade}
            onChange={(event) => onCityChange(event.target.value)}
            options={cidades}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CurrencyInput
            label="Orçamento inicial"
            value={orcamentoInicial}
            onChange={onInitialBudgetChange}
            placeholder="0"
          />
          <CurrencyInput
            label="Orçamento final"
            value={orcamentoFinal}
            onChange={onFinalBudgetChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3 pb-8">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary" onClick={onAdvance} className="gap-2">
          Próximo passo
          <AuthIcon name="arrow" className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
