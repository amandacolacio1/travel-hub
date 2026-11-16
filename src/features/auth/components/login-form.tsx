"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, StepHeading } from "@/shared/components/ui";
import { useSignInMutation } from "@/shared/session/use-session-mutations";
import {
  type LoginFormData,
  loginSchema,
} from "../schemas/login.schema";
import { AuthIcon } from "./auth-icon";
import { SocialAuth } from "./social-auth";

export function LoginForm() {
  const router = useRouter();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroDeAcesso, setErroDeAcesso] = useState<string | null>(null);
  const signInMutation = useSignInMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
    mode: "onTouched",
  });

  async function handleLogin({ email, senha }: LoginFormData) {
    setErroDeAcesso(null);

    try {
      await signInMutation.mutateAsync({ email, senha });
      router.push("/dashboard");
    } catch (erro) {
      setErroDeAcesso(
        erro instanceof Error ? erro.message : "E-mail ou senha inválidos",
      );
    }
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
          {...register("email")}
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
            {...register("senha")}
          />
          <span className="self-end text-xs font-medium text-text-muted-400 hover:text-ink">
            Esqueceu sua senha?
          </span>
        </div>

        {erroDeAcesso ? (
          <p
            role="alert"
            className="rounded-lg bg-error-50 px-3.5 py-2.5 font-sans text-xs text-error-500"
          >
            {erroDeAcesso}
          </p>
        ) : null}

        {process.env.NODE_ENV === "development" ? (
          <p className="rounded-lg bg-surface-alt-500 px-3.5 py-2.5 font-sans text-xs text-text-muted-400">
            Acesso de teste: <strong>amanda@travelhub.com</strong> / 12345678
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-8">
          <Button
            variant="primary"
            type="submit"
            disabled={signInMutation.isPending}
            className="gap-2"
          >
            {signInMutation.isPending ? "Entrando..." : "Entrar"}
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>

          <SocialAuth variant="login" />
        </div>
      </form>
    </section>
  );
}
