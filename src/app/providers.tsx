"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createQueryClient } from "@/shared/query/query-client";

export function Providers({ children }: { children: ReactNode }) {
  // `useState` com inicializador preguiçoso garante uma única instância por
  // montagem — criar o client no corpo do componente o recriaria a cada render.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
