export function ConsentField({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer text-body">
        <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-muted-foreground">Saglasan sam da me kontaktirate u vezi upita <span className="text-primary">*</span></span>
      </label>
      {error && <p className="text-small mt-1.5" style={{ color: "var(--color-unavailable)" }}>{error}</p>}
    </div>
  );
}