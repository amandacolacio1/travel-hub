"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserCog } from "lucide-react";
import { Logo } from "@/shared/components/ui";
import { NAV_ITEMS } from "../constants/navigation";

type SidebarNavProps = {
  /** Chamado após navegar — o drawer mobile usa isso para se fechar. */
  onNavigate?: () => void;
  onSignOut: () => void;
};

/**
 * Conteúdo da navegação lateral. Fica separado da `Sidebar` porque é
 * reaproveitado dentro do drawer mobile.
 */
export function SidebarNav({ onNavigate, onSignOut }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-brand-500 px-4 py-6 text-paper">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="px-2"
        aria-label="Travel Hub — ir para o dashboard"
      >
        <Logo variant="light" className="h-auto w-40" />
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          // `startsWith` mantém o item ativo em sub-rotas (ex: /destinos/123).
          const ativo = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={ativo ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors ${
                ativo
                  ? "bg-paper font-semibold text-brand-500"
                  : "text-paper/70 hover:bg-paper/10 hover:text-paper"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-1.5 border-t border-paper/15 pt-4">
        <Link
          href="/perfil"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <UserCog className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
          Editar perfil
        </Link>

        <button
          type="button"
          onClick={onSignOut}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left font-sans text-sm text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
          Sair
        </button>
      </div>
    </div>
  );
}
