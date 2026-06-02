import { createFileRoute } from "@tanstack/react-router";
import { faqItems } from "@/lib/site-data";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FaqAnswer } from "@/components/site/FaqAnswer";
import { PageHero } from "@/components/site/PageHero";
import { getPageHeroImage } from "@/lib/page-hero-assets";
const heroImage = getPageHeroImage("/faq");

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Najčešća pitanja — Ivan Jovanović" },
      { name: "description", content: "Najčešća pitanja i odgovori o rezervaciji, organizaciji događaja, repertoaru, ozvučenju i sastavu benda." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [openKey, setOpenKey] = useState<string | null>("faq-0");

  return (
    <main>
      <PageHero
        eyebrow="NAJČEŠĆA PITANJA I ODGOVORI"
        title="NAJČEŠĆA PITANJA I"
        accent="ODGOVORI"
        intro="Odgovori na ključna pitanja klijenata o procesu bukiranja, organizaciji i tehničkim uslovima."
        image={heroImage}
      />

      <div className="container-site py-10 md:py-14">
        <section aria-label="Najčešća pitanja i odgovori">
          <div className="premium-panel p-2 md:p-3">
            {faqItems.map((item, i) => {
              const key = `faq-${i}`;
              const isOpen = openKey === key;
              const isLast = i === faqItems.length - 1;
              return (
                <div key={key} className="p-4 md:p-5" style={!isLast ? { borderBottom: "1px solid var(--color-border)" } : undefined}>
                  <button
                    className="w-full flex items-center justify-between gap-4 text-left"
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-body font-semibold text-foreground">{item.question}</h2>
                    <ChevronDown size={18} className={`transition-transform shrink-0 gold-text ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <FaqAnswer blocks={item.answer} className="mt-4" />}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
