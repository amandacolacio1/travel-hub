import Image from "next/image";
import { homeBanner } from "../assets";
import { RegistrationWizard } from "./registration-wizard";

export function AuthContainer() {
  return (
    <div className="flex min-h-dvh flex-col gap-48 bg-background lg:flex-row items-center justify-center">
      <aside className="order-1 w-full shrink-0 lg:sticky lg:top-0 lg:h-dvh lg:w-[35%]">
        <div className="relative h-[32vh] min-h-44 w-full overflow-hidden lg:h-full lg:min-h-0">
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

      <div className="order-2 relative z-10 -mt-5 flex flex-1 flex-col rounded-t-3xl bg-background px-5 pb-8 pt-6 lg:mt-0 lg:rounded-none lg:px-10 lg:py-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:mx-0 lg:max-w-lg">
          <RegistrationWizard />
        </div>
      </div>
    </div>
  );
}
