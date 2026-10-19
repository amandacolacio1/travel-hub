import { QueryClient } from "@tanstack/react-query";
import { UnauthorizedError } from "@/shared/session/session.service";

/**
 * Cria um QueryClient por execução. Em SSR não dá para compartilhar uma
 * instância entre requisições (vazaria dado de um usuário para outro), e no
 * cliente a instância é criada uma vez só dentro do provider.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Dentro desse intervalo a query é considerada fresca e não refaz a
        // busca a cada montagem de componente.
        staleTime: 30_000,
        // Não adianta repetir uma chamada que voltou 401: a sessão não vai
        // aparecer sozinha. Para os demais erros, mantém o retry padrão.
        retry: (falhas, erro) => {
          if (erro instanceof UnauthorizedError) return false;
          return falhas < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}
