import { createFileRoute } from "@tanstack/react-router";
import { Check, Calendar, Instagram, Home } from "lucide-react";
import { useEffect } from "react";
import { CTALink } from "@/components/site/CTAButton";
import { trackLeadEventPlaceholder } from "@/lib/lead";
import { brand } from "@/lib/site-data";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.thankYouHero;

export const Route = createFileRoute("/hvala")({
  head: () => ({
    meta: [
      { title: "Hvala — Upit poslat | Ivan Jovanović" },
      { name: "description", content: "Vaš upit je uspešno poslat. Odgovor stiže u roku od 24h." },
    ],
  }),
  component: HvalaPage,
});

function HvalaPage() {
  useEffect(() => { trackLeadEventPlaceholder(); }, []);

  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10">
        <img src={hero.src} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, var(--color-background), color-mix(in oklab, var(--color-background) 85%, black))" }} />
      </div>

      <div className="container-site py-16 md:py-28">
        <div className="section-glass p-8 md:p-16 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full gold-border flex items-center justify-center gold-text">
            <Check size={28} />
          </div>
          <h1 className="text-h1 mt-6">Upit je uspešno <span className="gold-text">poslat</span></h1>

          <p className="text-card-title mt-6 gold-text">{brand.secondary.toUpperCase()}</p>
          <p className="text-signature mt-2 text-muted-foreground">live music experience</p>

          <div className="my-8 h-px mx-auto max-w-xs" style={{ background: "color-mix(in oklab, var(--color-primary) 40%, transparent)" }} />

          <p className="text-body text-foreground">Hvala Vam na poverenju. Vaš upit je primljen i odgovor stiže u roku od 24h.</p>

          <div className="mt-6 badge-premium p-5 text-left">
            <p className="eyebrow gold-text">VAŽNO</p>
            <p className="text-body text-muted-foreground mt-2">
              Slanje upita ne znači automatsku rezervaciju termina. Termin se potvrđuje tek nakon dogovora, avansa i ugovora.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <CTALink to="/" variant="outline" fullWidth><Home size={14} /> POČETNA</CTALink>
            <CTALink to="/instagram" variant="outline" fullWidth><Instagram size={14} /> INSTAGRAM</CTALink>
            <CTALink to="/dostupni-termini" variant="primary" fullWidth><Calendar size={14} /> TERMINI</CTALink>
          </div>
        </div>
      </div>
    </main>
  );
}
