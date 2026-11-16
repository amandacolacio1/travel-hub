import { Suspense } from "react";
import { StateMessage } from "@/shared/components/ui";
import { ExplorarView } from "@/features/explorar/components/explorar-view";

export default function ExplorarPage() {
  // `useSearchParams` na view exige Suspense para não desligar a renderização estática.
  return (
    <Suspense
      fallback={<StateMessage variant="loading" title="Buscando experiências…" />}
    >
      <ExplorarView />
    </Suspense>
  );
}
