// Centralized site content. Maps cleanly to WordPress pages / blocks / shortcodes.

import { visualAssets } from "@/lib/assets";
import { getWpContact, getWpMenu, type WpMenuItem } from "@/lib/wp-bridge";

export const brand = {
  primary: "Ivan Jovanović",
  secondary: "Sedative Band",
  support: "Prime Music Production",
  tagline: "Profesionalnost. Energija. Emocija. Muzika koja povezuje.",
  monogram: "IJ",
  email: "booking@ivansedativeband.com", // PLACEHOLDER
  phone: "+381 XX XXX XXXX", // PLACEHOLDER
  instagram: "https://instagram.com/PLACEHOLDER", // PLACEHOLDER
};

// WordPress contact override (Appearance → Ivan Settings). Local dev keeps the
// placeholders above. WP values win when present and non-empty.
{
  const wp = getWpContact();
  if (wp) {
    if (wp.email && wp.email.length > 0) brand.email = wp.email;
    if (wp.phone && wp.phone.length > 0) brand.phone = wp.phone;
    if (wp.instagram && wp.instagram.length > 0) brand.instagram = wp.instagram;
  }
}

/**
 * HERO CONTENT — single source of truth for the homepage hero.
 * Edit text/image/CTAs/metrics here; mirrors WordPress ACF group "hero".
 */
export const heroContent = {
  signature: "Live Music Experience",
  title: { line1: "IVAN", line2: "JOVANOVIĆ" },
  feat: "FEAT. SEDATIVE BAND",
  featLabel: "FEAT.",
  bandName: "SEDATIVE BAND",
  supportLabel: "SUPPORT BY",
  supportName: "PRIME MUSIC PRODUCTION",
  slogan: { line1: "Profesionalnost. Energija. Emocija.", line2: "Muzika koja povezuje." },
  image: { src: visualAssets.heroIvan.src, alt: visualAssets.heroIvan.alt },
  ctas: {
    primary:   { label: "PROVERI DOSTUPNE TERMINE",     to: "/dostupni-termini" },
    secondary: { label: "POŠALJI UPIT",                 to: "/usluge" },
    tertiary:  { label: "POGLEDAJ VIDEO KAKO RADIMO",   to: "https://www.instagram.com/p/DP3oHrNiHSD/", external: true },
  },
  metrics: [
    { icon: "music",      value: "15+",     label: "GODINA ISKUSTVA",              mobile: true },
    { icon: "mic",        value: "3.000+",  label: "USPEŠNO REALIZOVANIH DOGAĐAJA", mobile: true },
    { icon: "users",      value: "100k+",   label: "ZADOVOLJNIH GOSTIJU",           mobile: true },
    { icon: "heart",      value: "MUZIKA",  label: "KOJA POVEZUJE",                 mobile: false },
  ] as const,
};

export const navItems = [
  { label: "POČETNA",            to: "/",                  icon: "home" },
  { label: "USLUGE",             to: "/usluge",            icon: "sparkles" },
  { label: "NAČIN RADA",         to: "/nacin-rada",        icon: "workflow" },
  { label: "REPERTOAR",          to: "/repertoar",         icon: "music" },
  { label: "INSTAGRAM",          to: "/instagram",         icon: "instagram" },
  { label: "DOPUNSKI PROGRAMI",  to: "/dopunski-programi", icon: "plus" },
  { label: "KONTAKT",            to: "/kontakt",           icon: "mail" },
] as const;

export type NavItem = { label: string; to: string; icon: string };
const FAQ_LABEL = "NAJČEŠĆA PITANJA I ODGOVORI";

/**
 * Effective primary nav: WordPress menu wins when present, else local fallback.
 * Icons are inferred by path lookup against the local `navItems` table so menus
 * created in WP Admin still get the proper lucide icon set.
 */
function mapWpMenu(items: WpMenuItem[] | null, fallback: ReadonlyArray<NavItem>): NavItem[] {
  if (!items || items.length === 0) return fallback.map((i) => ({ ...i }));
  const iconByPath: Record<string, string> = {};
  fallback.forEach((i) => { iconByPath[i.to] = i.icon; });
  return items
    .map<NavItem | null>((m) => {
      const url = m.url || "";
      let path = m.path || "";
      if (!path) {
        try { path = new URL(url, "http://x").pathname; } catch { path = url; }
      }
      if (!path) return null;
      // strip trailing slash except root
      if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
      const fallbackMatch = fallback.find((i) => i.to === path);
      return {
        label: path === "/faq" ? FAQ_LABEL : m.label || fallbackMatch?.label || path,
        to: path,
        icon: iconByPath[path] || fallbackMatch?.icon || "home",
      };
    })
    .filter((x): x is NavItem => x !== null);
}

export function getNavItems(): NavItem[] {
  return mapWpMenu(getWpMenu("primary"), navItems);
}

