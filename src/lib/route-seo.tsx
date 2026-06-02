import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const brand = "Ivan Jovanović feat. Sedative";
const homeDescription =
  "Profesionalan muzički program za svadbe, korporativne proslave, klupske svirke i rođendane. Sve na jednom mestu.";

type RouteSeo = {
  title: string;
  description: string;
};

export const routeSeo = {
  "/": {
    title: brand,
    description: homeDescription,
  },
  "/usluge": {
    title: `Usluge | ${brand}`,
    description: "Muzički program za svadbe, korporativne proslave, klupske svirke i rođendane.",
  },
  "/repertoar": {
    title: `Repertoar i način rada | ${brand}`,
    description:
      "Repertoar, atmosfera i način rada: domaći pop, domaći hitovi, muzika 90-ih, strana i narodna muzika, kola i posebni momenti.",
  },
  "/instagram": {
    title: `Instagram | ${brand}`,
    description: "Pogledajte nastupe, atmosferu i reakcije publike na Instagram profilu.",
  },
  "/dopunski-programi": {
    title: `Dopunski programi | ${brand}`,
    description: "DJ, kvartet, saksofon, prvi ples i dodatni show program za vaš event.",
  },
  "/dostupni-termini": {
    title: `Dostupni termini | ${brand}`,
    description: "Proverite dostupne termine za nastupe. Kalendar je informativan.",
  },
  "/faq": {
    title: `Najčešća pitanja i odgovori | ${brand}`,
    description:
      "Najčešća pitanja i odgovori o rezervaciji, organizaciji događaja, repertoaru, ozvučenju i sastavu benda.",
  },
  "/kontakt": {
    title: `Kontakt | ${brand}`,
    description: "Email, telefon i Instagram. Pošaljite upit i rezervišite termin.",
  },
  "/upit/svadba": {
    title: `Upit za svadbu | ${brand}`,
    description: "Pošaljite upit za muzički program za vašu svadbu.",
  },
  "/upit/korporativna-proslava": {
    title: `Upit za korporativnu proslavu | ${brand}`,
    description: "Pošaljite upit za muzički program za korporativni event.",
  },
  "/upit/klupska-svirka": {
    title: `Upit za klupsku svirku | ${brand}`,
    description: "Pošaljite upit za klupsku ili gastro bar svirku.",
  },
  "/upit/rodjendan-jubilej": {
    title: `Upit za rođendan / jubilej | ${brand}`,
    description: "Pošaljite upit za rođendan, jubilej ili godišnjicu.",
  },
  "/hvala": {
    title: `Hvala | ${brand}`,
    description: "Vaš upit je uspešno poslat. Odgovor stiže u roku od 24h.",
  },
} as const satisfies Record<string, RouteSeo>;

function normalizePath(pathname: string) {
  if (pathname === "/nacin-rada") return "/repertoar";
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function upsertHeadElement(selector: string, create: () => HTMLElement) {
  const matches = Array.from(document.head.querySelectorAll<HTMLElement>(selector));
  const element = matches.shift() ?? create();
  matches.forEach((duplicate) => duplicate.remove());
  return element;
}

function setNamedMeta(name: string, content: string) {
  const meta = upsertHeadElement(`meta[name="${name}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
    return element;
  });
  meta.setAttribute("content", content);
}

function setPropertyMeta(property: string, content: string) {
  const meta = upsertHeadElement(`meta[property="${property}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
    return element;
  });
  meta.setAttribute("content", content);
}

function setCanonical(href: string) {
  const link = upsertHeadElement('link[rel="canonical"]', () => {
    const element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
    return element;
  });
  link.setAttribute("href", href);
}

export function RouteSeoSync() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const normalizedPath = normalizePath(pathname);
    const seo = routeSeo[normalizedPath as keyof typeof routeSeo] ?? routeSeo["/"];
    const canonicalUrl = new URL(normalizedPath, window.location.origin).href;

    document.title = seo.title;
    setNamedMeta("description", seo.description);
    setCanonical(canonicalUrl);
    setPropertyMeta("og:title", seo.title);
    setPropertyMeta("og:description", seo.description);
    setPropertyMeta("og:url", canonicalUrl);
  }, [pathname]);

  return null;
}
