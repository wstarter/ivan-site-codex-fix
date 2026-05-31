import type { ReactNode } from "react";

export function SectionWrapper({
  children,
  eyebrow,
  title,
  className = "",
  id,
}: {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-12 md:py-20 ${className}`}>
      <div className="container-site">
        {(eyebrow || title) && (
          <div className="mb-8 md:mb-12">
            {eyebrow && <p className="text-eyebrow mb-3">{eyebrow}</p>}
            {title && <h2 className="text-h2 text-foreground">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}