import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import { brand, getFooterNavItems } from "@/lib/site-data";
import { Logo } from "./Logo";

export function Footer() {
  const items = getFooterNavItems();
  return (
    <footer className="mt-16 border-t border-border" style={{ background: "color-mix(in oklab, var(--color-background) 92%, black)" }}>
      <div className="container-site py-12 grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="text-card-title mt-4 text-foreground">{brand.primary}</p>
          <p className="text-small gold-text mt-1" style={{ letterSpacing: "0.3em", fontWeight: 700 }}>FEAT. {brand.secondary.toUpperCase()}</p>
          <p className="text-small mt-2 text-muted-foreground" style={{ letterSpacing: "0.22em" }}>SUPPORT BY {brand.support.toUpperCase()}</p>
          <p className="text-body text-muted-foreground mt-4 max-w-md">{brand.tagline}</p>
        </div>

        <div>
          <p className="text-eyebrow mb-3">NAVIGACIJA</p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-body text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-eyebrow mb-3">KONTAKT</p>
          <ul className="space-y-3 text-body text-muted-foreground">
            <li className="flex items-center gap-2"><Mail size={14} className="gold-text" /> {brand.email}</li>
            <li className="flex items-center gap-2"><Phone size={14} className="gold-text" /> {brand.phone}</li>
            <li><a href={brand.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><Instagram size={14} className="gold-text" /> Instagram</a></li>
          </ul>
          <div className="mt-5 flex gap-4 text-small text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Cookie Policy</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-small text-muted-foreground">
          <p>© {new Date().getFullYear()} {brand.primary}. All rights reserved.</p>
          <p>Powered by <span className="gold-text">{brand.support}</span></p>
        </div>
      </div>
    </footer>
  );
}