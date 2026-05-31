import { createFileRoute } from "@tanstack/react-router";
import { AvailabilityCalendar } from "@/components/site/AvailabilityCalendar";
import { CTALink } from "@/components/site/CTAButton";
import { Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.calendarHero;

export const Route = createFileRoute("/dostupni-termini")({
  head: () => ({
    meta: [
      { title: "Dostupni termini — Ivan Jovanović" },
      { name: "description", content: "Proverite dostupne termine za nastupe. Kalendar je informativan." },
    ],
  }),
  component: TerminiPage,
});

function TerminiPage() {
  return (
    <main>
      <PageHero
        eyebrow="KALENDAR"
        title="DOSTUPNI"
        accent="TERMINI"
        intro="Pre slanja upita proverite da li smo slobodni za vaš datum. Kalendar je informativan — termin se potvrđuje tek nakon dogovora, avansa i ugovora."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14 grid lg:grid-cols-[1fr_320px] gap-6">
        <AvailabilityCalendar />
        <div className="premium-panel p-6">
          <p className="eyebrow gold-text">SLEDEĆI KORAK</p>
          <h2 className="text-h3 mt-2">Datum slobodan?</h2>
          <p className="text-body text-muted-foreground mt-3">Pošaljite upit sa detaljima događaja — odgovor stiže u roku od 24h.</p>
          <div className="mt-5">
            <CTALink to="/upit/svadba" variant="primary" fullWidth><Send size={16} /> POŠALJI UPIT</CTALink>
          </div>
        </div>
      </div>
    </main>
  );
}
