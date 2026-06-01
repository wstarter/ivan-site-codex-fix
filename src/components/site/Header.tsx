import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Calendar } from "lucide-react";
import { Logo } from "./Logo";
import { CTALink } from "./CTAButton";
import { MobileMenu } from "./MobileMenu";
import { getNavItems } from "@/lib/site-data";

export function Header() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const items = getNavItems();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--color-background) 85%, transparent)" }}>
      <div className="container-site flex items-center justify-between py-4 border-b border-border/60">
        <Logo />

        <nav className="hidden lg:flex items-center gap-7">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="desktop-nav-link text-nav transition-colors"
              activeProps={{ className: "desktop-nav-link-active" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CTALink to="/dostupni-termini" variant="outline" className="hidden sm:inline-flex">
            <Calendar size={16} />
            DOSTUPNI TERMINI
          </CTALink>
          <button
            aria-label="Otvori meni"
            onClick={() => setOpen(true)}
            className="lg:hidden btn-base btn-ghost gold-border"
            style={{ minHeight: 44, padding: "0 0.85rem" }}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
