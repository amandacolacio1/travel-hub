"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PerfilViagem } from "@/features/auth/types/auth";
import {
  signIn,
  signOut,
  updatePerfilViagem,
  updatePreferencias,
} from "./session.service";
import type { Session, SessionPreferencias } from "./session.types";
import { SESSION_QUERY_KEY } from "./use-session";

/**
 * Login. Em vez de invalidar (que forçaria um segundo round-trip), grava a
 * sessão devolvida direto no cache — o dashboard já monta com dado pronto.
 */
export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, senha }: { email: string; senha: string }) =>
      signIn(email, senha),
    onSuccess: (session) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, session);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Limpa tudo: nenhuma query de usuário deve sobreviver ao logout.
      queryClient.clear();
    },
  });
}

/**
 * Troca o perfil de viagem com update otimista: o seletor reflete a escolha na
 * hora e volta ao valor anterior se o PATCH falhar.
 */
export function useUpdatePerfilViagemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (perfilViagem: PerfilViagem) =>
      updatePerfilViagem(perfilViagem),
    onMutate: async (perfilViagem) => {
      // Cancela buscas em voo para que não sobrescrevam o update otimista.
      await queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY });

      const anterior = queryClient.getQueryData<Session>(SESSION_QUERY_KEY);
      if (anterior) {
        queryClient.setQueryData<Session>(SESSION_QUERY_KEY, {
          ...anterior,
          perfilViagem,
        });
      }

      return { anterior };
    },
    onError: (_erro, _variaveis, context) => {
      if (context?.anterior) {
        queryClient.setQueryData(SESSION_QUERY_KEY, context.anterior);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
  });
}

/** Atualiza data prevista e orçamento a partir dos popovers do header. */
export function useUpdatePreferenciasMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<SessionPreferencias>) =>
      updatePreferencias(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY });

      const anterior = queryClient.getQueryData<Session>(SESSION_QUERY_KEY);
      if (anterior) {
        queryClient.setQueryData<Session>(SESSION_QUERY_KEY, {
          ...anterior,
          preferencias: { ...anterior.preferencias, ...patch },
        });
      }

      return { anterior };
    },
    onError: (_erro, _variaveis, context) => {
      if (context?.anterior) {
        queryClient.setQueryData(SESSION_QUERY_KEY, context.anterior);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    },
  });
}
