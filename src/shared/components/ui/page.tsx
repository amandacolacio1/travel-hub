import type { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  /** `narrow` para telas de formulário, que não ganham nada com largura total. */
  width?: "default" | "narrow";
};

const WIDTHS = { default: "max-w-7xl", narrow: "max-w-4xl" } as const;

/**
 * Corpo de toda página autenticada. O padding externo vem do shell; aqui só
 * definimos a largura máxima e o espaço entre seções (32px).
 */
export function Page({ children, width = "default" }: PageProps) {
  return (
    <div
      className={`mx-auto flex w-full flex-col gap-section ${WIDTHS[width]}`}
    >
      {children}
    </div>
  );
}
