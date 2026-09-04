import { Button } from "@/shared/components/ui";
import { AuthIcon } from "./auth-icon";

export function SocialAuth() {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-surface-600" />
        <span className="text-[10px] tracking-[0.14em] text-text-muted-400 uppercase">
          Ou acesse com
        </span>
        <span className="h-px flex-1 bg-surface-600" />
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled
        title="Em breve"
        className="gap-2"
      >
        <AuthIcon name="google" className="h-4 w-4" />
        Google
      </Button>
      <p className="mt-2 text-center text-[11px] text-text-muted-400">
        Login com Google em breve
      </p>
    </div>
  );
}
