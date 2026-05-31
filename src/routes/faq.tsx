import { createFileRoute } from "@tanstack/react-router";
import { faqGroups } from "@/lib/site-data";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.faqHero;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Najčešća pitanja — Ivan Jovanović" },
      { name: "description", content: "Najčešća pitanja i odgovori: rezervacija, plaćanje, organizacija događaja, repertoar, ozvučenje, sastav benda." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [openKey, setOpenKey] = useState<string | null>("rezervacija-0");

  return (
    <main>
      <PageHero
        eyebrow="NAJČEŠĆA PITANJA I ODGOVORI"
        title="NAJČEŠĆA PITANJA I"
        accent="ODGOVORI"
        intro="Odgovori na ključna pitanja klijenata o procesu bukiranja, organizaciji i tehničkim uslovima."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14 space-y-12">
        {faqGroups.map((group) => (
          <section key={group.id} aria-labelledby={`faq-${group.id}`}>
            <h2 id={`faq-${group.id}`} className="text-h2 text-foreground">
              <span className="gold-text">/</span> {group.title}
            </h2>

            <div className="mt-5 premium-panel p-2 md:p-3">
              {group.items.map((item, i) => {
                const key = `${group.id}-${i}`;
                const isOpen = openKey === key;
                const isLast = i === group.items.length - 1;
                return (
                  <div key={key} className="p-4 md:p-5" style={!isLast ? { borderBottom: "1px solid var(--color-border)" } : undefined}>
                    <button
                      className="w-full flex items-center justify-between gap-4 text-left"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-body font-semibold text-foreground">{item.q}</h3>
                      <ChevronDown size={18} className={`transition-transform shrink-0 gold-text ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <p className="text-body text-muted-foreground mt-4">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
