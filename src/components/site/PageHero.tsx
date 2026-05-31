import type { ReactNode } from "react";

/**
 * Reusable cinematic dark hero for inner pages.
 * Maps to a WordPress "page hero" block.
 *
 * Title pattern: white words + final gold accent ("REPERTOAR ŽANROVI").
 * Provide `title` (white) and `accent` (gold) separately.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  children,
  height = "44vh",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string;
  image: string;
  children?: ReactNode;
  height?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border" style={{ minHeight: height }}>
      <div className="absolute inset-0 -z-10">
        <img src={image} alt="" className="w-full h-full object-cover opacity-55" loading="eager" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,4,5,0.45) 0%, rgba(3,4,5,0.75) 60%, var(--color-background) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, var(--color-background) 0%, rgba(3,4,5,0.55) 50%, rgba(3,4,5,0) 90%)" }} />
      </div>
      <div className="container-site pt-24 pb-12 md:pt-32 md:pb-16">
        {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-h1 text-foreground">
          {title}
          {accent && <> <span className="gold-text">{accent}</span></>}
        </h1>
        {intro && <p className="text-body text-muted-foreground mt-5 max-w-2xl">{intro}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
