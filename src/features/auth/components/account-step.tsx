"use client";

import { useState } from "react";
import { Button, Input, StepHeading } from "@/shared/components/ui";
import {
  isAccountStepValid,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";
import { AuthIcon } from "./auth-icon";
import { SocialAuth } from "./social-auth";

type AccountStepProps = {
  nome: string;
  email: string;
  senha: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onAdvance: () => void;
};

export function AccountStep({
  nome,
  email,
  senha,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onAdvance,
}: AccountStepProps) {
  const [nomeTocado, setNomeTocado] = useState(false);
  const [emailTocado, setEmailTocado] = useState(false);
  const [senhaTocado, setSenhaTocado] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const erroNome = nomeTocado || tentouEnviar ? validateName(nome) : undefined;
  const erroEmail =
    emailTocado || tentouEnviar ? validateEmail(email) : undefined;
  const erroSenha =
    senhaTocado || tentouEnviar ? validatePassword(senha) : undefined;
  const canAdvance = isAccountStepValid(nome, email, senha);

  function handleAdvance() {
    setTentouEnviar(true);

    if (canAdvance) {
      onAdvance();
    }
  }

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Comece sua jornada"
        subtitle="Crie sua conta no Travel Hub para começar a comparar os seus destinos."
      />

      <div className="mt-8 flex flex-col gap-4">
        <Input
          label="Nome completo"
          placeholder="Como deseja ser chamado?"
          value={nome}
          onChange={(event) => onNameChange(event.target.value)}
          onBlur={() => setNomeTocado(true)}
          error={erroNome}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={() => setEmailTocado(true)}
          error={erroEmail}
        />
        <Input
          label="Senha"
          type={senhaVisivel ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          value={senha}
          onChange={(event) => onPasswordChange(event.target.value)}
          onBlur={() => setSenhaTocado(true)}
          error={erroSenha}
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
        />
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <Button
          variant="primary"
          onClick={handleAdvance}
          disabled={!canAdvance}
          className="gap-2"
        >
          Próximo passo
          <AuthIcon name="arrow" className="h-4 w-4" />
        </Button>

        <SocialAuth />
      </div>
    </section>
  );
}
