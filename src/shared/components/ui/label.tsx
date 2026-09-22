import { type LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", children, ...props }: LabelProps) {
  return (
    <label
      className={`mb-1.5 block font-sans text-[11px] font-medium tracking-[0.08em] text-text-muted-500 uppercase ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
