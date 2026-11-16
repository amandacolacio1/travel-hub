"use client";

import { useMutation } from "@tanstack/react-query";
import type { AlterarSenhaFormData } from "@/features/auth/schemas/senha.schema";

async function alterarSenha(dados: AlterarSenhaFormData): Promise<void> {
  const resposta = await fetch("/api/auth/senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(dados),
  });

  if (resposta.ok) return;

  const corpo = await resposta.json().catch(() => null);
  throw new Error(
    typeof corpo?.message === "string"
      ? corpo.message
      : "Não foi possível atualizar a senha.",
  );
}

export function useAlterarSenhaMutation() {
  return useMutation({ mutationFn: alterarSenha });
}
