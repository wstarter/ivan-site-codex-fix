import { createFileRoute } from "@tanstack/react-router";
import { additionalPrograms } from "@/lib/site-data";
import { CTALink } from "@/components/site/CTAButton";
import { Music2, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { getPageHeroImage } from "@/lib/page-hero-assets";
const heroImage = getPageHeroImage("/dopunski-programi");

export const Route = createFileRoute("/dopunski-programi")({
  head: () => ({
    meta: [
      { title: "Dopunski programi — Ivan Jovanović" },
      { name: "description", content: "DJ, kvartet, saksofon, prvi ples i dodatni show program za vaš event." },
    ],
  }),
  component: DopunskiPage,
});

function DopunskiPage() {
  return (
    <main>
      <PageHero
        eyebrow="DODATNI MUZIČKI & SHOW PROGRAM"
        title="DOPUNSKI"
        accent="PROGRAMI"
        intro="Sve na jednom mestu — kvartet za skup svatova, DJ za after-party, saksofon kao gost-solo i još mnogo toga."
        image={heroImage}
      />

      <div className="container-site py-10 md:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {additionalPrograms.map((p) => (
            <article key={p.title} className="premium-card">
              <Music2 className="icon-program mb-4" strokeWidth={1.5} aria-hidden />
              <h3 className="text-card-title gold-text">{p.title}</h3>
              <p className="text-body card-meta mt-2">{p.desc}</p>
              <div className="card-cta">
                <CTALink to="/upit/svadba" variant="outline"><Send size={14} /> POŠALJI UPIT</CTALink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
