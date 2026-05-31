import { ShieldCheck, CalendarDays, Instagram, Youtube, Music2, Facebook } from "lucide-react";
import { brand } from "@/lib/site-data";

const responseText = "Svakom upitu pristupamo lično i preuzimamo dalju komunikaciju do potvrde termina.";

/**
 * Premium response badge (replaces former green block).
 * Dark bronze→gold gradient, champagne border, subtle glow.
 */
export function InfoPanel({
  headline = "GARANTUJEMO ODGOVOR I PONUDU",
  subline = "U ROKU OD",
  big = "24h",
  footer = responseText,
}: {
  headline?: string; subline?: string; big?: string; footer?: string;
}) {
  return (
    <aside className="space-y-6">
      <div className="badge-premium p-7 text-center">
        <div
          className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{
            background: "linear-gradient(180deg, color-mix(in oklab, var(--color-gold-light) 25%, transparent), color-mix(in oklab, var(--color-primary) 15%, transparent))",
            border: "1px solid color-mix(in oklab, var(--color-primary) 55%, transparent)",
            color: "var(--color-gold-light)",
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <p className="text-eyebrow text-muted-foreground">{headline}</p>
        <p className="text-eyebrow gold-text mt-2">{subline}</p>
        <p
          className="text-metric-number my-2"
          style={{
            fontSize: "clamp(3.5rem, 7vw, 5rem)",
            background: "linear-gradient(180deg, var(--color-gold-light), var(--color-primary) 60%, var(--color-gold-muted))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {big}
        </p>
        <p className="text-small text-muted-foreground mt-3">{footer}</p>
        <CalendarDays className="mx-auto mt-4 gold-text" size={20} />
      </div>

      <div className="text-center">
        <p className="text-eyebrow">SUPPORT BY</p>
        <p className="text-small gold-text mt-1" style={{ letterSpacing: "0.22em", fontWeight: 600 }}>{brand.support.toUpperCase()}</p>
        <p className="text-eyebrow mt-4">PRATITE NAS</p>
        <div className="flex justify-center gap-3 mt-3">
          {[Instagram, Youtube, Music2, Facebook].map((Icon, i) => (
            <a key={i} href={brand.instagram} target="_blank" rel="noreferrer"
               className="w-10 h-10 inline-flex items-center justify-center rounded-full gold-border text-primary">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
