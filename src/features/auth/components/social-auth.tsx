import { Button } from "@/shared/components/ui";
import { AuthIcon } from "./auth-icon";

type SocialAuthProps = {
  variant?: "cadastro" | "login";
};

const COPY = {
  cadastro: { question: "Já tem uma conta?", action: "Entrar" },
  login: { question: "Ainda não tem uma conta?", action: "Cadastre-se" },
} as const;

export function SocialAuth({ variant = "cadastro" }: SocialAuthProps) {
  const copy = COPY[variant];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-surface-600" />
        <span className="font-sans text-[10px] tracking-[0.14em] text-text-muted-400 uppercase">
          Ou acesse com
        </span>
        <span className="h-px flex-1 bg-surface-600" />
      </div>

      <Button type="button" variant="secondary" className="gap-2">
        <AuthIcon name="google" className="h-5 w-5" />
        Google
      </Button>

      <p className="text-center font-sans text-sm text-text-muted-400">
        {copy.question}{" "}
        <span className="cursor-pointer font-medium text-ink underline-offset-2 hover:underline">
          {copy.action}
        </span>
      </p>
    </div>
  );
}
