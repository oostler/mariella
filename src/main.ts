import "./style.css";
import { state } from "./store";
import { initDelegation } from "./ui";
import { renderOnboarding } from "./screens/onboarding";
import { renderToday } from "./screens/today";
import { renderCycle } from "./screens/cycle";
import { renderLog } from "./screens/log";
import { renderChat } from "./screens/chat";
import { renderFood } from "./screens/food";
import "./screens/settings";

export type Route = "today" | "cycle" | "log" | "chat" | "food" | "onboarding";

const app = document.getElementById("app")!;

const TABS: { route: Route; icon: string; label: string }[] = [
  { route: "today", icon: "☀️", label: "Today" },
  { route: "cycle", icon: "◌", label: "Cycle" },
  { route: "log", icon: "+", label: "Track" },
  { route: "chat", icon: "✦", label: "Concierge" },
  { route: "food", icon: "🥣", label: "Food" }
];

function currentRoute(): Route {
  const hash = location.hash.replace(/^#\/?/, "") as Route;
  if (!state.profile.onboarded) return "onboarding";
  return (["today", "cycle", "log", "chat", "food"] as Route[]).includes(hash) ? hash : "today";
}

export function navigate(route: Route): void {
  if (location.hash === `#/${route}`) render();
  else location.hash = `#/${route}`;
}

export function render(): void {
  const route = currentRoute();
  window.scrollTo(0, 0);

  if (route === "onboarding") {
    app.innerHTML = renderOnboarding();
    return;
  }

  const screens: Record<string, () => string> = {
    today: renderToday,
    cycle: renderCycle,
    log: renderLog,
    chat: renderChat,
    food: renderFood
  };

  const tabbar = `
    <nav class="tabbar">
      ${TABS.map((t) => `
        <button class="${t.route === "log" ? "track-btn" : ""} ${route === t.route ? "active" : ""}"
                data-action="nav" data-route="${t.route}">
          <span class="ic">${t.icon}</span><span>${t.label}</span>
        </button>`).join("")}
    </nav>`;

  app.innerHTML = screens[route]() + tabbar;

  // Screens can register a post-render hook via data attribute on first element
  document.dispatchEvent(new CustomEvent("screen:mounted", { detail: { route } }));
}

import { on } from "./ui";
on("nav", (el) => navigate(el.dataset.route as Route));

initDelegation();
window.addEventListener("hashchange", render);
render();
