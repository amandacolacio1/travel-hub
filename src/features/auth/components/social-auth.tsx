import { Button } from "@/shared/components/ui";
import { AuthIcon } from "./auth-icon";

type SocialAuthProps = {
  disabled?: boolean;
};

export function SocialAuth({ disabled = true }: SocialAuthProps) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-surface-600" />
        <span className="font-sans text-[10px] tracking-[0.14em] text-text-muted-400 uppercase">
          Ou acesse com
        </span>
        <span className="h-px flex-1 bg-surface-600" />
      </div>

      <Button type="button" variant="secondary" className="gap-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-paper">
          <AuthIcon name="google" className="h-5 w-5" />
        </span>
        Continuar com Google
      </Button>
    </div>
  );
}
