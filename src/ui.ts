// Small UI utilities: rendering, sheets, toasts, event delegation.

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Minimal markdown: **bold** and newlines. */
export function md(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function toast(msg: string): void {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

export function openSheet(html: string): void {
  closeSheet();
  const backdrop = document.createElement("div");
  backdrop.className = "sheet-backdrop";
  backdrop.innerHTML = `<div class="sheet"><div class="grab"></div>${html}</div>`;
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeSheet();
  });
  document.body.appendChild(backdrop);
}

export function closeSheet(): void {
  document.querySelector(".sheet-backdrop")?.remove();
}

type Handler = (el: HTMLElement, e: Event) => void;
const actions = new Map<string, Handler>();

/** Register a named click action, used via data-action="name" (+ data-* payload). */
export function on(action: string, fn: Handler): void {
  actions.set(action, fn);
}

export function initDelegation(): void {
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!target) return;
    const fn = actions.get(target.dataset.action!);
    if (fn) fn(target, e);
  });
}
