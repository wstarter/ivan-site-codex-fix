import type { NavigateFn } from "@tanstack/react-router";

// Placeholder Meta Pixel Lead hook.
// Future: fire Meta Pixel Lead event only after successful server-confirmed
// form submission (e.g. inside CF7's `wpcf7mailsent` event or this callback
// once a real backend endpoint exists). Do NOT fire on button click.
export function trackLeadEventPlaceholder(formType?: string) {
  // eslint-disable-next-line no-console
  console.log("[META_PIXEL_LEAD_PLACEHOLDER]", formType ?? "thank_you");
}

export function handleLeadSubmit(
  formType: string,
  formData: Record<string, unknown>,
  navigate: NavigateFn,
) {
  // eslint-disable-next-line no-console
  console.log("LEAD_EVENT_PLACEHOLDER", formType, formData);
  navigate({ to: "/hvala" });
}