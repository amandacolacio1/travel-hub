"use client";

import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import {
  Button,
  CurrencyInput,
  Input,
  SearchableSelect,
  StepHeading,
} from "@/shared/components/ui";
import { DESTINATIONS, MAX_DESTINATIONS } from "../constants/destinations";
import { INTERESTS } from "../constants/interests";
import type { PreferencesFormData } from "../store/use-registration-store";
import { getTodayISO, validateFutureDate } from "../utils/date";
import { AuthIcon } from "./auth-icon";
import { InterestCard } from "./interest-card";

type PreferencesStepProps = {
  defaultValues: PreferencesFormData;
  onAdvance: (data: PreferencesFormData) => void;
  onBack: (data: PreferencesFormData) => void;
};

function DestinationRow({
  index,
  pais,
  onPaisChange,
  onRemove,
  canRemove,
  control,
}: {
  index: number;
  pais: string;
  onPaisChange: () => void;
  onRemove: () => void;
  canRemove: boolean;
  control: Control<PreferencesFormData>;
}) {
  const cidades =
    DESTINATIONS.find((item) => item.nome === pais)?.cidades.map((item) => ({
      value: item,
      label: item,
    })) ?? [];

  return (
    <div className="flex w-full items-start gap-2">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name={`destinos.${index}.pais`}
          render={({ field }) => (
            <SearchableSelect
              label="País"
              placeholder="País"
              searchPlaceholder="Pesquisar país"
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onPaisChange();
              }}
              options={DESTINATIONS.map((item) => ({
                value: item.nome,
                label: item.nome,
              }))}
            />
          )}
        />
        <Controller
          control={control}
          name={`destinos.${index}.cidade`}
          render={({ field }) => (
            <SearchableSelect
              label="Cidade"
              placeholder="Cidade"
              searchPlaceholder="Pesquisar cidade"
              value={field.value}
              onChange={field.onChange}
              options={cidades}
              disabled={!pais}
            />
          )}
        />
      </div>

      {canRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover destino"
          className="mt-7 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-muted-400 transition-colors hover:text-error-500"
        >
          <AuthIcon name="close" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function PreferencesStep({
  defaultValues,
  onAdvance,
  onBack,
}: PreferencesStepProps) {
  const { control, setValue, getValues, handleSubmit } =
    useForm<PreferencesFormData>({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinos",
  });

  const destinos = useWatch({ control, name: "destinos" });

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Personalize sua jornada"
        subtitle="A IA usa seus interesses para recomendar os destinos ideais."
      />

      <form
        className="mt-8 flex flex-col gap-8"
        onSubmit={handleSubmit(onAdvance)}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-ink">O que você quer viver?</h2>
          <Controller
            control={control}
            name="interesses"
            render={({ field }) => (
              <div className="grid grid-cols-2 items-stretch gap-2.5">
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

        <div className="flex flex-col gap-3">
          <h2 className="text-xl text-ink">
            Destinos desejados (até {MAX_DESTINATIONS})
          </h2>

          {fields.map((field, index) => (
            <DestinationRow
              key={field.id}
              index={index}
              pais={destinos?.[index]?.pais ?? ""}
              onPaisChange={() => setValue(`destinos.${index}.cidade`, "")}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              control={control}
            />
          ))}

          {fields.length < MAX_DESTINATIONS ? (
            <button
              type="button"
              onClick={() => append({ pais: "Brasil", cidade: "" })}
              className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-brand-500 hover:underline"
            >
              + Adicionar destino
            </button>
          ) : null}
        </div>

        <Controller
          control={control}
          name="dataPrevista"
          rules={{ validate: validateFutureDate }}
          render={({ field, fieldState }) => (
            <Input
              type="date"
              label="Data prevista"
              min={getTodayISO()}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="mt-4 flex flex-col gap-3 pb-8 lg:flex-row">
          <Button
            variant="secondary"
            type="button"
            onClick={() => onBack(getValues())}
            className="order-2 lg:order-1"
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="order-1 gap-2 lg:order-2"
          >
            Próximo passo
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
