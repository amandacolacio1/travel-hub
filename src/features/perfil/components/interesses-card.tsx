"use client";

import { Heart } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { AuthIcon } from "@/features/auth/components/auth-icon";
import { INTERESTS } from "@/features/auth/constants/interests";
import { Chip } from "@/shared/components/ui";
import type { PerfilFormData } from "../schemas/perfil.schema";
import { SecaoCard } from "./secao-card";

export function InteressesCard() {
  const { control } = useFormContext<PerfilFormData>();

  return (
    <SecaoCard
      icon={Heart}
      title="Interesses"
      description="Selecione as tags que refinam as suas recomendações."
    >
      <Controller
        control={control}
        name="interesses"
        render={({ field }) => (
          <div role="group" aria-label="Interesses" className="flex flex-wrap gap-inline">
            {INTERESTS.map(({ id, titulo, icon }) => {
              const ativo = field.value.includes(id);

              return (
                <Chip
                  key={id}
                  selected={ativo}
                  icon={<AuthIcon name={icon} className="h-3.5 w-3.5" />}
                  onClick={() =>
                    field.onChange(
                      ativo
                        ? field.value.filter((item) => item !== id)
                        : [...field.value, id],
                    )
                  }
                >
                  {titulo}
                </Chip>
              );
            })}
          </div>
        )}
      />
    </SecaoCard>
  );
}
