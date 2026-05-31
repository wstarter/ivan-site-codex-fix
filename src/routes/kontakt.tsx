import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Instagram, Calendar, Send } from "lucide-react";
import { brand } from "@/lib/site-data";
import { CTALink } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { visualAssets } from "@/lib/assets";
const hero = visualAssets.contactHero;

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Ivan Jovanović" },
      { name: "description", content: "Email, telefon i Instagram. Pošaljite upit i rezervišite termin." },
    ],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <main>
      <PageHero
        eyebrow="KONTAKT"
        title="POŠALJITE UPIT I"
        accent="REZERVIŠITE TERMIN"
        intro="Najbrži način do ponude je preko upita za tip vašeg događaja. Ako vam je lakše — pišite ili pozovite direktno."
        image={hero.src}
      />

      <div className="container-site py-10 md:py-14">
        <div className="grid md:grid-cols-3 gap-4">
          <a href={`mailto:${brand.email}`} className="premium-card">
            <Mail className="gold-text" size={22} />
            <p className="text-eyebrow mt-4">EMAIL</p>
            <p className="text-body font-semibold mt-1 text-foreground break-all">{brand.email}</p>
          </a>
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="premium-card">
            <Phone className="gold-text" size={22} />
            <p className="text-eyebrow mt-4">TELEFON</p>
            <p className="text-body font-semibold mt-1 text-foreground">{brand.phone}</p>
          </a>
          <a href={brand.instagram} target="_blank" rel="noreferrer" className="premium-card">
            <Instagram className="gold-text" size={22} />
            <p className="text-eyebrow mt-4">INSTAGRAM</p>
            <p className="text-body font-semibold mt-1 text-foreground">@PLACEHOLDER</p>
          </a>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-10 max-w-lg">
          <CTALink to="/dostupni-termini" variant="primary" fullWidth><Calendar size={16} /> PROVERI TERMINE</CTALink>
          <CTALink to="/upit/svadba" variant="outline" fullWidth><Send size={16} /> POŠALJI UPIT</CTALink>
        </div>
      </div>
    </main>
  );
}
