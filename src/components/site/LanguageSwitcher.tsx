import { useEffect, useState } from "react";

const KEY = "ij_lang_v1";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<"SR" | "EN">("SR");
  useEffect(() => {
    const v = (typeof window !== "undefined" && localStorage.getItem(KEY)) as "SR" | "EN" | null;
    if (v) setLang(v);
  }, []);
  function toggle(v: "SR" | "EN") {
    setLang(v);
    if (typeof window !== "undefined") localStorage.setItem(KEY, v);
    // PLACEHOLDER: full translation pipeline arrives in Phase 2 (WP multilingual mapping)
  }
  return (
    <div className="inline-flex items-center gap-1 text-xs">
      {(["SR", "EN"] as const).map((v) => (
        <button
          key={v}
          onClick={() => toggle(v)}
          className="px-2 py-1 rounded-md tracking-widest"
          style={{
            color: lang === v ? "var(--color-primary)" : "var(--color-muted-foreground)",
            border: lang === v ? "1px solid color-mix(in oklab, var(--color-primary) 50%, transparent)" : "1px solid transparent",
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}