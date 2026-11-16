"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type AlterarSenhaFormData,
  alterarSenhaSchema,
} from "@/features/auth/schemas/senha.schema";
import { Button, Input } from "@/shared/components/ui";
import { useAlterarSenhaMutation } from "../api/alterar-senha";
import { SecaoCard } from "./secao-card";

const VAZIO: AlterarSenhaFormData = {
  senhaAtual: "",
  novaSenha: "",
  confirmacao: "",
};

/** Troca de senha: ação própria, separada do "Salvar alterações" do perfil. */
export function SegurancaCard() {
  const alterarSenha = useAlterarSenhaMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AlterarSenhaFormData>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: VAZIO,
    mode: "onTouched",
  });

  function atualizar(dados: AlterarSenhaFormData) {
    alterarSenha.mutate(dados, { onSuccess: () => reset(VAZIO) });
  }

  return (
    <SecaoCard icon={ShieldCheck} title="Segurança">
      <form
        className="flex flex-col gap-stack"
        onSubmit={handleSubmit(atualizar)}
        noValidate
      >
        <div className="grid gap-stack sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
            <Input
              label="Senha atual"
              type="password"
              autoComplete="current-password"
              error={errors.senhaAtual?.message}
              {...register("senhaAtual")}
            />
          </div>
          <Input
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            error={errors.novaSenha?.message}
            {...register("novaSenha")}
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmacao?.message}
            {...register("confirmacao")}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-stack">
          <p
            role="status"
            className={`mr-auto font-sans text-xs ${
              alterarSenha.isError ? "text-error-500" : "text-success-700"
            }`}
          >
            {alterarSenha.isError ? alterarSenha.error.message : null}
            {alterarSenha.isSuccess ? "Senha atualizada com sucesso." : null}
          </p>
          <Button
            type="submit"
            variant="secondary"
            fullWidth={false}
            className="border border-surface-600"
            disabled={!isValid || alterarSenha.isPending}
          >
            {alterarSenha.isPending ? "Atualizando…" : "Atualizar credenciais"}
          </Button>
        </div>
      </form>
    </SecaoCard>
  );
}
