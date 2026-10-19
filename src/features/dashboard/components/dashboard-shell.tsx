"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useSession, useSignOutMutation } from "@/shared/session";
import { DashboardHeader } from "./dashboard-header";
import { Sidebar } from "./sidebar";

/**
 * Casca das rotas autenticadas: sidebar, header e guarda de sessão. A sessão
 * vem do `useQuery(['session'])`, então o guard reage sozinho a logout em
 * outra aba ou a uma sessão expirada.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const { session, isPending, naoAutenticado } = useSession();
  const signOutMutation = useSignOutMutation();

  useEffect(() => {
    if (naoAutenticado) router.replace("/login");
  }, [naoAutenticado, router]);

  async function handleSignOut() {
    await signOutMutation.mutateAsync();
    router.replace("/login");
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="font-sans text-sm text-text-muted-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        mobileAberto={menuAberto}
        onMobileOpenChange={setMenuAberto}
        onSignOut={handleSignOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          session={session}
          onOpenMenu={() => setMenuAberto(true)}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
