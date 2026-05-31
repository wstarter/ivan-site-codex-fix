import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";

const KEY = "ij_cookie_consent_v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 panel gold-border p-4 md:flex items-center gap-4 max-w-3xl md:left-1/2 md:-translate-x-1/2">
      <p className="text-body text-muted-foreground flex-1">
        Koristimo kolačiće radi boljeg iskustva. Nastavkom korišćenja sajta prihvatate našu Cookie politiku.
      </p>
      <div className="mt-3 md:mt-0 flex gap-2">
        <CTAButton variant="outline" onClick={() => { localStorage.setItem(KEY, "declined"); setShow(false); }}>ODBIJ</CTAButton>
        <CTAButton variant="primary" onClick={() => { localStorage.setItem(KEY, "accepted"); setShow(false); }}>PRIHVATI</CTAButton>
      </div>
    </div>
  );
}