export function RadioGroup({
  name, value, onChange, options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="btn-base"
            style={{
              minHeight: 44,
              padding: "0 1rem",
              border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
              background: active ? "color-mix(in oklab, var(--color-primary) 15%, transparent)" : "transparent",
              color: active ? "var(--color-primary)" : "var(--color-muted-foreground)",
              letterSpacing: "0.04em",
            }}
            aria-pressed={active}
            data-name={name}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: active ? "var(--color-primary)" : "transparent", border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}` }} />
            {opt}
          </button>
        );
      })}
    </div>
  );
}