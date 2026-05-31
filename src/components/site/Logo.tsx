import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/site-data";

/** Free-standing IJ mark — no box, no fill. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link to="/" className="inline-flex items-center" aria-label={brand.primary}>
      <span
        className="display gold-text"
        style={{
          fontSize: size * 0.95,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontWeight: 400,
          textShadow: "0 2px 18px color-mix(in oklab, var(--color-primary) 35%, transparent)",
        }}
      >
        {brand.monogram}
      </span>
    </Link>
  );
}
