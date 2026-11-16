"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, StepHeading } from "@/shared/components/ui";
import { type ContaFormData, contaSchema } from "../schemas/conta.schema";
import { SENHA_TAMANHO_MAXIMO } from "../schemas/senha.schema";
import type { ContaDados } from "../types/auth";
import { AuthIcon } from "./auth-icon";
import { PasswordStrength } from "./password-strength";
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
    watch,
    formState: { errors, isValid },
  } = useForm<ContaFormData>({
    resolver: zodResolver(contaSchema),
    defaultValues: { ...defaultValues, confirmacaoSenha: "" },
    // Valida ao sair do campo, mas revalida a cada tecla depois disso: sem
    // isso o botão só habilita quando o último campo perde o foco.
    mode: "onTouched",
  });

  const senha = watch("senha");

  function avancar({ nome, email, senha: senhaInformada }: ContaFormData) {
    onAdvance({ nome, email, senha: senhaInformada });
  }

  const alternarSenha = (
    <button
      type="button"
      onClick={() => setSenhaVisivel((visivel) => !visivel)}
      className="cursor-pointer text-text-muted-400 transition-colors hover:text-ink"
      aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
    >
      <AuthIcon name={senhaVisivel ? "eyeOff" : "eye"} className="h-4 w-4" />
    </button>
  );

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Comece sua jornada"
        subtitle="Crie sua conta no Travel Hub para começar a comparar os seus destinos."
      />

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(avancar)}>
        <Input
          label="Nome completo"
          placeholder="Como deseja ser chamado?"
          error={errors.nome?.message}
          {...register("nome")}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-2">
          <Input
            label="Senha"
            type={senhaVisivel ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            maxLength={SENHA_TAMANHO_MAXIMO}
            error={errors.senha?.message}
            endAdornment={alternarSenha}
            {...register("senha")}
          />
          <PasswordStrength senha={senha ?? ""} />
        </div>

        <Input
          label="Confirme a senha"
          type={senhaVisivel ? "text" : "password"}
          placeholder="Digite a senha novamente"
          maxLength={SENHA_TAMANHO_MAXIMO}
          error={errors.confirmacaoSenha?.message}
          {...register("confirmacaoSenha")}
        />

        <div className="mt-4 flex flex-col gap-8">
          <Button
            variant="primary"
            type="submit"
            disabled={!isValid}
            className="gap-2"
          >
            Próximo passo
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>

          <SocialAuth />
        </div>
      </form>
    </section>
  );
}
