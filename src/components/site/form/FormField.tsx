import type { ReactNode } from "react";

export function FormField({
  label,
  required,
  hint,
  error,
  number,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  number?: number | string;
  children: ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-[auto_1fr_1.4fr] gap-3 md:gap-5 items-start py-3">
      <div className="hidden md:flex w-9 h-9 rounded-full gold-border items-center justify-center text-xs gold-text font-semibold">
        {number ?? ""}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="md:hidden inline-flex w-7 h-7 rounded-full gold-border items-center justify-center text-[11px] gold-text font-semibold">{number ?? ""}</span>
          <label className="form-field-label text-body text-foreground font-medium">
            {label} {required && <span className="text-primary">*</span>}
          </label>
        </div>
        {hint && <p className="form-field-hint text-small text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div>
        {children}
        {error && <p className="text-small mt-1.5" style={{ color: "var(--color-unavailable)" }}>{error}</p>}
      </div>
    </div>
  );
}
