type StepHeadingProps = {
  title: string;
  subtitle: string;
};

export function StepHeading({ title, subtitle }: StepHeadingProps) {
  return (
    <header className="flex flex-col gap-2 text-left">
      <h1 className="text-4xl text-ink">{title}</h1>
      <p className="text-sm leading-relaxed text-text-muted-400">{subtitle}</p>
    </header>
  );
}
