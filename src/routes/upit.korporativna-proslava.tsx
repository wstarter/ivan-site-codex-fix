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
import { useInquiryForm, required, emailValid } from "@/components/site/form/useInquiryForm";
import { CTAButton } from "@/components/site/CTAButton";
import { Cf7FormSlot } from "@/components/site/form/Cf7FormSlot";
import { visualAssets } from "@/lib/assets";
import { budgetConfig } from "@/lib/forms-config";
import { unlockBodyInteraction } from "@/lib/interaction-safety";
const hero = visualAssets.formCorporateHero;

export const Route = createFileRoute("/upit/korporativna-proslava")({
  head: () => ({ meta: [{ title: "Upit za korporativnu proslavu — Ivan Jovanović" }, { name: "description", content: "Pošaljite upit za muzički program za korporativni event." }] }),
  component: CorporateForm,
});

function CorporateForm() {
  useEffect(() => {
    unlockBodyInteraction();
  }, []);

  const { state, set, errors, onSubmit } = useInquiryForm("corporate", {
    lokacija: "", datum: "", brojGostiju: "", trajanje: "", zanrovi: "",
    bukDodatni: "",
    budget: budgetConfig.defaults.corporate,
    faktura: "",
    dressCode: "", dressCodeOpis: "", napomena: "",
    ime: "", telefon: "", email: "", saglasan: false,
  }, (s) => {
    const e: Record<string, string> = {};
    ["lokacija","datum","brojGostiju","trajanje","zanrovi","bukDodatni","faktura","dressCode","ime","telefon"].forEach((k) => { if (!required((s as Record<string, unknown>)[k])) e[k] = "Obavezno polje"; });
    if (!emailValid(s.email)) e.email = "Unesite validan email";
    if (!s.saglasan) e.saglasan = "Morate dati saglasnost";
    return e;
  });

  return (
    <InquiryFormLayout
      title="POŠALJITE UPIT ZA"
      accent="KORPORATIVNU PROSLAVU"
      heroImage={hero.src}
      intro="Popunite formular kako bismo pripremili tačnu ponudu za vaš korporativni event."
      side={<InfoPanel headline="GARANTOVANI ODGOVOR" subline="NAJKASNIJE U ROKU OD" big="24h" />}
    >
      <Cf7FormSlot formKey="corporate">
      <form onSubmit={onSubmit} noValidate className="form-shell cf7-ready" data-form-key="corporate">
        <Honeypot />
        <FormSection title="DETALJI EVENTA">
          <FormField number={1} label="Planirana lokacija" required error={errors.lokacija}><input className={`input-base ${errors.lokacija ? "input-error" : ""}`} placeholder="Npr. Srbija, Beograd, Hotel Crowne Plaza" value={state.lokacija} onChange={(e) => set("lokacija", e.target.value)} /></FormField>
          <FormField number={2} label="Datum održavanja" required error={errors.datum}><input type="date" className={`input-base ${errors.datum ? "input-error" : ""}`} value={state.datum} onChange={(e) => set("datum", e.target.value)} /></FormField>
          <FormField number={3} label="Potencijalni broj gostiju" required error={errors.brojGostiju}><input className={`input-base ${errors.brojGostiju ? "input-error" : ""}`} placeholder="Npr. 150–200" value={state.brojGostiju} onChange={(e) => set("brojGostiju", e.target.value)} /></FormField>
          <FormField number={4} label="Predviđeno vreme aktivne svirke benda" required error={errors.trajanje}>
            <select className={`input-base ${errors.trajanje ? "input-error" : ""}`} value={state.trajanje} onChange={(e) => set("trajanje", e.target.value)}>
              <option value="">Izaberite okvirno vreme</option>
              <option>1h</option><option>2h</option><option>3h</option><option>4h</option><option>5h+</option>
            </select>
          </FormField>
          <FormField number={5} label="Koje žanrove želite da bend svira" required error={errors.zanrovi}>
            <select className={`input-base ${errors.zanrovi ? "input-error" : ""}`} value={state.zanrovi} onChange={(e) => set("zanrovi", e.target.value)}>
              <option value="">Izaberite žanrove</option>
              <option>Pop / domaće</option><option>Strano / evergreen</option><option>Narodno</option><option>Mix / sve generacije</option>
            </select>
          </FormField>
        </FormSection>

        <FormSection title="DODATNI SADRŽAJ I BUDŽET">
          <FormField number={6} label="Da li želite da preko nas bukirate dodatni sadržaj?" required error={errors.bukDodatni}><RadioGroup name="buk" value={state.bukDodatni} onChange={(v) => set("bukDodatni", v)} options={["Da", "Ne", "Želim preporuku"]} /></FormField>
          <FormField number={7} label="Koji je vaš planirani budžet?" required hint="Izaberite okvirni budžet">
            <BudgetSlider formKey="corporate" value={state.budget} onChange={(v) => set("budget", v)} />
          </FormField>
          <FormField number={8} label="Plaćanje preko fakture?" required error={errors.faktura}><RadioGroup name="fakt" value={state.faktura} onChange={(v) => set("faktura", v)} options={["Da", "Ne"]} /></FormField>
          <FormField number={9} label="Dress code" required error={errors.dressCode}>
            <div className="space-y-3">
              <RadioGroup name="dc" value={state.dressCode} onChange={(v) => set("dressCode", v)} options={["Da", "Ne"]} />
              {state.dressCode === "Da" && <input className="input-base" placeholder="Ako da, koji?" value={state.dressCodeOpis} onChange={(e) => set("dressCodeOpis", e.target.value)} />}
            </div>
          </FormField>
          <FormField number={10} label="Značajne napomene ili pitanja"><textarea className="input-base min-h-[100px]" value={state.napomena} onChange={(e) => set("napomena", e.target.value)} /></FormField>
        </FormSection>

        <FormSection title="KONTAKT PODACI">
          <FormField number={11} label="Ime i prezime" required error={errors.ime}><input className={`input-base ${errors.ime ? "input-error" : ""}`} value={state.ime} onChange={(e) => set("ime", e.target.value)} /></FormField>
          <FormField number={12} label="Telefon" required error={errors.telefon}><input type="tel" className={`input-base ${errors.telefon ? "input-error" : ""}`} value={state.telefon} onChange={(e) => set("telefon", e.target.value)} /></FormField>
          <FormField number={13} label="Email" required error={errors.email}><input type="email" className={`input-base ${errors.email ? "input-error" : ""}`} value={state.email} onChange={(e) => set("email", e.target.value)} /></FormField>
        </FormSection>

        <div className="pt-4 space-y-5">
          <ConsentField checked={state.saglasan} onChange={(v) => set("saglasan", v)} error={errors.saglasan} />
          <CTAButton type="submit" variant="primary" fullWidth><Send size={16} /> POŠALJI UPIT</CTAButton>
        </div>
      </form>
      </Cf7FormSlot>
    </InquiryFormLayout>
  );
}
