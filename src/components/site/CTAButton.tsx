import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

interface BaseProps {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

function classes(v: Variant, full?: boolean, extra?: string) {
  const base = "btn-base";
  const variant = v === "primary" ? "btn-primary" : v === "outline" ? "btn-outline" : "btn-ghost";
  return `${base} ${variant} ${full ? "w-full" : ""} ${extra ?? ""}`.trim();
}

export function CTAButton(
  props: BaseProps & Omit<ComponentProps<"button">, "className" | "children">,
) {
  const { variant = "primary", fullWidth, children, className, ...rest } = props;
  return (
    <button className={classes(variant, fullWidth, className)} {...rest}>
      {children}
    </button>
  );
}

interface CTALinkProps extends BaseProps {
  to: string;
  external?: boolean;
  onClick?: () => void;
}

export function CTALink({ variant = "primary", fullWidth, children, className, to, external, onClick }: CTALinkProps) {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={classes(variant, fullWidth, className)} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={classes(variant, fullWidth, className)} onClick={onClick}>
      {children}
    </Link>
  );
}