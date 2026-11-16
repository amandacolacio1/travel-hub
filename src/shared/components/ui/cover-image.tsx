import { type LucideIcon, MapPin } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type CoverImageProps = {
  /** Sem `src`, mostra um fundo neutro com ícone — a tela nunca fica com buraco. */
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Define a proporção/altura da área (ex.: "aspect-[4/3]" ou "h-80"). */
  className?: string;
  fallbackIcon?: LucideIcon;
  /** Camadas por cima da foto: gradiente, badges, textos. */
  children?: ReactNode;
};

export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  fallbackIcon: FallbackIcon = MapPin,
  children,
}: CoverImageProps) {
  return (
    <div className={`relative overflow-hidden bg-brand-alt-500 ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-alt-300 to-brand-alt-500 text-paper/35"
        >
          <FallbackIcon className="h-10 w-10" strokeWidth={1.25} />
        </div>
      )}
      {children}
    </div>
  );
}
