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
import { getPageHeroImage } from "@/lib/page-hero-assets";
import { budgetConfig } from "@/lib/forms-config";
import { unlockBodyInteraction } from "@/lib/interaction-safety";
const heroImage = getPageHeroImage("/upit/klupska-svirka");

export const Route = createFileRoute("/upit/klupska-svirka")({
  head: () => ({ meta: [{ title: "Upit za klupsku svirku — Ivan Jovanović" }, { name: "description", content: "Pošaljite upit za klupsku ili gastro bar svirku." }] }),
  component: ClubForm,
});

function ClubForm() {
  useEffect(() => {
    unlockBodyInteraction();
  }, []);

  const { state, set, errors, onSubmit } = useInquiryForm("club", {
    lokacija: "", lokal: "", trajanje: "", blokovi: "",
    pocetak: "", kraj: "", datum: "", probaPocetak: "", probaKraj: "",
    faktura: "",
    budget: budgetConfig.defaults.club,
    napomena: "",
    ime: "", telefon: "", email: "", saglasan: false,
  }, (s) => {
    const e: Record<string, string> = {};
    ["lokacija","lokal","trajanje","blokovi","pocetak","kraj","datum","faktura","ime","telefon"].forEach((k) => { if (!required((s as Record<string, unknown>)[k])) e[k] = "Obavezno polje"; });
    if (!emailValid(s.email)) e.email = "Unesite validan email";
    if (!s.saglasan) e.saglasan = "Morate dati saglasnost";
    return e;
  });

  return (
    <InquiryFormLayout
      title="POŠALJITE UPIT ZA"
      accent="KLUPSKU SVIRKU"
      heroImage={heroImage}
      intro="Popunite formular sa detaljima za vašu klupsku svirku ili gastro bar event."
      side={<InfoPanel headline="GARANTOVANI ODGOVOR I PONUDA" subline="U ROKU OD" big="24h" />}
    >
      <Cf7FormSlot formKey="club">
      <form onSubmit={onSubmit} noValidate className="form-shell cf7-ready" data-form-key="club">
        <Honeypot />
        <FormSection title="LOKACIJA">
          <FormField number={1} label="Lokacija (grad, država)" required error={errors.lokacija}><input className={`input-base ${errors.lokacija ? "input-error" : ""}`} placeholder="Unesite grad i državu" value={state.lokacija} onChange={(e) => set("lokacija", e.target.value)} /></FormField>
          <FormField number={2} label="Naziv restorana ili kluba" required error={errors.lokal}><input className={`input-base ${errors.lokal ? "input-error" : ""}`} placeholder="Unesite naziv lokala" value={state.lokal} onChange={(e) => set("lokal", e.target.value)} /></FormField>
        </FormSection>

        <FormSection title="TRAJANJE I VREME">
          <FormField number={3} label="Vreme trajanja svirke" required error={errors.trajanje}>
            <select className={`input-base ${errors.trajanje ? "input-error" : ""}`} value={state.trajanje} onChange={(e) => set("trajanje", e.target.value)}>
              <option value="">Izaberite trajanje</option>
              <option>2h</option><option>3h</option><option>4h</option><option>5h+</option>
            </select>
          </FormField>
          <FormField number={4} label="Jednokratno ili dva bloka sa pauzom?" required error={errors.blokovi}>
            <RadioGroup name="blok" value={state.blokovi} onChange={(v) => set("blokovi", v)} options={["A — Iz jednog bloka", "B — Iz dva bloka sa pauzom"]} />
          </FormField>
          <FormField number={5} label="Početak i kraj svirke" required error={errors.pocetak || errors.kraj}>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" className="input-base" value={state.pocetak} onChange={(e) => set("pocetak", e.target.value)} />
              <input type="time" className="input-base" value={state.kraj} onChange={(e) => set("kraj", e.target.value)} />
            </div>
          </FormField>
          <FormField number={6} label="Datum svirke" required error={errors.datum}><input type="date" className={`input-base ${errors.datum ? "input-error" : ""}`} value={state.datum} onChange={(e) => set("datum", e.target.value)} /></FormField>
          <FormField number={7} label="Tonska proba (start / kraj)">
            <div className="grid grid-cols-2 gap-3">
              <input type="time" className="input-base" value={state.probaPocetak} onChange={(e) => set("probaPocetak", e.target.value)} />
              <input type="time" className="input-base" value={state.probaKraj} onChange={(e) => set("probaKraj", e.target.value)} />
            </div>
          </FormField>
        </FormSection>

        <FormSection title="FINANSIJE">
          <FormField number={8} label="Honorar preko fakture?" required error={errors.faktura}><RadioGroup name="fakt" value={state.faktura} onChange={(v) => set("faktura", v)} options={["Da", "Ne"]} /></FormField>
          <FormField number={9} label="Koji je vaš planirani budžet?" required hint="Izaberite okvirni budžet">
            <BudgetSlider formKey="club" value={state.budget} onChange={(v) => set("budget", v)} />
          </FormField>
          <FormField number={10} label="Napomena za vaš lokal"><textarea className="input-base min-h-[100px]" value={state.napomena} onChange={(e) => set("napomena", e.target.value)} /></FormField>
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
