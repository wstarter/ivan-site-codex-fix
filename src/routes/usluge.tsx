import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Music2, Plus } from "lucide-react";
import { eventTypes } from "@/lib/site-data";
import { programIcons } from "@/lib/icons";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.uslugeHero;

export const Route = createFileRoute("/usluge")({
  head: () => ({
    meta: [
      { title: "Usluge — Ivan Jovanović" },
      { name: "description", content: "Muzički program za svadbe, korporativne proslave, klupske svirke i rođendane." },
    ],
  }),
  component: UslugePage,
});

function UslugePage() {
  return (
    <main>
      <PageHero
        eyebrow="USLUGE"
        title="SVIRKE ZA SVE"
        accent="VRSTE DOGAĐAJA"
        intro="Svaki event je jedinstven. Izaberite tip događaja i pošaljite upit — odgovor stiže u roku od 24h."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-4">
          {eventTypes.map((ev) => {
            const Icon = programIcons[ev.key] ?? Music2;
            return (
              <Link key={ev.key} to={ev.formRoute} className="premium-card group">
                <div className="flex items-start gap-5">
                  <Icon className="icon-service shrink-0" strokeWidth={1.5} aria-hidden />
                  <div className="flex-1 card-content">
                    <h3 className="text-card-title gold-text">{ev.title}</h3>
                    <p className="text-body card-meta">{ev.desc}</p>
                    <div className="card-cta text-button">POŠALJI UPIT <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                </div>
              </Link>
            );
          })}

          <Link to="/dopunski-programi" className="premium-card group md:col-span-2">
            <div className="flex items-start gap-5">
              <Plus className="icon-service shrink-0" strokeWidth={1.5} aria-hidden />
              <div className="flex-1 card-content">
                <h3 className="text-card-title gold-text">Dopunski programi</h3>
                <p className="text-body card-meta">DJ, kvartet, saksofon, muzika za skup svatova, prvi ples i specijalni show program.</p>
                <div className="card-cta text-button">SAZNAJ VIŠE <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
