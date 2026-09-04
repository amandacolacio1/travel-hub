import { AuthHero } from "@/features/auth/components/auth-hero";
import { ComponentsShowcase } from "@/features/auth/components/components-showcase";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <main className="order-2 flex-1 overflow-y-auto px-5 py-8 lg:order-1 lg:w-[60%] lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
          <ComponentsShowcase />
        </div>
      </main>

      <aside className="order-1 w-full shrink-0 lg:order-2 lg:h-dvh lg:w-[40%] lg:sticky lg:top-0">
        <AuthHero sizes="(max-width: 1023px) 100vw, 40vw" />
      </aside>
    </div>
  );
}
