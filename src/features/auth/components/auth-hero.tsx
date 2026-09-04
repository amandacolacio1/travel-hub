import Image from "next/image";
import { homeBanner } from "../assets";

type AuthHeroProps = {
  sizes?: string;
};

export function AuthHero({
  sizes = "(max-width: 1023px) 100vw, 30vw",
}: AuthHeroProps) {
  return (
    <div className="relative h-[32vh] min-h-44 w-full overflow-hidden lg:h-full lg:min-h-0">
      <Image
        src={homeBanner}
        alt="Vista costeira ao entardecer"
        fill
        priority
        className="object-cover object-center"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-500/80 via-brand-500/35 to-brand-500/20" />

      <div className="absolute inset-0 hidden flex-col justify-end p-8 lg:flex xl:p-10">
        <h2 className="font-serif text-3xl leading-tight text-paper xl:text-4xl">
          Decida sua próxima jornada com inteligência
        </h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/85">
          Nossa IA compara destinos, custos e experiências para você viajar com
          mais clareza e menos risco.
        </p>
        <p className="mt-10 border-t border-paper/30 pt-4 text-[10px] tracking-[0.18em] text-paper/80 uppercase">
          Decision Intelligence Hub
        </p>
      </div>
    </div>
  );
}
