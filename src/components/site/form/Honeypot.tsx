import { HONEYPOT_FIELD } from "@/lib/forms-config";

/**
 * Visually hidden honeypot input. Bots that auto-fill all fields will populate
 * this; future server/CF7 validation should reject any submission where this is
 * non-empty. Keep `tabIndex={-1}` and `autoComplete="off"` so real users skip it.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        type="text"
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}