import Image from "next/image";
import { User } from "lucide-react";

type AvatarProps = {
  /** `null` quando o usuário ainda não enviou foto. */
  src?: string | null;
  /** Usado como `alt` da imagem e rótulo acessível do placeholder. */
  nome: string;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: { box: "h-9 w-9", icon: "h-4 w-4", px: 36 },
  md: { box: "h-10 w-10", icon: "h-5 w-5", px: 40 },
} as const;

/**
 * Foto do usuário. Sem foto, mostra um ícone neutro com borda tracejada — a
 * borda sinaliza "cabe uma imagem aqui" sem usar o rosto de ninguém.
 */
export function Avatar({ src, nome, size = "md", className = "" }: AvatarProps) {
  const { box, icon, px } = SIZES[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={nome}
        width={px}
        height={px}
        className={`${box} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={`Sem foto de perfil de ${nome}`}
      className={`flex ${box} shrink-0 items-center justify-center rounded-full border border-dashed border-surface-600 bg-surface-alt-500 text-text-muted-400 ${className}`}
    >
      <User className={icon} strokeWidth={1.5} aria-hidden />
    </span>
  );
}
