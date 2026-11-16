"use client";

import { useEffect, useState } from "react";
import { traduzirFeedbackDeSenha } from "../utils/traduzir-feedback-senha";

type PasswordStrengthProps = {
  senha: string;
};

type Avaliacao = {
  pontuacao: 0 | 1 | 2 | 3 | 4;
  sugestao: string | null;
};

const ROTULOS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"] as const;

const CORES = [
  "bg-error-500",
  "bg-error-400",
  "bg-brand-300",
  "bg-brand-400",
  "bg-brand-500",
] as const;

/**
 * Feedback de força em tempo real. O zxcvbn pesa ~400KB, então entra por
 * import dinâmico e só nesta tela — o bundle do login não paga por isso.
 */
export function PasswordStrength({ senha }: PasswordStrengthProps) {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    if (!senha) return;

    let ativo = true;

    import("zxcvbn").then(({ default: zxcvbn }) => {
      if (!ativo) return;

      const resultado = zxcvbn(senha);
      const original =
        resultado.feedback.warning || resultado.feedback.suggestions[0] || "";

      setAvaliacao({
        pontuacao: resultado.score,
        sugestao: original ? traduzirFeedbackDeSenha(original) : null,
      });
    });

    return () => {
      ativo = false;
    };
  }, [senha]);

  if (!senha || !avaliacao) return null;

  const { pontuacao, sugestao } = avaliacao;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div
          className="flex h-1 flex-1 gap-1"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={pontuacao}
          aria-label={`Força da senha: ${ROTULOS[pontuacao]}`}
        >
          {[0, 1, 2, 3, 4].map((indice) => (
            <span
              key={indice}
              className={`h-full flex-1 rounded-full transition-colors ${
                indice <= pontuacao ? CORES[pontuacao] : "bg-surface-600"
              }`}
            />
          ))}
        </div>
        <span className="font-sans text-xs text-text-muted-400">
          {ROTULOS[pontuacao]}
        </span>
      </div>

      {sugestao ? (
        <p className="font-sans text-xs text-text-muted-400">{sugestao}</p>
      ) : null}
    </div>
  );
}
