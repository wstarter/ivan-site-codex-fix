import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Send } from "lucide-react";
import { InquiryFormLayout, FormSection } from "@/components/site/form/InquiryFormLayout";
import { FormField } from "@/components/site/form/FormField";
import { RadioGroup } from "@/components/site/form/RadioGroup";
import { BudgetSlider } from "@/components/site/form/BudgetSlider";
import { Honeypot } from "@/components/site/form/Honeypot";
import { InfoPanel } from "@/components/site/form/InfoPanel";
import { ConsentField } from "@/components/site/form/ConsentField";
import { AvailabilityCalendar } from "@/components/site/AvailabilityCalendar";
import { useInquiryForm, required, emailValid } from "@/components/site/form/useInquiryForm";
import { CTAButton } from "@/components/site/CTAButton";
import { Cf7FormSlot } from "@/components/site/form/Cf7FormSlot";
import { visualAssets } from "@/lib/assets";
import { budgetConfig } from "@/lib/forms-config";
import { unlockBodyInteraction } from "@/lib/interaction-safety";
const hero = visualAssets.formWeddingHero;

export const Route = createFileRoute("/upit/svadba")({
  head: () => ({ meta: [{ title: "Popuni upit za svadbu — Ivan Jovanović" }, { name: "description", content: "Pošaljite upit za muzički program za vašu svadbu." }] }),
  component: WeddingForm,
});

function WeddingForm() {
  useEffect(() => {
    unlockBodyInteraction();
  }, []);

  const { state, set, errors, onSubmit } = useInquiryForm("wedding", {
    datum: "", lokacija: "", brojGostiju: "",
    budget: budgetConfig.defaults.wedding,
    dodatni: "", internacionalno: "", kulture: "", napomena: "",
    ime: "", telefon: "", email: "", saglasan: false,
  }, (s) => {
    const e: Record<string, string> = {};
    if (!required(s.datum)) e.datum = "Obavezno polje";
    if (!required(s.lokacija)) e.lokacija = "Obavezno polje";
    if (!required(s.brojGostiju)) e.brojGostiju = "Obavezno polje";
    if (!required(s.dodatni)) e.dodatni = "Izaberite opciju";
    if (!required(s.internacionalno)) e.internacionalno = "Izaberite opciju";
    if (!required(s.ime)) e.ime = "Obavezno polje";
    if (!required(s.telefon)) e.telefon = "Obavezno polje";
    if (!emailValid(s.email)) e.email = "Unesite validan email";
    if (!s.saglasan) e.saglasan = "Morate dati saglasnost";
    return e;
  });

  return (
    <InquiryFormLayout
      title="POPUNI UPIT ZA"
      accent="SVADBU"
      heroImage={hero.src}
      intro="Popunite kratak upitnik kako bismo razumeli Vaš događaj i poslali Vam tačnu ponudu za muzički program."
      side={<><InfoPanel /><div className="mt-6"><AvailabilityCalendar compact /></div></>}
    >
      <Cf7FormSlot formKey="wedding">
      <form onSubmit={onSubmit} noValidate className="form-shell cf7-ready" data-form-key="wedding">
        <Honeypot />
        <FormSection title="DETALJI DOGAĐAJA">
          <FormField number={1} label="Datum svadbe" required hint="Kog datuma organizujete svadbu?" error={errors.datum}>
            <input type="date" className={`input-base ${errors.datum ? "input-error" : ""}`} value={state.datum} onChange={(e) => set("datum", e.target.value)} />
          </FormField>
          <FormField number={2} label="Lokacija svadbe" required hint="Država, grad i restoran / prostor" error={errors.lokacija}>
            <input className={`input-base ${errors.lokacija ? "input-error" : ""}`} placeholder="Npr. Srbija, Beograd, Kalemegdanska terasa" value={state.lokacija} onChange={(e) => set("lokacija", e.target.value)} />
          </FormField>
          <FormField number={3} label="Broj gostiju" required hint="Tačan ili okviran broj gostiju" error={errors.brojGostiju}>
            <input className={`input-base ${errors.brojGostiju ? "input-error" : ""}`} placeholder="Npr. 150–200" value={state.brojGostiju} onChange={(e) => set("brojGostiju", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="BUDŽET">
          <FormField number={4} label="Koji je vaš planirani budžet?" required hint="Izaberite okvirni budžet">
            <BudgetSlider formKey="wedding" value={state.budget} onChange={(v) => set("budget", v)} />
          </FormField>
        </FormSection>

        <FormSection title="DODATNE OPCIJE">
          <FormField number={5} label="Dodatni muzički & show program" required hint="Kvarteti za vreme skupa svatova, DJ-evi za vreme torte, kabare program i još mnogo toga." error={errors.dodatni}>
            <RadioGroup name="dodatni" value={state.dodatni} onChange={(v) => set("dodatni", v)} options={["Da", "Ne", "Želim preporuku"]} />
          </FormField>
          <FormField number={6} label="Da li očekujete veći broj stranih gostiju ili gostiju iz različitih kultura?" required hint="Strani gosti, kulture i jezici" error={errors.internacionalno}>
            <div className="space-y-3">
              <RadioGroup name="inter" value={state.internacionalno} onChange={(v) => set("internacionalno", v)} options={["Da", "Ne"]} />
              <input className="input-base" placeholder="Koje kulture / jezici su važni? (opciono)" value={state.kulture} onChange={(e) => set("kulture", e.target.value)} />
            </div>
          </FormField>
          <FormField number={7} label="Posebni zahtevi i napomene" hint="Pesme, želje, pitanja…">
            <textarea className="input-base min-h-[110px]" placeholder="Unesite vaše zahteve, napomene ili pitanja…" value={state.napomena} onChange={(e) => set("napomena", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="KONTAKT PODACI">
          <FormField number={8} label="Ime i prezime" required error={errors.ime}>
            <input className={`input-base ${errors.ime ? "input-error" : ""}`} placeholder="Vaše ime i prezime" value={state.ime} onChange={(e) => set("ime", e.target.value)} />
          </FormField>
          <FormField number={9} label="Telefon (Viber / WhatsApp)" required error={errors.telefon}>
            <input type="tel" className={`input-base ${errors.telefon ? "input-error" : ""}`} placeholder="Vaš broj telefona" value={state.telefon} onChange={(e) => set("telefon", e.target.value)} />
          </FormField>
          <FormField number={10} label="Email adresa" required error={errors.email}>
            <input type="email" className={`input-base ${errors.email ? "input-error" : ""}`} placeholder="Vaša email adresa" value={state.email} onChange={(e) => set("email", e.target.value)} />
          </FormField>
        </FormSection>

        <div className="pt-4 space-y-5">
          <ConsentField checked={state.saglasan} onChange={(v) => set("saglasan", v)} error={errors.saglasan} />
          <CTAButton type="submit" variant="primary" fullWidth><Send size={16} /> POŠALJI UPIT</CTAButton>
          <p className="text-small text-muted-foreground text-center">Garantujemo odgovor i ponudu u roku od 24h od prijema upita, često i ranije.</p>
        </div>
      </form>
      </Cf7FormSlot>
    </InquiryFormLayout>
  );
}
