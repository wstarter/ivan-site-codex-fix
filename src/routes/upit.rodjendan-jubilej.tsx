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
import { getPageHeroAsset } from "@/lib/page-hero-assets";
import { budgetConfig } from "@/lib/forms-config";
import { unlockBodyInteraction } from "@/lib/interaction-safety";
const hero = getPageHeroAsset("/upit/rodjendan-jubilej");

export const Route = createFileRoute("/upit/rodjendan-jubilej")({
  head: () => ({ meta: [{ title: "Upit za rođendane i jubileje — Ivan Jovanović" }, { name: "description", content: "Pošaljite upit za rođendan, jubilej ili godišnjicu." }] }),
  component: BirthdayForm,
});

function BirthdayForm() {
  useEffect(() => {
    unlockBodyInteraction();
  }, []);

  const { state, set, errors, onSubmit } = useInquiryForm("birthday", {
    lokacija: "", datum: "", jubilej: "", brojGostiju: "",
    dodatni: "",
    budget: budgetConfig.defaults.birthday,
    dressCode: "", dressCodeOpis: "", napomena: "",
    ime: "", telefon: "", email: "", saglasan: false,
  }, (s) => {
    const e: Record<string, string> = {};
    ["lokacija","datum","jubilej","brojGostiju","dodatni","dressCode","ime","telefon"].forEach((k) => { if (!required((s as Record<string, unknown>)[k])) e[k] = "Obavezno polje"; });
    if (!emailValid(s.email)) e.email = "Unesite validan email";
    if (!s.saglasan) e.saglasan = "Morate dati saglasnost";
    return e;
  });

  return (
    <InquiryFormLayout
      title="POŠALJITE UPIT ZA"
      accent="ROĐENDAN / JUBILEJ"
      heroImage={hero.src}
      intro="Popunite formular kako bismo razumeli vaš događaj i pripremili odgovarajući muzički program."
      side={<InfoPanel headline="ODGOVOR DOBIJATE GARANTOVANO" subline="U ROKU OD" big="24h" />}
    >
      <Cf7FormSlot formKey="birthday">
      <form onSubmit={onSubmit} noValidate className="form-shell cf7-ready" data-form-key="birthday">
        <Honeypot />
        <FormSection title="DETALJI">
          <FormField number={1} label="Lokacija" required error={errors.lokacija}><input className={`input-base ${errors.lokacija ? "input-error" : ""}`} placeholder="Upišite lokaciju" value={state.lokacija} onChange={(e) => set("lokacija", e.target.value)} /></FormField>
          <FormField number={2} label="Datum rođendana" required error={errors.datum}><input type="date" className={`input-base ${errors.datum ? "input-error" : ""}`} value={state.datum} onChange={(e) => set("datum", e.target.value)} /></FormField>
          <FormField number={3} label="Koji jubilej slavite / koji rođendan?" required error={errors.jubilej}><input className={`input-base ${errors.jubilej ? "input-error" : ""}`} placeholder="Upišite jubilej / rođendan" value={state.jubilej} onChange={(e) => set("jubilej", e.target.value)} /></FormField>
          <FormField number={4} label="Broj gostiju" required error={errors.brojGostiju}><input className={`input-base ${errors.brojGostiju ? "input-error" : ""}`} placeholder="Npr. 80–120" value={state.brojGostiju} onChange={(e) => set("brojGostiju", e.target.value)} /></FormField>
        </FormSection>

        <FormSection title="DODATNE OPCIJE">
          <FormField number={5} label="Dodatan sadržaj" required error={errors.dodatni}><RadioGroup name="dod" value={state.dodatni} onChange={(v) => set("dodatni", v)} options={["Da", "Ne", "Želim preporuku"]} /></FormField>
          <FormField number={6} label="Koji je vaš planirani budžet?" required hint="Izaberite okvirni budžet">
            <BudgetSlider formKey="birthday" value={state.budget} onChange={(v) => set("budget", v)} />
          </FormField>
          <FormField number={7} label="Da li je neophodan dress code?" required error={errors.dressCode}>
            <div className="space-y-3">
              <RadioGroup name="dc" value={state.dressCode} onChange={(v) => set("dressCode", v)} options={["Da", "Ne"]} />
              {state.dressCode === "Da" && <input className="input-base" placeholder="Ako da, koji dress code?" value={state.dressCodeOpis} onChange={(e) => set("dressCodeOpis", e.target.value)} />}
            </div>
          </FormField>
          <FormField number={8} label="Napomene"><textarea className="input-base min-h-[100px]" value={state.napomena} onChange={(e) => set("napomena", e.target.value)} /></FormField>
        </FormSection>

        <FormSection title="KONTAKT PODACI">
          <FormField number={9} label="Ime i prezime" required error={errors.ime}><input className={`input-base ${errors.ime ? "input-error" : ""}`} value={state.ime} onChange={(e) => set("ime", e.target.value)} /></FormField>
          <FormField number={10} label="Telefon" required error={errors.telefon}><input type="tel" className={`input-base ${errors.telefon ? "input-error" : ""}`} value={state.telefon} onChange={(e) => set("telefon", e.target.value)} /></FormField>
          <FormField number={11} label="Email" required error={errors.email}><input type="email" className={`input-base ${errors.email ? "input-error" : ""}`} value={state.email} onChange={(e) => set("email", e.target.value)} /></FormField>
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
