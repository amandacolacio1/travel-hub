import "server-only";

/** Uma API lenta não pode segurar a página do usuário. */
const TIMEOUT_MS = 5_000;

/**
 * `fetch` para APIs externas: timeout, cache do Next por `revalidarSegundos` e
 * `null` em qualquer falha (rede, timeout, status ≠ 2xx). Quem chama decide o
 * que mostrar sem o dado — a tela nunca quebra por causa de terceiros.
 */
export async function fetchJson<T>(
  url: string,
  revalidarSegundos: number,
): Promise<T | null> {
  try {
    const resposta = await fetch(url, {
      next: { revalidate: revalidarSegundos },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!resposta.ok) return null;
    return (await resposta.json()) as T;
  } catch (erro) {
    console.warn(`[api externa] falhou: ${new URL(url).host}`, erro);
    return null;
  }
}
