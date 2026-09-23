"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, StepHeading } from "@/shared/components/ui";
import type { ContaDados } from "../types/auth";
import { validateEmail, validateName, validatePassword } from "../utils/validation";
import { AuthIcon } from "./auth-icon";
import { SocialAuth } from "./social-auth";

type AccountStepProps = {
  defaultValues: ContaDados;
  onAdvance: (data: ContaDados) => void;
};

export function AccountStep({ defaultValues, onAdvance }: AccountStepProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContaDados>({
    defaultValues,
    mode: "onBlur",
  });

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Comece sua jornada"
        subtitle="Crie sua conta no Travel Hub para começar a comparar os seus destinos."
      />

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={handleSubmit(onAdvance)}
      >
        <Input
          label="Nome completo"
          placeholder="Como deseja ser chamado?"
          error={errors.nome?.message}
          {...register("nome", { validate: validateName })}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email", { validate: validateEmail })}
        />
        <Input
          label="Senha"
          type={senhaVisivel ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          error={errors.senha?.message}
          endAdornment={
            <button
              type="button"
              onClick={() => setSenhaVisivel((visivel) => !visivel)}
              className="cursor-pointer text-text-muted-400 transition-colors hover:text-ink"
              aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            >
              <AuthIcon
                name={senhaVisivel ? "eyeOff" : "eye"}
                className="h-4 w-4"
              />
            </button>
          }
          {...register("senha", { validate: validatePassword })}
        />

        <div className="mt-4 flex flex-col gap-8">
          <Button variant="primary" type="submit" className="gap-2">
            Próximo passo
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>

          <SocialAuth />
        </div>
      </form>
    </section>
  );
}
