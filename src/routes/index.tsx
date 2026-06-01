import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Send, Play, Instagram, ChevronRight, Music2 } from "lucide-react";
import { useState } from "react";
import { CTALink } from "@/components/site/CTAButton";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { AvailabilityCalendar } from "@/components/site/AvailabilityCalendar";
import { brand, eventTypes, workflowSteps, repertoireCategories, faqGroups, heroContent } from "@/lib/site-data";
import { programIcons, metricIcons } from "@/lib/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ivan Jovanović — Live Music Experience feat. Sedative Band" },
      { name: "description", content: "Profesionalan muzički program za svadbe, korporativne proslave, klupske svirke i rođendane. Sve na jednom mestu." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <Hero />

      {/* EVENT CARDS (mobile prominent, desktop secondary depth) */}
      <SectionWrapper eyebrow="MUZIČKI PROGRAM" title="Sve na jednom mestu">
        <div className="grid md:grid-cols-2 gap-4">
          {eventTypes.map((ev) => {
            const Icon = programIcons[ev.key] ?? Music2;
            return (
              <Link key={ev.key} to={ev.formRoute} className="premium-card group">
                <div className="flex items-start gap-5">
                  <Icon className="icon-program shrink-0" strokeWidth={1.5} aria-hidden />
                  <div className="flex-1 card-content">
                    <h3 className="text-card-title gold-text">{ev.title}</h3>
                    <p className="text-body card-meta">{ev.desc}</p>
                    <div className="card-cta text-button">POŠALJI UPIT <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      {/* AVAILABILITY PREVIEW */}
      <SectionWrapper eyebrow="KALENDAR" title="Proveri dostupne termine">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start">
          <AvailabilityCalendar />
          <div className="lg:w-72 premium-panel p-6">
            <p className="text-body text-muted-foreground">
              Pre slanja upita proverite da li smo slobodni za vaš datum. Kalendar je informativan.
            </p>
            <div className="mt-5">
              <CTALink to="/dostupni-termini" variant="primary" fullWidth>
                <Calendar size={16} /> OTVORI KALENDAR
              </CTALink>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* WORKFLOW */}
      <SectionWrapper eyebrow="NAČIN RADA" title="Kako funkcioniše">
        <ol className="grid md:grid-cols-2 gap-4">
          {workflowSteps.map((s) => (
            <li key={s.n} className="premium-card flex-row gap-4" style={{ flexDirection: "row" }}>
              <div className="text-metric-number gold-text">{s.n}</div>
              <div>
                <h3 className="text-card-title text-foreground">{s.title}</h3>
                <p className="text-body text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      {/* REPERTOIRE PREVIEW */}
      <SectionWrapper eyebrow="REPERTOAR" title="Pesme i žanrovi">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {repertoireCategories.slice(0, 8).map((c) => (
            <Link to="/repertoar" key={c.key} className="premium-card premium-card-compact text-center items-center">
              <p className="text-card-title text-foreground">{c.title}</p>
              <p className="text-small card-meta mt-2 line-clamp-2">{c.desc}</p>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* INSTAGRAM PREVIEW */}
      <SectionWrapper eyebrow="MEDIA" title="Instagram / Atmosfera">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Reels", "Nastupi", "Atmosfera", "Behind the scenes"].map((label) => (
            <a key={label} href={brand.instagram} target="_blank" rel="noreferrer"
               className="premium-card aspect-square items-center justify-center text-center p-4 group relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 12%, transparent) 0%, transparent 70%)" }} />
              <div className="relative">
                <Instagram size={26} className="mx-auto gold-text" />
                <p className="text-eyebrow mt-2 text-foreground">{label}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <CTALink to="/instagram" variant="outline">POGLEDAJ INSTAGRAM</CTALink>
        </div>
      </SectionWrapper>

      {/* FAQ PREVIEW */}
      <SectionWrapper eyebrow="NAJČEŠĆA PITANJA I ODGOVORI" title="Najčešća pitanja i odgovori">
        <FaqPreview />
        <div className="mt-6">
          <CTALink to="/faq" variant="outline">NAJČEŠĆA PITANJA I ODGOVORI <ChevronRight size={14} /></CTALink>
        </div>
      </SectionWrapper>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 cta-wrap">
        <div className="cta-panel-max section-glass p-7 md:p-14 text-center">
          <p className="cta-eyebrow">Imate datum?</p>
          <h2 className="text-h2 mt-2">Prvi korak je <span className="gold-text">jednostavan</span>.</h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mt-7">
            <CTALink to="/dostupni-termini" variant="primary" fullWidth className="availability-cta"><Calendar size={16} /> PROVERI DOSTUPNE TERMINE</CTALink>
            <CTALink to="/upit/svadba" variant="outline" fullWidth><Send size={16} /> POŠALJI UPIT</CTALink>
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqPreview() {
  const [open, setOpen] = useState<number | null>(0);
  const items = faqGroups[0].items.slice(0, 5);
  return (
    <div className="space-y-2 premium-panel p-2 md:p-3">
      {items.map((item, i) => (
        <div key={i} className="p-4 md:p-5" style={i < items.length - 1 ? { borderBottom: "1px solid var(--color-border)" } : undefined}>
          <button className="w-full flex items-center justify-between gap-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
            <span className="text-body font-semibold text-foreground">{item.q}</span>
            <ChevronRight size={16} className={`transition-transform ${open === i ? "rotate-90" : ""}`} />
          </button>
          {open === i && <p className="text-body text-muted-foreground mt-3">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

function Hero() {
  const h = heroContent;
  const mobileMetrics = h.metrics;
  return (
    <section className="hero-stage relative overflow-hidden">
      {/* Layer 1: unified cinematic background */}
      <div className="hero-bg" aria-hidden />

      {/* Layer 3: Ivan transparent — frameless, masked, blends into black */}
      <img
        src={h.image.src}
        alt={h.image.alt}
        className="hero-ivan"
        loading="eager"
        fetchPriority="high"
      />

      {/* Layer 4: readability overlay between Ivan and text */}
      <div className="hero-readability" aria-hidden />

      <div
        className="hero-content container-site relative z-10 pb-10 lg:pb-16 min-h-[88vh] lg:min-h-[84vh] flex flex-col"
      >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 flex-1">
          {/* LEFT — text */}
          <div className="max-w-xl lg:pt-0">
            <p className="signature-text hero-signature">{h.signature}</p>
            <h1 className="hero-title text-foreground mt-1.5">
              {h.title.line1}<br />{h.title.line2}
            </h1>
            {/* FEAT. / SEDATIVE BAND — clear hierarchy */}
            <div className="hero-feat-block mt-3">
              <span className="hero-feat-small">{h.featLabel}</span>
              <span className="hero-feat-band gold-text">{h.bandName}</span>
            </div>

            {/* SUPPORT BY — two rows, secondary */}
            <div className="hero-support mt-4">
              <div className="hero-support-rule">{h.supportLabel}</div>
              <p className="hero-support-name mt-1.5">{h.supportName}</p>
            </div>

            {/* Slogan — two rows */}
            <div className="mt-5">
              <p className="hero-slogan">{h.slogan.line1}</p>
              <p className="hero-slogan">{h.slogan.line2}</p>
            </div>

            {/* CTAs */}
            <div className="hero-cta-grid grid sm:grid-cols-2 gap-3 mt-5">
              <CTALink to={h.ctas.primary.to} variant="primary" fullWidth className="hero-cta-primary availability-cta">
                <Calendar size={16} /> {h.ctas.primary.label}
              </CTALink>
              <CTALink to={h.ctas.secondary.to} variant="outline" fullWidth>
                <Send size={16} /> {h.ctas.secondary.label}
              </CTALink>
            </div>
            <div className="mt-2.5">
              <CTALink to={h.ctas.tertiary.to} variant="ghost" external={h.ctas.tertiary.external}>
                <Play size={14} /> {h.ctas.tertiary.label}
              </CTALink>
            </div>
          </div>

          {/* Spacer for image column */}
          <div className="hidden lg:block" />
        </div>

        {/* METRICS — all 4 metrics remain visible across breakpoints */}
        <div className="hero-metrics-panel relative z-10 mt-6 lg:mt-10">
          <div className="hero-metrics-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {h.metrics.map((m, i) => {
              const Icon = metricIcons[m.icon] ?? Music2;
              return (
                <div
                  key={i}
                  className="hero-metric-item flex flex-col items-center text-center min-w-0"
                >
                  <Icon size={28} strokeWidth={1.25} className="metric-icon-free shrink-0 lg:mt-1" />
                  <div className="min-w-0">
                    <p className="hero-metric-num">{m.value}</p>
                    <p className="hero-metric-lbl mt-1">{m.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Mobile sanity: all metrics stay present in the lightweight grid. */}
          <p className="sr-only">{mobileMetrics.length} key metrics</p>
        </div>
      </div>
    </section>
  );
}
