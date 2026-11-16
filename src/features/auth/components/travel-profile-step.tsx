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
  /** Cadastro em andamento: trava os botões para não enviar duas vezes. */
  isSubmitting?: boolean;
  errorMessage?: string;
};

export function TravelProfileStep({
  defaultValues,
  onFinish,
  onBack,
  isSubmitting = false,
  errorMessage,
}: TravelProfileStepProps) {
  const { control, getValues, handleSubmit } = useForm<TravelProfileFormData>({
    defaultValues,
  });

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Qual é o seu perfil de viagem?"
        subtitle="Ajustamos as recomendações conforme quem acompanha você. Você pode alterar isso a qualquer momento no dashboard."
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

        {errorMessage ? (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-error-50 px-3.5 py-2.5 font-sans text-xs text-error-500"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 pb-8 lg:flex-row">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onBack(getValues())}
            disabled={isSubmitting}
            className="order-2 lg:order-1"
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="order-1 lg:order-2"
          >
            {isSubmitting ? "Criando conta..." : "Concluir"}
          </Button>
        </div>
      </form>
    </section>
  );
}
