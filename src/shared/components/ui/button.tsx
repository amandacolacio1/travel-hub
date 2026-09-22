import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-paper hover:bg-brand-alt-500 disabled:bg-brand-300",
  secondary: "bg-paper text-brand-500 hover:bg-brand-50 disabled:opacity-50",
  ghost:
    "bg-background text-text-muted-500 underline-offset-2 hover:underline disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      variant = "primary",
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
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
