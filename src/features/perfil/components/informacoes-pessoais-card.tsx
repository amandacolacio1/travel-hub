"use client";

import { User } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DESTINATIONS } from "@/features/auth/constants/destinations";
import { Input, Select } from "@/shared/components/ui";
import type { PerfilFormData } from "../schemas/perfil.schema";
import { FotoPerfil } from "./foto-perfil";
import { SecaoCard } from "./secao-card";

const PAISES = DESTINATIONS.map(({ nome }) => ({ value: nome, label: nome }));

/**
 * Os campos pertencem ao formulário `perfil-form` (atributo `form`), que mora
 * no rodapé da tela; assim o card de Segurança, que tem formulário próprio,
 * pode ficar entre as seções sem aninhar `<form>`.
 */
export function InformacoesPessoaisCard({ formId }: { formId: string }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PerfilFormData>();

  const cidades =
    DESTINATIONS.find(({ nome }) => nome === watch("pais"))?.cidades ?? [];

  return (
    <SecaoCard icon={User} title="Informações pessoais">
      <FotoPerfil />

      <hr className="border-surface-600" />

      <div className="grid gap-stack sm:grid-cols-2">
        <Input
          label="Nome completo"
          autoComplete="name"
          form={formId}
          error={errors.nome?.message}
          {...register("nome")}
        />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          form={formId}
          error={errors.email?.message}
          {...register("email")}
        />
        <Select
          label="País"
          placeholder="Selecione"
          options={PAISES}
          form={formId}
          {...register("pais", {
            // Trocar de país invalida a cidade escolhida antes.
            onChange: () => setValue("cidade", "", { shouldDirty: true }),
          })}
        />
        <Select
          label="Cidade principal"
          placeholder="Selecione"
          options={cidades.map((cidade) => ({ value: cidade, label: cidade }))}
          disabled={cidades.length === 0}
          form={formId}
          {...register("cidade")}
        />
      </div>
    </SecaoCard>
  );
}
