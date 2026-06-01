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

export type FaqAnswerBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type FaqItem = {
  question: string;
  answer: FaqAnswerBlock[];
};

const paragraph = (text: string): FaqAnswerBlock => ({ type: "paragraph", text });
const heading = (text: string): FaqAnswerBlock => ({ type: "heading", text });
const list = (...items: string[]): FaqAnswerBlock => ({ type: "list", items });

// Full client FAQ — one flat source for the page and homepage preview.
export const faqItems: FaqItem[] = [
  {
    question: "Da li radite na garanciju?",
    answer: [
      paragraph("Ne radimo po sistemu garancije. Uslovi saradnje, rezervacije i otkazivanja jasno se definišu ugovorom."),
    ],
  },
  {
    question: "Da li svirate van Srbije?",
    answer: [paragraph("Da, nastupamo i van Srbije.")],
  },
  {
    question: "Da li je dozvoljeno naručivanje pesama i kako to funkcioniše?",
    answer: [
      paragraph("Bend pretežno svira unapred dogovoren program, koji se individualno kreira sa mladencima ili organizatorima događaja. Način i trenutak naručivanja pesama definiše se internim dogovorom između mladenaca, odnosno organizatora događaja, i benda."),
    ],
  },
  {
    question: "Da li je potrebno da se vidimo pre svadbe, kada se rade završni dogovori i kako funkcioniše organizacija?",
    answer: [
      paragraph("Molimo vas da ovo pitanje pročitate pažljivo, jer je veoma važno za kompletnu organizaciju događaja."),
      paragraph("Prilikom rezervacije benda, u trenutku kada se daje kapara i potpisuje ugovor, već imamo oko 95% najvažnijih informacija potrebnih za organizaciju događaja. To su:"),
      list(
        "datum događaja",
        "grad i država održavanja",
        "naziv restorana ili sale",
        "osnovne informacije o događaju",
      ),
      paragraph("To su ključne informacije i one se rešavaju odmah prilikom rezervacije termina, koja se najčešće zakazuje i 10–12 meseci unapred."),
      paragraph("Nakon toga je potpuno logično da se mladenci pitaju kada se dalje organizujemo, da li treba da se viđamo i kako funkcionišu završni dogovori."),
      paragraph("Na osnovu višedecenijskog iskustva i više od 3.000 organizovanih događaja ovog tipa, procedura funkcioniše na sledeći način."),
      heading("Primer organizacije"),
      paragraph("Ako je vaša svadba zakazana za 20. jun naredne godine, nakon uplaćene kapare i osnovnih informacija:"),
      list(
        "datum je rezervisan",
        "bend unosi događaj u svoj kalendar",
        "evidentiraju se lokacija, restoran i svi osnovni podaci",
      ),
      paragraph("Kako se datum približava, organizacija ulazi u završnu fazu."),
      heading("Završna organizacija — 5 do 7 dana pred događaj"),
      paragraph("Nema potrebe da se finalni sastanci i kompletna organizacija rade mnogo ranije. Ukoliko je vaša svadba, na primer, 20. juna, oko 5–7 dana pred događaj dobijate od nas detaljan upitnik koji popunjavate i vraćate nam nazad."),
      paragraph("Za popunjavanje upitnika potrebno je svega nekoliko minuta. U njemu se nalaze sva važna pitanja koja su potrebna kako bismo zajedno sa vama napravili završni protokol događaja, uključujući:"),
      list(
        "konačan broj gostiju",
        "broj članova benda i prijavu restoranu",
        "pesmu za ulazak mladenaca",
        "prvi ples",
        "tortu i muziku za tortu",
        "građansko venčanje",
        "fotografisanje sa gostima",
        "satnice događaja",
        "posebne želje i napomene",
        "DJ program i live nastupe",
        "dodatne izvođače i specijalne programe",
      ),
      paragraph("Dakle, dobijate potpuno organizovan i jednostavan sistem kroz koji vrlo lako završavamo kompletnu organizaciju, bez nepotrebnog gubljenja vremena."),
      heading("Finalni dogovor i protokol"),
      paragraph("Nakon što nam dostavite popunjen upitnik, organizator iz benda vas kontaktira putem telefona, video poziva ili e-maila radi završnog dogovora."),
      paragraph("Na osnovu vaših odgovora kreira se kompletan završni protokol događaja sa preciznim satnicama i svim detaljima, uključujući:"),
      list(
        "kada ulaze gosti",
        "kada je fotografisanje",
        "vreme građanskog venčanja",
        "kada nastupa bend",
        "kada nastupa DJ",
        "kada ide torta",
        "koje pesme se puštaju, a koje bend izvodi uživo",
        "kompletan tok večeri do kraja događaja",
      ),
      paragraph("Dakle, pravi se detaljan i profesionalan program celog događaja kako bi sve proteklo maksimalno organizovano i bez stresa."),
      heading("Zašto organizaciju radimo u tekućoj nedelji?"),
      paragraph("Važno je da znate da bend poput našeg gotovo svakog vikenda nastupa na svadbama i velikim događajima. Upravo zbog toga, kako bismo svakom događaju pristupili maksimalno profesionalno i fokusirano, završnu organizaciju radimo isključivo u nedelji u kojoj se svadba održava."),
      paragraph("Na osnovu višedecenijskog iskustva pokazalo se da je upravo ovo:"),
      list(
        "najorganizovaniji način rada",
        "najmanje stresan za mladence",
        "najefikasniji za sve učesnike događaja",
      ),
      paragraph("Zato nema razloga za brigu — imate dovoljno vremena za sve, ništa neće biti propušteno i kompletna organizacija biće pod kontrolom."),
      paragraph("Naravno, stojimo vam na raspolaganju za sva pitanja i sastanke ukoliko postoji potreba za njima. Ipak, zbog brzog načina života i vaših i naših obaveza, preporučujemo da se većina dogovora obavi putem telefonskog razgovora ili video poziva, što se u praksi pokazalo kao najbrži, najlakši i najefikasniji način organizacije događaja."),
    ],
  },
  {
    question: "Da li svirate kola i narodnu muziku?",
    answer: [paragraph("Da, u dogovoru sa mladencima.")],
  },
  {
    question: "Da li možemo da pošaljemo spisak željenih i neželjenih pesama?",
    answer: [
      paragraph("Da, naravno. Svadbe i eventi su privatni događaji i pristup je potpuno individualan."),
      paragraph("Poželjno je da navedete muzičke pravce koje preferirate, na primer pop, narodnu muziku, muziku 90-ih i slično, kao i eventualne pesme koje ne želite da se izvode."),
    ],
  },
  {
    question: "Da li svirate crnogorske i kosovske pesme?",
    answer: [paragraph("Da, izvodimo poznate tradicionalne pesme, uključujući i kola.")],
  },
  {
    question: "Da li možete da naučite pesme koje želimo?",
    answer: [
      paragraph("U većini slučajeva već izvodimo oko 95% traženog repertoara. Ne praktikujemo učenje većeg broja novih pesama, jer tokom godine imamo veliki broj nastupa i držimo se postojećeg, raznovrsnog repertoara."),
    ],
  },
  {
    question: "Da li je ozvučenje uključeno u cenu?",
    answer: [
      paragraph("Ne. Ozvučenje se dodatno naplaćuje u zavisnosti od broja gostiju. Trošak je transparentan i unapred definisan."),
    ],
  },
  {
    question: "Da li preko vas možemo da organizujemo dodatni program, kao što su DJ, saksofon ili violina?",
    answer: [
      paragraph("Da. U saradnji sa nama možete kreirati kompletan muzički program. U ponudi imamo DJ-eve, trubače, saksofon, violinu, gudačke kvartete i još mnogo toga."),
    ],
  },
  {
    question: "Da li se DJ tokom torte dodatno naplaćuje?",
    answer: [paragraph("Da, sav dodatni sadržaj se naplaćuje posebno.")],
  },
  {
    question: "Ako nemamo program za skup svatova, da li možete pustiti muziku?",
    answer: [paragraph("Da. Možemo obezbediti ambijentalnu pozadinsku muziku dok se gosti okupljaju.")],
  },
  {
    question: "Da li svirate tokom fotografisanja sa mladencima?",
    answer: [paragraph("Ne. Svirka počinje nakon prvog plesa.")],
  },
  {
    question: "Da li prvi ples svirate ili puštate?",
    answer: [
      paragraph("Ukoliko je pesma na našem repertoaru, možemo je odsvirati. U suprotnom, pesma se pušta u dogovoru sa vama, uz mogućnost skraćivanja i prilagođavanja."),
      paragraph("U praksi se sve veći broj mladenaca odlučuje da se teme za ulazak, prvi ples i tortu puštaju, i smatramo da je to često bolja opcija za vas."),
      paragraph("Potrebno je da nam pošaljete linkove pesama i naznačite trajanje."),
    ],
  },
  {
    question: "Kako se bukira bend i kako ide plaćanje?",
    answer: [
      paragraph("Datum se rezerviše isključivo uz potpisan ugovor i uplatu avansa. Kompletna procedura, uključujući ugovor i uplatu, realizuje se online putem e-maila."),
      paragraph("Ostatak iznosa se plaća nakon događaja."),
    ],
  },
  {
    question: "Da li se kapara vraća u slučaju otkazivanja?",
    answer: [
      paragraph("Ne. Kapara je nepovratna, što je jasno definisano ugovorom. Ukoliko se datum pomera i bend je slobodan, kapara važi za novi termin."),
    ],
  },
  {
    question: "Da li svirate svadbe u inostranstvu i kako se obračunavaju troškovi?",
    answer: [
      paragraph("Da, sviramo svuda. Dobijate jasan i transparentan pregled svih troškova: prevoz, smeštaj, transferi i ostali logistički detalji."),
    ],
  },
  {
    question: "Da li je moguće angažovati manji sastav bez celog benda?",
    answer: [
      paragraph("Generalno ne praktikujemo manji sastav, jer želimo maksimalan kvalitet. Postoji mogućnost za manje, akustične ili specifične evente, uz prethodnu konsultaciju."),
    ],
  },
  {
    question: "Kada treba da dostavimo satnice i detalje?",
    answer: [
      paragraph("Najkasnije 5–7 dana pre događaja. Ranije nema potrebe, jer se organizacija finalizuje neposredno pred svadbu, u tekućoj nedelji."),
    ],
  },
  {
    question: "Šta ide prvo — prvi ples ili bidermajer?",
    answer: [
      paragraph("Naša preporuka je da prvo ide prvi ples, zatim bidermajer. Na taj način se gosti već nalaze na podijumu i žurka prirodno počinje."),
    ],
  },
  {
    question: "Šta ako se vreme pokvari kada je svadba na otvorenom?",
    answer: [
      paragraph("Premeštanje opreme nije moguće brzo, jer zahteva određeno vreme. U takvim situacijama jedino rešenje je dupli sistem ozvučenja, što je skupa opcija i ne preporučujemo je."),
    ],
  },
  {
    question: "Da li gost može da peva sa bendom?",
    answer: [
      paragraph("Da, naravno. Za profesionalne izvođače važi da dolaze sa svojim bendom ukoliko izvode kompletan blok."),
    ],
  },
  {
    question: "Da li drugi izvođači mogu koristiti vaše ozvučenje?",
    answer: [paragraph("Da, naravno. Ozvučenje plaćaju mladenci i dostupno je svim izvođačima.")],
  },
  {
    question: "Koliko dugo svirate i koliko pauza pravite?",
    answer: [
      paragraph("Trajanje i pauze zavise od protokola. Dobro organizovana svadba je ključ vrhunske žurke."),
      heading("Primer protokola"),
      list(
        "16:00–17:00 — skup svatova",
        "17:00 — dolazak mladenaca",
        "17:00 — venčanje",
        "17:15–18:00 — slikanje, uz pozadinsku muziku",
        "18:00 — prvi ples",
        "nakon toga — bidermajer",
        "18:00–19:30 — live blok 1",
        "pauza 30 minuta",
        "20:00–21:30 — live blok 2",
        "21:30 — torta + dodatni program",
        "22:30–00:00 — live blok 3",
        "00:00 — kraj",
      ),
    ],
  },
  {
    question: "Da li možemo produžiti svadbu uz doplatu?",
    answer: [
      paragraph("Vrlo retko. Na osnovu dugogodišnjeg iskustva, pravilno organizovan program od 6 sati muzike je više nego dovoljan za vrhunsku žurku. U izuzetnim situacijama mladenci dodatno angažuju DJ-a."),
    ],
  },
  {
    question: "Da li svirate stranu muziku?",
    answer: [
      paragraph("Da, sviramo i stranu muziku. Ona može biti deo programa, ali je važno unapred definisati vaš zahtev i zamisao, odnosno koliko vremenski treba da traje. Sve detalje preciziramo u usmenom razgovoru."),
    ],
  },
  {
    question: "Da li svirate internacionalna venčanja?",
    answer: [
      paragraph("Da, i to na visokom nivou. Kreiramo specijalno osmišljen, individualan program koji zadovoljava kako goste iz inostranstva, tako i domaće goste."),
      paragraph("Pravimo balansiran i zanimljiv raspored programa, koji zajedno definišemo u razgovoru i na sastanku prilikom zakazivanja termina."),
    ],
  },
  {
    question: "Koja pevačica peva sa vama?",
    answer: [
      paragraph("Izbor pevačice za vaš događaj dogovaramo u usmenom razgovoru sa vama. Na taj način prezentujemo dostupne opcije i vršimo najbolju selekciju za vaš događaj."),
    ],
  },
  {
    question: "Da li u sastavu imate harmoniku?",
    answer: [
      paragraph("U standardnom sastavu nemamo harmoniku. Ukoliko postoji određeni upit ili želja za takvim konceptom, možemo razmotriti i dodati instrumentalnog solistu u sastav za vaš događaj, bilo da je reč o harmonici, saksofonu ili nekom drugom instrumentu."),
    ],
  },
  {
    question: "Koje instrumente imate u bendu?",
    answer: [
      paragraph("Osnovni sastav čine bubanj, klavijature, gitara, pevač, pevačica i tonac."),
      paragraph("Uz sastav se mogu dodati saksofon ili drugi instrumentalisti solisti, uz doplatu i interni dogovor sa vama. Sve te stvari prolazimo u usmenom dogovoru prilikom bukiranja benda i definisanja opštih informacija."),
    ],
  },
];

// Keep homepage answers concise while reusing the same editable FAQ items.
export const faqPreviewItems = [faqItems[0], faqItems[1], faqItems[4], faqItems[8], faqItems[14]];

// Availability data has moved to `src/lib/calendar-config.ts` as
// `availabilityCalendarConfig.unavailableDates` (WP-ready, single source).
