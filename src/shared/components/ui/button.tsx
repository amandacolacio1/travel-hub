import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost";
export type ButtonSize = "md" | "sm";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `true` (padrão) ocupa a largura toda; use `false` em barras e cabeçalhos. */
  fullWidth?: boolean;
  className?: string;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonStyleOptions, "className">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-paper hover:bg-brand-alt-500 disabled:bg-brand-300",
  secondary: "bg-paper text-brand-500 hover:bg-brand-50 disabled:opacity-50",
  soft: "bg-surface-alt-500 text-brand-500 hover:bg-surface-alt-600/60 disabled:opacity-50",
  ghost:
    "bg-background text-text-muted-500 underline-offset-2 hover:underline disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-3.5 text-sm",
  sm: "px-3.5 py-2.5 text-xs",
};

/** Classes do botão, para reaproveitar em `<a>`/`Link` com o mesmo visual. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = true,
  className = "",
}: ButtonStyleOptions = {}): string {
  const width = fullWidth ? "w-full" : "w-auto";

  return `inline-flex ${width} cursor-pointer items-center justify-center gap-2 rounded-lg font-sans font-medium transition-colors disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      fullWidth,
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses({ variant, size, fullWidth, className })}
        {...props}
      >
        {children}
      </button>
    );
  },
);
