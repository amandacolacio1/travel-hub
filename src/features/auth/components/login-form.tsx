"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, StepHeading } from "@/shared/components/ui";
import { validateEmail, validatePassword } from "../utils/validation";
import { AuthIcon } from "./auth-icon";
import { SocialAuth } from "./social-auth";

type LoginFormData = {
  email: string;
  senha: string;
};

export function LoginForm() {
  const router = useRouter();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", senha: "" },
    mode: "onBlur",
  });

  function handleLogin() {
    router.push("/dashboard");
  }

  return (
    <section className="flex w-full flex-col">
      <StepHeading
        title="Acesse sua conta"
        subtitle="Continue sua jornada personalizada."
      />

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email", { validate: validateEmail })}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Senha"
            type={senhaVisivel ? "text" : "password"}
            placeholder="Sua senha"
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
          <span className="self-end text-xs font-medium text-text-muted-400 hover:text-ink">
            Esqueceu sua senha?
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-8">
          <Button variant="primary" type="submit" className="gap-2">
            Entrar
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>

          <SocialAuth variant="login" />
        </div>
      </form>
    </section>
  );
}
