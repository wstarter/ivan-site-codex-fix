import { createFileRoute } from "@tanstack/react-router";
import { repertoireIntro, repertoireSections } from "@/lib/repertoire-data";
import { workflowSteps } from "@/lib/site-data";
import { CTALink } from "@/components/site/CTAButton";
import { Calendar, Send, Music2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.repertoireHero;

export const Route = createFileRoute("/repertoar")({
  head: () => ({
    meta: [
      { title: "Repertoar i žanrovi koje sviramo — Ivan Jovanović" },
      { name: "description", content: "Repertoar, atmosfera i način rada: domaći pop, domaći hitovi, muzika 90-ih, strana i narodna muzika, kola i posebni momenti." },
    ],
  }),
  component: RepertoarPage,
});

function RepertoarPage() {
  return (
    <main>
      <PageHero
        eyebrow="REPERTOAR, ATMOSFERA I NAČIN RADA"
        title="REPERTOAR I ŽANROVI"
        accent="KOJE SVIRAMO"
        intro={[
          "Vrlo je teško popisati kompletan repertoar koji izvodimo, jer se radi o ogromnom broju pesama. Zato je važno da prvenstveno znate žanrove koje sviramo.",
          "Za pojedinačne i precizne upite vezane za konkretne pesme, najbolje je da se dogovorimo kroz lični razgovor.",
        ]}
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14">
        <section className="section-glass p-7 md:p-10">
          <p className="eyebrow gold-text">VIŠE OD LISTE PESAMA</p>
          <div className="mt-4 space-y-4 max-w-4xl">
            {repertoireIntro.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="eyebrow gold-text">ŽANROVI KOJE SVIRAMO</p>
          <h2 className="text-h2 mt-3">Program prilagođen vašoj proslavi</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {repertoireSections.map((section) => (
              <article key={section.key} className="premium-card">
                <div className="flex items-center gap-3">
                  <Music2 className="icon-program" strokeWidth={1.5} aria-hidden />
                  <h3 className="text-card-title gold-text">{section.title}</h3>
                </div>
                <div className="space-y-3 mt-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-body card-meta">{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="nacin-rada" className="mt-14 scroll-mt-24">
          <p className="eyebrow gold-text">NAČIN RADA</p>
          <h2 className="text-h2 mt-3">KAKO FUNKCIONIŠE SARADNJA</h2>
          <ol className="space-y-3 relative mt-6">
            <div className="absolute left-8 top-4 bottom-4 w-px hidden md:block" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-primary) 40%, transparent), transparent)" }} />
            {workflowSteps.map((step, index) => (
              <li key={step.n} className="premium-card relative" style={{ flexDirection: "row" }}>
                <div className="text-metric-number gold-text shrink-0" style={{ width: "4rem" }}>{step.n}</div>
                <div className="flex-1">
                  <h3 className="text-card-title text-foreground">{step.title}</h3>
                  <p className="text-body text-muted-foreground mt-2">{step.desc}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -bottom-3 left-12 w-px h-6 hidden md:block" style={{ background: "color-mix(in oklab, var(--color-primary) 40%, transparent)" }} />
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="section-glass p-7 md:p-10 mt-10">
          <p className="eyebrow gold-text">PROFESIONALAN PRISTUP</p>
          <h2 className="text-h2 mt-3">PROFESIONALAN PRISTUP OD REPERTOARA DO REALIZACIJE</h2>
          <p className="text-body text-muted-foreground mt-3 max-w-4xl">
            Pre svakog događaja dogovaramo repertoar, atmosferu, protokol i satnicu. Planiramo energiju večeri, pauze, DJ momente, kvartet i dodatni program tako da realizacija deluje prirodno, precizno i usklađeno sa vašim željama.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6 max-w-lg">
            <CTALink to="/dostupni-termini" variant="primary" fullWidth className="availability-cta"><Calendar size={16} /> PROVERI DOSTUPNE TERMINE</CTALink>
            <CTALink to="/upit/svadba" variant="outline" fullWidth><Send size={16} /> POŠALJI UPIT</CTALink>
          </div>
        </section>
      </div>
    </main>
  );
}
