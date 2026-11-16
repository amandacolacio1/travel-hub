import Link from "next/link";
import type { ComponentProps } from "react";
import { type ButtonSize, type ButtonVariant, buttonClasses } from "./button";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

/** Navegação com a aparência de `Button`. Use `Button` só para ações. */
export function ButtonLink({
  variant,
  size,
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
