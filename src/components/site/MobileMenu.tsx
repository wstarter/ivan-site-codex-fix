import { Link, useRouterState } from "@tanstack/react-router";
import { X, Calendar, Send, Instagram, Youtube, Music2, Facebook, Home, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./Logo";
import { CTALink } from "./CTAButton";
import { getNavItems, brand } from "@/lib/site-data";
import { menuIcons } from "@/lib/icons";
import { unlockBodyInteraction } from "@/lib/interaction-safety";

const subtitle: Record<string, string> = {
  "/": "Muzički program za Vaš event",
  "/usluge": "Svirke za sve vrste događaja",
  "/nacin-rada": "Kako funkcioniše Vaš event",
  "/repertoar": "Pesme i žanrovi",
  "/instagram": "Nastupi, atmosfera, publika",
  "/dopunski-programi": "DJ, kvartet, saksofon i više",
  "/kontakt": "Pošaljite upit i rezervišite",
};

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = getNavItems();
  const { location } = useRouterState();
  const onCloseRef = useRef(onClose);
  const openRef = useRef(open);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    return () => {
      unlockBodyInteraction();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) {
      unlockBodyInteraction();
      return;
    }

    document.body.classList.add("mobile-menu-open");
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      unlockBodyInteraction();
    };
  }, [open]);

  useEffect(() => {
    if (openRef.current) {
      onCloseRef.current();
    }
    unlockBodyInteraction();
  }, [location.pathname]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 lg:hidden isolate"
      style={{ zIndex: 9999, pointerEvents: open ? "auto" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="Glavni meni"
    >
      {/* Solid backdrop — fully blocks underlying content */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 9999,
          background: "rgba(2,2,2,0.86)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        className="relative h-full overflow-y-auto overscroll-contain"
        style={{ zIndex: 10000, pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 max-w-md mx-auto pt-6 pb-10">
          {/* Header row — free-standing IJ + close */}
          <div className="flex items-center justify-between mb-6">
            <Logo size={36} />
            <button
              onClick={onClose}
              aria-label="Zatvori meni"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full icon-gold"
              style={{
                zIndex: 10001, position: "relative",
                border: "1px solid var(--color-border-gold)",
                background: "rgba(8,8,8,0.55)",
                backdropFilter: "blur(10px)",
              }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Premium glass menu panel */}
          <div className="glass-panel rounded-2xl p-3">
            <ul className="flex flex-col">
              {items.map((item, i) => {
                const Icon = menuIcons[item.icon] ?? Home;
                const isLast = i === items.length - 1;
                return (
                  <li key={item.to} style={!isLast ? { borderBottom: "1px solid rgba(217,154,58,0.14)" } : undefined}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex items-center gap-4 px-3 py-4 transition-colors group"
                      style={{ pointerEvents: "auto" }}
                      activeProps={{ className: "menu-item-active" }}
                      activeOptions={{ exact: item.to === "/" }}
                    >
                      <span className="w-10 h-10 inline-flex items-center justify-center rounded-xl menu-icon-line"
                            style={{ border: "1px solid var(--color-border-gold)", background: "rgba(0,0,0,0.35)" }}>
                        <Icon size={18} strokeWidth={1.25} />
                      </span>
                      <span className="flex-1">
                        <span className="text-card-title text-foreground block leading-none">{item.label}</span>
                        {subtitle[item.to] && (
                          <span className="text-small text-muted-foreground mt-1 block">{subtitle[item.to]}</span>
                        )}
                      </span>
                      <ChevronRight size={16} className="icon-gold opacity-60 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-3 mt-6">
            <CTALink to="/dostupni-termini" variant="primary" fullWidth onClick={onClose}>
              <Calendar size={16} /> PROVERI TERMINE
            </CTALink>
            <CTALink to="/upit/svadba" variant="outline" fullWidth onClick={onClose}>
              <Send size={16} /> POŠALJI UPIT
            </CTALink>
          </div>

          <div className="mt-8 text-center">
            <p className="eyebrow mb-3">PRATITE NAS</p>
            <div className="flex justify-center gap-3">
              {[Instagram, Youtube, Music2, Facebook].map((Icon, i) => (
                <a key={i} href={brand.instagram} target="_blank" rel="noreferrer"
                   className="w-11 h-11 inline-flex items-center justify-center rounded-full icon-gold"
                   style={{ border: "1px solid var(--color-border-gold)", background: "rgba(8,8,8,0.5)" }}>
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 text-center" style={{ borderTop: "1px solid var(--color-border-gold)" }}>
            <p className="text-eyebrow">SUPPORT BY</p>
            <p className="text-small mt-1.5" style={{ letterSpacing: "0.22em" }}>{brand.support.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
