import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  /** Sem `href`, o item é só texto (o último é sempre a página atual). */
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /** `onImage` usa texto claro para ficar legível sobre fotos escuras. */
  tone?: "default" | "onImage";
  className?: string;
};

const TONES = {
  default: { text: "text-text-muted-400", current: "text-ink", hover: "hover:text-ink" },
  onImage: { text: "text-paper/75", current: "text-paper", hover: "hover:text-paper" },
} as const;

export function Breadcrumb({
  items,
  tone = "default",
  className = "",
}: BreadcrumbProps) {
  const cores = TONES[tone];

  return (
    <nav aria-label="Você está em" className={className}>
      <ol
        className={`flex flex-wrap items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.08em] uppercase ${cores.text}`}
      >
        {items.map((item, index) => {
          const atual = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !atual ? (
                <Link href={item.href} className={`transition-colors ${cores.hover}`}>
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={atual ? "page" : undefined}
                  className={atual ? `font-semibold ${cores.current}` : undefined}
                >
                  {item.label}
                </span>
              )}
              {atual ? null : (
                <ChevronRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
