import Image from "next/image";
import type { ReactNode } from "react";
import { homeBanner } from "../assets";

type AuthContainerProps = {
  children: ReactNode;
};

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="flex h-dvh min-h-dvh flex-col gap-12 bg-background lg:flex-row lg:items-start lg:justify-center lg:gap-0">
      <aside className="order-1 h-[32vh] w-full shrink-0 self-start lg:sticky lg:top-0 lg:h-dvh lg:w-[35%]">
        <div className="relative h-full min-h-44 w-full overflow-hidden lg:min-h-0">
          <Image
            src={homeBanner}
            alt="Vista costeira ao entardecer"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1023px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-500/80 via-brand-500/35 to-brand-500/20" />

          <div className="absolute inset-0 hidden flex-col justify-end p-8 lg:flex xl:p-10">
            <h2 className="font-serif text-3xl leading-tight text-paper xl:text-4xl">
              Decida sua próxima jornada com inteligência
            </h2>
            <p className="mt-4 max-w-lg text-md leading-relaxed text-paper/85">
              Nossa IA compara destinos, custos e experiências para você viajar
              com mais clareza e menos risco.
            </p>
          </div>
        </div>
      </aside>

      <div className="order-2 relative z-10 -mt-5 flex min-h-0 flex-1 flex-col rounded-t-3xl bg-background px-5 pb-8 pt-6 lg:mt-0 lg:h-dvh lg:rounded-none lg:px-10 lg:py-10">
        <div
          data-auth-scroll
          className="scrollbar-hidden mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col justify-center-safe overflow-y-auto lg:mx-auto lg:max-w-lg"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
