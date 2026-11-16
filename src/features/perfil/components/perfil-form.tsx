"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui";
import { type Session, useUpdatePerfilMutation } from "@/shared/session";
import { type PerfilFormData, perfilFormSchema } from "../schemas/perfil.schema";
import { InformacoesPessoaisCard } from "./informacoes-pessoais-card";
import { InteressesCard } from "./interesses-card";
import { SegurancaCard } from "./seguranca-card";

const FORM_ID = "perfil-form";

function valoresDaSessao({ usuario, preferencias }: Session): PerfilFormData {
  return {
    nome: usuario.nome,
    email: usuario.email,
    pais: usuario.pais,
    cidade: usuario.cidade,
    fotoUrl: usuario.fotoUrl,
    interesses: preferencias.interesses,
  };
}

/** Perfil do membro: conta, segurança e interesses; "Salvar" grava conta + interesses. */
export function PerfilForm({ session }: { session: Session }) {
  const atualizar = useUpdatePerfilMutation();
  const metodos = useForm<PerfilFormData>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: valoresDaSessao(session),
  });
  const { handleSubmit, reset, formState } = metodos;

  function salvar({ interesses, ...usuario }: PerfilFormData) {
    atualizar.mutate(
      { usuario, preferencias: { interesses } },
      { onSuccess: (nova) => reset(valoresDaSessao(nova)) },
    );
  }

  const salvo = atualizar.isSuccess && !formState.isDirty;

  return (
    <FormProvider {...metodos}>
      {/* Formulário vazio: os campos dos cards se ligam a ele pelo atributo `form`. */}
      <form id={FORM_ID} onSubmit={handleSubmit(salvar)} noValidate />

      <div className="flex flex-col gap-block">
        <InformacoesPessoaisCard formId={FORM_ID} />
        <SegurancaCard />
        <InteressesCard />

        <div className="flex flex-col gap-stack sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-inline font-sans text-xs text-text-muted-400">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
            Usamos seus dados só para personalizar as recomendações.
          </p>

          <div className="flex flex-wrap items-center gap-inline">
            <span
              role="status"
              className={`font-sans text-xs ${
                atualizar.isError ? "text-error-500" : "text-success-700"
              }`}
            >
              {atualizar.isError ? atualizar.error.message : null}
              {salvo ? "Alterações salvas." : null}
            </span>
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              className="border border-surface-600"
              disabled={!formState.isDirty || atualizar.isPending}
              onClick={() => reset(valoresDaSessao(session))}
            >
              Descartar
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              fullWidth={false}
              disabled={!formState.isDirty || atualizar.isPending}
            >
              {atualizar.isPending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
