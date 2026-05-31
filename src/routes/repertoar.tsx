import { createFileRoute } from "@tanstack/react-router";
import { repertoireCategories } from "@/lib/site-data";
import { CTALink } from "@/components/site/CTAButton";
import { Send, Music2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.repertoireHero;

export const Route = createFileRoute("/repertoar")({
  head: () => ({
    meta: [
      { title: "Repertoar — Ivan Jovanović" },
      { name: "description", content: "Žanrovi i pesme: domaće, strano, 90-te, narodno, kola, club, prvi ples." },
    ],
  }),
  component: RepertoarPage,
});

function RepertoarPage() {
  return (
    <main>
      <PageHero
        eyebrow="REPERTOAR"
        title="PESME I"
        accent="ŽANROVI"
        intro="Repertoar pokriva sve generacije i atmosfere — od svadbenih klasika do energičnog night seta."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repertoireCategories.map((c) => (
            <article key={c.key} className="premium-card">
              <div className="flex items-center gap-3">
                <Music2 className="icon-program" strokeWidth={1.5} aria-hidden />
                <h3 className="text-card-title gold-text">{c.title}</h3>
              </div>
              <p className="text-body card-meta mt-4">{c.desc}</p>
              <p className="text-small text-muted-foreground/70 mt-3 italic">Lista pesama biće dodata nakon dostavljanja repertoara.</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <CTALink to="/upit/svadba" variant="primary"><Send size={16} /> POŠALJI UPIT</CTALink>
        </div>
      </div>
    </main>
  );
}
