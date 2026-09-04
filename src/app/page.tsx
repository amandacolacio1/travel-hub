import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6">
      <h1 className="font-serif text-4xl text-ink">Travel Hub</h1>
      <p className="max-w-md text-center text-sm text-text-muted-400">
        Decida sua próxima jornada com inteligência.
      </p>
      <Link
        href="/auth"
        className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-brand-600"
      >
        Ver componentes / Auth
      </Link>
    </div>
  );
}