export function getFooterNavItems(): NavItem[] {
  return mapWpMenu(getWpMenu("footer"), navItems).map((item) => ({
    ...item,
    label: item.label.charAt(0).toLocaleUpperCase("sr-Latn")
      + item.label.slice(1).toLocaleLowerCase("sr-Latn"),
  }));
}

export type EventTypeKey = "svadba" | "korporativna" | "klupska" | "rodjendan";

export const eventTypes: Array<{
  key: EventTypeKey; title: string; desc: string; formRoute: string; icon: string;
}> = [
  { key: "svadba",       title: "Svadbe",                           desc: "Live band + dopunski program: kvarteti, prvi ples, muzika za tortu.", formRoute: "/upit/svadba",                 icon: "rings" },
  { key: "korporativna", title: "Korporativne proslave / firme",     desc: "Profesionalan muzički program za poslovne događaje.",                 formRoute: "/upit/korporativna-proslava",  icon: "briefcase" },
  { key: "klupska",      title: "Klupske svirke / gastro barovi",    desc: "Energične svirke za klubove, barove i restorane.",                    formRoute: "/upit/klupska-svirka",         icon: "music" },
  { key: "rodjendan",    title: "Rođendani / jubileji / godišnjice", desc: "Proslavite važne trenutke uz muziku koja stvara atmosferu.",          formRoute: "/upit/rodjendan-jubilej",      icon: "cake" },
];

export const trustMetrics = [
  { value: "15+",   label: "GODINA ISKUSTVA" },
  { value: "1000+", label: "USPEŠNIH NASTUPA" },
  { value: "100K+", label: "ZADOVOLJNIH GOSTIJU" },
  { value: "♪",     label: "MUZIKA KOJA POVEZUJE" },
];

export const workflowSteps = [
  { n: "01", title: "Proverite dostupne termine", desc: "Otvorite kalendar i pronađite slobodan datum." },
  { n: "02", title: "Izaberite tip događaja",     desc: "Svadba, korporativni event, klupska svirka ili rođendan." },
  { n: "03", title: "Pošaljite upit",             desc: "Popunite kratak formular sa detaljima događaja." },
  { n: "04", title: "Odgovor u roku od 24h",      desc: "Svakom upitu pristupamo lično i preuzimamo dalju komunikaciju do potvrde termina." },
  { n: "05", title: "Potvrda termina",            desc: "Termin se potvrđuje nakon dogovora, avansa i ugovora." },
];

export const repertoireCategories = [
  { key: "domace",     title: "Domaće",          desc: "Najbolje domaće hitove svih generacija." },
  { key: "strano",     title: "Strano",          desc: "Pop, dance, soul, evergreen klasici." },
  { key: "90te",       title: "90-te",           desc: "Hitovi devedesetih za nezaboravnu energiju." },
  { key: "narodno",    title: "Narodno",         desc: "Narodna muzika za pravi provod." },
  { key: "kola",       title: "Kola",            desc: "Tradicionalna kola za ples i veselje." },
  { key: "club",       title: "Club / House",    desc: "Energy set za kasniji deo večeri." },
  { key: "prviples",   title: "Prvi ples",       desc: "Pažljivo odabrana romantična izvođenja." },
  { key: "specijalno", title: "Posebni zahtevi", desc: "Lista pesama biće dodata nakon dostavljanja repertoara." },
];

export const additionalPrograms = [
  { title: "DJ",                          desc: "Profesionalni DJ set za pauze i after-party." },
  { title: "Kvartet / trio",              desc: "Akustični ansambl za skup svatova." },
  { title: "Saksofon",                    desc: "Live saksofon kao gost-solo na vašem eventu." },
  { title: "Prvi ples",                   desc: "Posebno aranžiran prvi ples." },
  { title: "Muzika za skup svatova",      desc: "Ambijentalna muzika za dolazak gostiju." },
  { title: "Dodatni show program",        desc: "Specijalni performansi po dogovoru." },
];

