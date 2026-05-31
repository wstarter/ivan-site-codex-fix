import { useEffect, useRef, type ReactNode } from "react";
import { getWpForm } from "@/lib/wp-bridge";

/**
 * Cf7FormSlot
 * ----------------------------------------------------------------------------
 * Decides at runtime whether the inquiry form is powered by:
 *  - Contact Form 7 (production, server-rendered HTML from WordPress), or
 *  - the React prototype form (children fallback, used in local dev).
 *
 * CF7 HTML is rendered by PHP via `do_shortcode()` and injected by WordPress
 * into `window.IvanTheme.forms[formKey].html`. React only mounts that already
 * server-rendered HTML; React does NOT execute shortcode text and does NOT
 * bundle Contact Form 7. CF7 JavaScript ships separately from the WP plugin.
 *
 * If `cf7Active` is true AND `html` is a non-empty string, the CF7 HTML wins
 * and the children fallback is hidden. Otherwise the children render as-is.
 */
export function Cf7FormSlot({
  formKey,
  children,
}: {
  formKey: "wedding" | "corporate" | "club" | "birthday" | string;
  children: ReactNode;
}) {
  let form: ReturnType<typeof getWpForm> = null;
  try {
    form = getWpForm(formKey);
  } catch {
    form = null;
  }
  const html = typeof form?.html === "string" ? form.html.trim() : "";
  const isRawShortcode = /^\[contact-form-7\b/i.test(html);
  const useCf7 = Boolean(form?.cf7Active && html.length > 0 && !isRawShortcode);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!useCf7 || typeof window === "undefined") return;
    let cancelled = false;
    let scheduledWithRaf = false;
    let handle: number | null = null;
    const initForms = () => {
      if (cancelled) return;
      // Re-initialize CF7 for the freshly mounted form, but only if the plugin
      // is actually present at runtime. Safe no-op in local dev.
      const wpcf7 = window.wpcf7;
      if (!wpcf7 || typeof wpcf7.init !== "function") return;
      const forms = hostRef.current?.querySelectorAll<HTMLFormElement>("form.wpcf7-form");
      forms?.forEach((f) => {
        try { wpcf7.init?.(f); } catch { /* swallow: CF7 init must never break the page */ }
      });
    };

    if (typeof window.requestAnimationFrame === "function") {
      scheduledWithRaf = true;
      handle = window.requestAnimationFrame(initForms);
    } else {
      handle = window.setTimeout(initForms, 0);
    }

    return () => {
      cancelled = true;
      if (handle === null) return;
      if (scheduledWithRaf) {
        window.cancelAnimationFrame(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [useCf7, html]);

  if (useCf7) {
    return (
      <div
        ref={hostRef}
        className="cf7-slot cf7-ready form-main-panel wpcf7-host"
        data-form-key={formKey}
        // CF7 HTML is generated server-side by WordPress (do_shortcode); it is
        // trusted theme output, not user input. We mount it as-is so CF7's own
        // markup, classes, and hidden inputs (e.g. _wpcf7) survive intact.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <>{children}</>;
}
