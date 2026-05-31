import { createFileRoute } from "@tanstack/react-router";
import { CTALink } from "@/components/site/CTAButton";
import { workflowSteps } from "@/lib/site-data";
import { Calendar, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.workflowHero;

export const Route = createFileRoute("/nacin-rada")({
  head: () => ({
    meta: [
      { title: "Način rada — Ivan Jovanović" },
      { name: "description", content: "Kako funkcioniše proces bukiranja: od provere termina do potvrde rezervacije." },
    ],
  }),
  component: NacinRadaPage,
});

function NacinRadaPage() {
  return (
    <main>
      <PageHero
        eyebrow="PROCES"
        title="NAČIN"
        accent="RADA"
        intro="Proces bukiranja je jasan i transparentan. Svaki korak je definisan kako bi vaš događaj prošao bez komplikacija."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14">
        <ol className="space-y-3 relative">
          <div className="absolute left-8 top-4 bottom-4 w-px hidden md:block" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-primary) 40%, transparent), transparent)" }} />
          {workflowSteps.map((s, i) => (
            <li key={s.n} className="premium-card relative" style={{ flexDirection: "row" }}>
              <div className="text-metric-number gold-text shrink-0" style={{ width: "4rem" }}>{s.n}</div>
              <div className="flex-1">
                <h3 className="text-card-title text-foreground">{s.title}</h3>
                <p className="text-body text-muted-foreground mt-2">{s.desc}</p>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className="absolute -bottom-3 left-12 w-px h-6 hidden md:block" style={{ background: "color-mix(in oklab, var(--color-primary) 40%, transparent)" }} />
              )}
            </li>
          ))}
        </ol>

        <section className="section-glass p-7 md:p-10 mt-10">
          <p className="eyebrow gold-text">PROFESIONALAN PRISTUP</p>
          <h2 className="text-h2 mt-3">Pažnja na svaki detalj</h2>
          <p className="text-body text-muted-foreground mt-3 max-w-3xl">
            Pre svakog događaja dogovaramo satnicu, repertoar i specijalne zahteve. Cilj nam je da vaš dan teče savršeno — od dolaska gostiju do poslednje pesme.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-lg">
          <CTALink to="/dostupni-termini" variant="primary" fullWidth><Calendar size={16} /> PROVERI TERMIN</CTALink>
          <CTALink to="/upit/svadba" variant="outline" fullWidth><Send size={16} /> POŠALJI UPIT</CTALink>
        </div>
      </div>
    </main>
  );
}