// Full client FAQ — grouped in 6 categories
export type FaqGroup = { id: string; title: string; items: Array<{ q: string; a: string }> };
export const faqGroups: FaqGroup[] = [
  {
    id: "rezervacija",
    title: "Rezervacija i plaćanje",
    items: [
      { q: "Kako se bukira bend i kako ide plaćanje?", a: "Bukiranje benda vrši se nakon dogovora svih detalja događaja. Termin se smatra rezervisanim tek nakon uplate kapare, koja iznosi između 30% i 50% ukupnog honorara. Preostali deo honorara plaća se na samom događaju, pre ili neposredno nakon nastupa." },
      { q: "Da li se kapara vraća?",                   a: "Kapara se ne vraća u slučaju otkazivanja od strane klijenta, osim u izuzetnim situacijama o kojima se posebno dogovaramo. U slučaju da bend iz objektivnih razloga ne može da realizuje nastup, kapara se vraća u celosti." },
      { q: "Da li radite na garanciju?",               a: "Da. Na svaki nastup dajemo garanciju kvaliteta, profesionalnog odnosa i ispunjenja svih dogovorenih obaveza. Sve detalje regulišemo ugovorom." },
      { q: "Da li izbor datuma znači rezervaciju?",    a: "Ne. Kalendar na sajtu je informativan. Termin se rezerviše tek nakon dogovora i uplate kapare." },
      { q: "Kada dobijam odgovor?",                    a: "Odgovor na upit stiže u roku od 24h, vrlo često i ranije." },
    ],
  },
  {
    id: "organizacija",
    title: "Organizacija događaja",
    items: [
      { q: "Da li svirate van Srbije?",                  a: "Da. Bend redovno nastupa van Srbije — u regionu i šire. Svi troškovi puta, smeštaja i transporta opreme dogovaraju se unapred." },
      { q: "Da li svirate svadbe u inostranstvu?",       a: "Da. Imamo iskustvo nastupa na svadbama u različitim evropskim zemljama. Detalje rado dogovaramo individualno." },
      { q: "Da li možemo da pošaljemo upit ako nismo sigurni za datum?", a: "Da. Možete poslati upit i pre nego što finalizujete datum — obavezno naglasite u napomeni da je datum okvirni." },
      { q: "Koliko unapred treba bukirati bend?",        a: "Preporučujemo bukiranje što ranije, posebno za sezonu (maj — septembar). Popularni termini bivaju zauzeti više meseci unapred." },
    ],
  },
  {
    id: "repertoar",
    title: "Repertoar i muzičke želje",
    items: [
      { q: "Da li je dozvoljeno naručivanje pesama?",        a: "Da. Tokom nastupa gosti mogu naručivati pesme. Trudimo se da izađemo u susret svakoj želji u skladu sa repertoarom i atmosferom događaja." },
      { q: "Da li mogu da biram repertoar?",                  a: "Da. Pre nastupa zajedno usaglašavamo žanrove i listu pesama koje su Vam najvažnije, uključujući prvi ples i specijalne želje." },
      { q: "Da li možete naučiti pesme koje nisu u repertoaru?", a: "Za posebne prilike (prvi ples, omiljena pesma proslavljenika) bend može pripremiti pesmu koja nije u standardnom repertoaru — dogovor minimum 30 dana pre nastupa." },
    ],
  },
  {
    id: "dopunski",
    title: "Dodatni program",
    items: [
      { q: "Da li preko vas možemo organizovati dodatni program?", a: "Da. Pored standardnog nastupa benda, nudimo i dodatne sadržaje: DJ, kvartet, saksofon, muzika za skup svatova, muzika za prvi ples, kao i specijalne show programe — sve po dogovoru." },
      { q: "Da li nudite DJ posle nastupa benda?",                  a: "Da. DJ set može pokrivati pauze i after-party. Detalji opreme i trajanja dogovaraju se uz osnovni nastup." },
    ],
  },
  {
    id: "tehnika",
    title: "Tehnički uslovi i ozvučenje",
    items: [
      { q: "Da li je ozvučenje uključeno?",   a: "Da. U honorar je uključeno profesionalno ozvučenje primereno veličini prostora i broju gostiju. Za veće događaje obezbeđujemo dodatnu opremu uz prethodni tehnički dogovor." },
      { q: "Šta vam je potrebno na lokaciji?", a: "Stabilno električno napajanje, prostor za bend (min. 4×3 m za standardni sastav, više za prošireni), pristup za nošenje opreme i, po mogućnosti, parking u blizini." },
      { q: "Da li možete da odradite tonsku probu?", a: "Da. Tonska proba se po pravilu radi pre dolaska gostiju. Termin probe definišemo u dogovoru sa Vama i lokalom." },
    ],
  },
  {
    id: "bend",
    title: "Sastav benda i nastup",
    items: [
      { q: "Koji je standardni sastav benda?",       a: "Standardni sastav obuhvata vokala, klavijature, gitaru, bas i bubnjeve. Po dogovoru, sastav može biti prošireni — dodatni vokali, harmonika, duvački instrumenti i drugi muzičari." },
      { q: "Koliko traje nastup?",                    a: "Trajanje se dogovara individualno. Standardno je između 3 i 5 sati aktivne svirke, sa pauzama. Za svadbe i veće događaje često se kombinuje sa DJ-om." },
      { q: "Da li bend ima dress code?",              a: "Da. Standardno nastupamo u elegantnom dress code-u, prilagođenom prirodi događaja. Ako imate specifičan zahtev, rado se prilagodimo." },
    ],
  },
];

// Availability data has moved to `src/lib/calendar-config.ts` as
// `availabilityCalendarConfig.unavailableDates` (WP-ready, single source).
