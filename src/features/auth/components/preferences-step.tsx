"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Button,
  CurrencyInput,
  Select,
  StepHeading,
} from "@/shared/components/ui";
import { DESTINATIONS } from "../constants/destinations";
import { INTERESTS } from "../constants/interests";
import type { PreferencesFormData } from "../store/use-registration-store";
import { AuthIcon } from "./auth-icon";
import { InterestCard } from "./interest-card";

type PreferencesStepProps = {
  defaultValues: PreferencesFormData;
  onAdvance: (data: PreferencesFormData) => void;
  onBack: (data: PreferencesFormData) => void;
};

export function PreferencesStep({
  defaultValues,
  onAdvance,
  onBack,
}: PreferencesStepProps) {
  const { control, register, setValue, getValues, handleSubmit } =
    useForm<PreferencesFormData>({ defaultValues });

  const pais = useWatch({ control, name: "pais" });
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

      <form
        className="mt-8 flex flex-col gap-8"
        onSubmit={handleSubmit(onAdvance)}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-ink">Interesses</h2>
          <Controller
            control={control}
            name="interesses"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2.5">
                {INTERESTS.map((option) => (
                  <InterestCard
                    key={option.id}
                    option={option}
                    selected={field.value.includes(option.id)}
                    onToggle={(id) =>
                      field.onChange(
                        field.value.includes(id)
                          ? field.value.filter((item) => item !== id)
                          : [...field.value, id],
                      )
                    }
                  />
                ))}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            label="País"
            placeholder="País"
            options={DESTINATIONS.map((item) => ({
              value: item.nome,
              label: item.nome,
            }))}
            {...register("pais", {
              onChange: () => setValue("cidade", ""),
            })}
          />
          <Select
            label="Cidade"
            placeholder="Cidade"
            options={cidades}
            {...register("cidade")}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            control={control}
            name="orcamentoInicial"
            render={({ field }) => (
              <CurrencyInput
                id={field.name}
                label="Orçamento inicial"
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
              />
            )}
          />
          <Controller
            control={control}
            name="orcamentoFinal"
            render={({ field }) => (
              <CurrencyInput
                id={field.name}
                label="Orçamento final"
                value={field.value}
                onChange={field.onChange}
                placeholder="0"
              />
            )}
          />
        </div>

        <div className="mt-4 flex gap-3 pb-8">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onBack(getValues())}
          >
            Voltar
          </Button>
          <Button variant="primary" type="submit" className="gap-2">
            Próximo passo
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
