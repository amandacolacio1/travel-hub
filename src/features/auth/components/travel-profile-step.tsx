import { Button, StepHeading } from "@/shared/components/ui";
import { TRAVEL_PROFILES } from "../constants/travel-profiles";
import type { PerfilViagem } from "../types/auth";
import { ProfileCard } from "./profile-card";

type TravelProfileStepProps = {
  perfil: PerfilViagem;
  onSelectProfile: (perfil: PerfilViagem) => void;
  onFinish: () => void;
  onBack: () => void;
};

export function TravelProfileStep({
  perfil,
  onSelectProfile,
  onFinish,
  onBack,
}: TravelProfileStepProps) {
  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Qual é o seu perfil de viagem?"
        subtitle="A IA adapta as recomendações com base em quem acompanha você. Você pode alterar isso a qualquer momento no dashboard."
      />

      <div className="mt-8 flex flex-col gap-3">
        {TRAVEL_PROFILES.map((option) => (
          <ProfileCard
            key={option.id}
            option={option}
            selected={perfil === option.id}
            onSelect={onSelectProfile}
          />
        ))}
      </div>

      <div className="mt-8 flex gap-3 pb-8">
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="primary" onClick={onFinish}>
          Concluir
        </Button>
      </div>
    </section>
  );
}
