const LOCK_CLASSES = [
  "menu-open",
  "mobile-menu-open",
  "nav-open",
  "overlay-lock",
  "modal-open",
  "ivan-cf7-modal-open",
  "dialog-open",
  "drawer-open",
];

let safetyNetInstalled = false;

type DebugWindow = Window & {
  IvanTheme?: unknown;
  wpcf7?: unknown;
};

export function unlockBodyInteraction() {
  if (typeof document === "undefined") return;

  const elements = [document.body, document.documentElement].filter(Boolean);
  for (const el of elements) {
    el.style.overflow = "";
    el.style.overflowX = "";
    el.style.overflowY = "";
    el.style.touchAction = "";
    for (const className of LOCK_CLASSES) {
      el.classList.remove(className);
    }
  }
}

function readRoute() {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getElementLabel(el: Element | null) {
  if (!el) return "none";
  const id = el.id ? `#${el.id}` : "";
  const classes =
    typeof (el as HTMLElement).className === "string"
      ? `.${(el as HTMLElement).className.trim().replace(/\s+/g, ".")}`
      : "";
  return `${el.tagName.toLowerCase()}${id}${classes}`.slice(0, 180);
}

function collectDebugSnapshot() {
  const centerX = Math.max(0, Math.floor(window.innerWidth / 2));
  const centerY = Math.max(0, Math.floor(window.innerHeight / 2));
  const centerElement = document.elementFromPoint(centerX, centerY);
  const largeFixedElements = Array.from(document.body.querySelectorAll<HTMLElement>("*"))
    .filter((el) => {
      if (el.id === "ivan-debug-panel") return false;
      const style = window.getComputedStyle(el);
      if (style.position !== "fixed" || style.pointerEvents === "none") return false;
      const rect = el.getBoundingClientRect();
      return rect.width >= window.innerWidth * 0.7 && rect.height >= window.innerHeight * 0.7;
    })
    .map(getElementLabel);
  const debugWindow = window as DebugWindow;

  return {
    route: readRoute(),
    bodyOverflow: document.body.style.overflow || "(empty)",
    bodyOverflowX: document.body.style.overflowX || "(empty)",
    bodyOverflowY: document.body.style.overflowY || "(empty)",
    bodyTouchAction: document.body.style.touchAction || "(empty)",
    htmlOverflow: document.documentElement.style.overflow || "(empty)",
    htmlOverflowX: document.documentElement.style.overflowX || "(empty)",
    htmlOverflowY: document.documentElement.style.overflowY || "(empty)",
    htmlTouchAction: document.documentElement.style.touchAction || "(empty)",
    centerElement: getElementLabel(centerElement),
    largeFixedCount: largeFixedElements.length,
    largeFixedElements,
    hasWpcf7: Boolean(debugWindow.wpcf7),
    hasIvanThemeForms: Boolean(
      debugWindow.IvanTheme &&
        typeof debugWindow.IvanTheme === "object" &&
        "forms" in debugWindow.IvanTheme,
    ),
  };
}

function installDebugProbe() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("ivan_debug") !== "1") return;

  let panel = document.getElementById("ivan-debug-panel") as HTMLPreElement | null;
  if (!panel) {
    panel = document.createElement("pre");
    panel.id = "ivan-debug-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.style.position = "fixed";
    panel.style.left = "8px";
    panel.style.bottom = "8px";
    panel.style.zIndex = "2147483647";
    panel.style.maxWidth = "min(92vw, 620px)";
    panel.style.maxHeight = "45vh";
    panel.style.overflow = "auto";
    panel.style.margin = "0";
    panel.style.padding = "10px";
    panel.style.border = "1px solid rgba(212, 175, 55, 0.65)";
    panel.style.background = "rgba(0, 0, 0, 0.82)";
    panel.style.color = "#d4af37";
    panel.style.font = "12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    panel.style.whiteSpace = "pre-wrap";
    panel.style.pointerEvents = "none";
    document.body.appendChild(panel);
  }

  const update = () => {
    const snapshot = collectDebugSnapshot();
    panel.textContent = JSON.stringify(snapshot, null, 2);
    // eslint-disable-next-line no-console
    console.info("[ivan-debug]", snapshot);
  };

  update();
  window.setTimeout(update, 0);
  window.setInterval(update, 1500);
}

function queueUnlock() {
  unlockBodyInteraction();
  if (typeof window === "undefined") return;
  window.setTimeout(unlockBodyInteraction, 0);
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(unlockBodyInteraction);
  }
}

export function installInteractionSafetyNet() {
  if (safetyNetInstalled || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  safetyNetInstalled = true;

  const unlock = () => queueUnlock();
  window.addEventListener("pagehide", unlock);
  window.addEventListener("popstate", unlock);
  window.addEventListener("beforeunload", unlock);
  document.addEventListener("visibilitychange", unlock);

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = ((...args: Parameters<History["pushState"]>) => {
    const result = originalPushState(...args);
    queueUnlock();
    return result;
  }) as History["pushState"];

  window.history.replaceState = ((...args: Parameters<History["replaceState"]>) => {
    const result = originalReplaceState(...args);
    queueUnlock();
    return result;
  }) as History["replaceState"];

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installDebugProbe, { once: true });
  } else {
    installDebugProbe();
  }
}
