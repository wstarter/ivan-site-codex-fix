import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Form page shell: cinematic image hero + dark premium form card + side info panel.
 * Wraps WordPress-friendly form classes (.form-shell, .form-section, .form-field).
 */
export function InquiryFormLayout({
  title,
  accent,
  intro,
  heroImage,
  children,
  side,
}: {
  /** White portion of the title, e.g. "POŠALJITE UPIT ZA" */
  title: string;
  /** Gold/champagne emphasized word, e.g. "SVADBU" */
  accent?: string;
  intro: string;
  heroImage?: string;
  children: ReactNode;
  side: ReactNode;
}) {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-border" style={{ minHeight: "40vh" }}>
        {heroImage && (
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <img src={heroImage} alt="" className="w-full h-full object-cover opacity-55" loading="eager" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(3,4,5,0.45) 0%, rgba(3,4,5,0.8) 70%, var(--color-background) 100%)" }} />
          </div>
        )}
        <div className="container-site relative z-10 pt-20 pb-10 md:pt-28 md:pb-14">
          <Link to="/" className="inline-flex items-center gap-2 text-button text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={14} /> NAZAD NA POČETNU
          </Link>
          <p className="text-eyebrow mb-4">UPIT</p>
          <h1 className="form-page-title text-h1 text-foreground">
            {title}{accent && <> <span className="gold-text">{accent}</span></>}
          </h1>
          <p className="text-body text-muted-foreground mt-5 max-w-2xl">{intro}</p>
        </div>
      </section>

      <div className="container-site py-10 md:py-14 grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <div className="panel p-5 md:p-7">{children}</div>
        </div>
        <div className="lg:pt-2">{side}</div>
      </div>
    </main>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="form-section pb-2 mb-2">
      <p className="text-eyebrow gold-text mb-2">{title}</p>
      <div className="divide-y divide-border/60">{children}</div>
    </div>
  );
}
