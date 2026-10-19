"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SidebarNav } from "./sidebar-nav";

type SidebarProps = {
  /** Estado do drawer mobile — no desktop a sidebar é sempre visível. */
  mobileAberto: boolean;
  onMobileOpenChange: (aberto: boolean) => void;
  onSignOut: () => void;
};

export function Sidebar({
  mobileAberto,
  onMobileOpenChange,
  onSignOut,
}: SidebarProps) {
  return (
    <>
      {/* Desktop: trilho fixo. */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-60">
          <SidebarNav onSignOut={onSignOut} />
        </div>
      </aside>

      {/* Mobile: drawer. O Radix cuida de foco, Esc e scroll lock. */}
      <Dialog.Root open={mobileAberto} onOpenChange={onMobileOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-brand-500/40 backdrop-blur-[2px] lg:hidden" />
          <Dialog.Content
            aria-label="Menu de navegação"
            className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl outline-none lg:hidden"
          >
            <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
            <SidebarNav
              onNavigate={() => onMobileOpenChange(false)}
              onSignOut={onSignOut}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
