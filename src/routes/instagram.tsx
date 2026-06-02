import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Play } from "lucide-react";
import { brand } from "@/lib/site-data";
import { CTALink } from "@/components/site/CTAButton";
import { PageHero } from "@/components/site/PageHero";
import { getPageHeroAsset } from "@/lib/page-hero-assets";
const hero = getPageHeroAsset("/instagram");

export const Route = createFileRoute("/instagram")({
  head: () => ({
    meta: [
      { title: "Instagram — Ivan Jovanović" },
      { name: "description", content: "Pogledajte nastupe, atmosferu i reakcije publike na Instagram profilu." },
    ],
  }),
  component: InstagramPage,
});

const cards = ["Reels", "Nastupi", "Atmosfera", "Publika", "Behind the scenes", "Klijenti"];

function InstagramPage() {
  return (
    <main>
      <PageHero
        eyebrow="MEDIA"
        title="INSTAGRAM —"
        accent="NASTUPI & ATMOSFERA"
        intro="Pratimo svaki event. Sve novo objavljujemo na Instagramu — najlakši način da osetite naš zvuk i energiju."
        image={hero.src}
      >
        <CTALink to={brand.instagram} external variant="primary"><Instagram size={16} /> OTVORI INSTAGRAM</CTALink>
      </PageHero>

      <div className="container-site py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {cards.map((label, i) => (
            <a
              key={label}
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="panel aspect-square flex items-center justify-center text-center p-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${i % 2 ? "70% 30%" : "30% 70%"}, color-mix(in oklab, var(--color-primary) 14%, transparent) 0%, transparent 70%)` }} />
              <div className="relative">
                <div className="w-12 h-12 mx-auto rounded-full gold-border flex items-center justify-center gold-text mb-3 group-hover:scale-110 transition-transform">
                  <Play size={18} />
                </div>
                <p className="text-card-title text-foreground">{label}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 panel gold-border p-7 text-center">
          <p className="text-signature gold-text">live from the stage</p>
          <p className="text-body text-muted-foreground mt-3">Aktivni snimci i fotografije sa svakog događaja — pravo iskustvo bez priče.</p>
          <div className="mt-5 inline-block">
            <CTALink to={brand.instagram} external variant="outline"><Instagram size={16} /> @PLACEHOLDER</CTALink>
          </div>
        </div>
      </div>
    </main>
  );
}
