"use client";

import { Controller, useForm } from "react-hook-form";
import { Button, StepHeading } from "@/shared/components/ui";
import { TRAVEL_PROFILES } from "../constants/travel-profiles";
import type { PerfilViagem } from "../types/auth";
import { ProfileCard } from "./profile-card";

type TravelProfileFormData = {
  perfil: PerfilViagem;
};

type TravelProfileStepProps = {
  defaultValues: TravelProfileFormData;
  onFinish: (data: TravelProfileFormData) => void;
  onBack: (data: TravelProfileFormData) => void;
};

export function TravelProfileStep({
  defaultValues,
  onFinish,
  onBack,
}: TravelProfileStepProps) {
  const { control, getValues, handleSubmit } = useForm<TravelProfileFormData>({
    defaultValues,
  });

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Qual é o seu perfil de viagem?"
        subtitle="A IA adapta as recomendações com base em quem acompanha você. Você pode alterar isso a qualquer momento no dashboard."
      />

      <form
        className="mt-8 flex flex-col gap-3"
        onSubmit={handleSubmit(onFinish)}
      >
        <Controller
          control={control}
          name="perfil"
          render={({ field }) => (
            <>
              {TRAVEL_PROFILES.map((option) => (
                <ProfileCard
                  key={option.id}
                  option={option}
                  selected={field.value === option.id}
                  onSelect={field.onChange}
                />
              ))}
            </>
          )}
        />

        <div className="mt-8 flex gap-3 pb-8">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onBack(getValues())}
          >
            Voltar
          </Button>
          <Button variant="primary" type="submit">
            Concluir
          </Button>
        </div>
      </form>
    </section>
  );
}
