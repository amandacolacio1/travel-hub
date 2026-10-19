import Image from "next/image";

type LogoProps = {
  /**
   * `light` é a logo clara, para fundos escuros (sidebar).
   * `dark` é a logo escura, para fundos claros (headers).
   */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Dimensões reais de cada arquivo @2x. As duas variantes têm larguras
 * diferentes, então a proporção é declarada por arquivo — um valor único
 * distorceria uma delas. Exibidas por volta de 28px de altura, o dobro de
 * pixels mantém a logo nítida em telas retina.
 */
const ARQUIVOS = {
  light: { src: "/brand/travel-hub-logo-light@2x.png", width: 421, height: 64 },
  dark: { src: "/brand/travel-hub-logo-dark@2x.png", width: 401, height: 64 },
} as const;

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const { src, width, height } = ARQUIVOS[variant];

  return (
    <Image
      src={src}
      alt="Travel Hub"
      width={width}
      height={height}
      priority
      // Sem classes de tamanho próprias: quem usa define altura/largura. Um
      // `w-auto` fixo aqui venceria o `w-[...]` do header por ordem no CSS.
      className={className}
    />
  );
}
