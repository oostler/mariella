// Daily Wooma — the personalized morning briefing (the habit-forming heart of the MVP).

import { state, getLog, todayIso, fmtDateLong, recordPeriodStart } from "../store";
import { cycleStatus } from "../engine/cycle";
import { PHASES, RECOMMENDATIONS, EVIDENCE_LABEL, EVIDENCE_EXPLAINER, MOOD_EMOJI } from "../engine/content";
import { on, esc, toast, openSheet, closeSheet } from "../ui";
import { render, navigate } from "../main";

function greetingWord(): string {
  const h = new Date().getHours();
  if (h < 5) return "Hello, night owl";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/** Small SVG progress ring showing position in cycle. */
function phaseRing(): string {
  const s = cycleStatus();
  const p = PHASES[s.phase];
  const size = 108, r = 46, c = 2 * Math.PI * r;
  const frac = Math.min(1, s.cycleDay / state.profile.cycleLength);
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="54" cy="54" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
      <circle cx="54" cy="54" r="${r}" fill="none" stroke="${cssColor(p.color)}" stroke-width="8"
        stroke-linecap="round" stroke-dasharray="${c * frac} ${c}" transform="rotate(-90 54 54)"/>
      <text x="54" y="47" text-anchor="middle" fill="var(--text-faint)" font-size="9.5" letter-spacing="1.5" font-family="var(--font-ui)">DAY</text>
      <text x="54" y="72" text-anchor="middle" fill="var(--text)" font-size="27" font-family="var(--font-display)">${s.cycleDay}</text>
    </svg>`;
}

function cssColor(varRef: string): string {
  // resolve var(--x) for SVG stroke
  const name = varRef.match(/var\((--[a-z-]+)\)/)?.[1];
  return name ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#e0668f" : varRef;
}

export function renderToday(): string {
  const s = cycleStatus();
  const p = PHASES[s.phase];
  const log = getLog(todayIso());
  const logged = log.symptoms.length > 0 || log.mood !== undefined || log.energy !== undefined;
  const recs = RECOMMENDATIONS[s.phase];
  const showPeriodStart = s.phase !== "menstrual" && (s.isLate || s.daysToNextPeriod <= 3);

  const nextEvent = s.isLate
    ? `Period ${s.daysLate} day${s.daysLate === 1 ? "" : "s"} late`
    : s.inFertileWindow
      ? `Fertile window · ovulation ~day ${s.ovulationDay}`
      : s.daysToNextPeriod <= (state.profile.cycleLength - s.ovulationDay)
        ? `Period in ~${s.daysToNextPeriod} day${s.daysToNextPeriod === 1 ? "" : "s"}`
        : `Ovulation ~day ${s.ovulationDay}`;

  return `
  <div class="screen">
    <header class="app-header">
      <div>
        <div class="kicker">${greetingWord()}</div>
        <h1>${esc(fmtDateLong(todayIso()))}</h1>
      </div>
      <button class="icon-btn" data-action="open-settings" aria-label="Settings">⚙︎</button>
    </header>

    <div class="hero" style="--hero-glow: color-mix(in srgb, ${p.color} 30%, transparent);">
      <div class="ring-wrap">${phaseRing()}</div>
      <div>
        <div class="phase-name" style="color:${p.color}">${p.shortName} phase</div>
        <div class="phase-blurb">${esc(p.blurb)}</div>
        <div class="pill-row"><span class="pill"><span class="dot" style="background:${p.color}"></span>${esc(nextEvent)}</span></div>
      </div>
    </div>

    ${showPeriodStart ? `<button class="cta ghost" data-action="period-started"><span>🩸&nbsp; My period started today</span><span class="arrow">→</span></button>` : ""}

    <button class="cta" data-action="nav" data-route="log">
      <span>${logged ? `${log.mood !== undefined ? MOOD_EMOJI[log.mood - 1] : "✓"}&nbsp; Update today's log` : "How do you feel today?"}</span>
      <span class="arrow">→</span>
    </button>

    <div class="section-title">Today's biological insights</div>
    <div class="card">
      <h3>Hormones</h3>
      <p class="sub">${esc(p.hormones)}</p>
      <div class="divider"></div>
      <h3>Energy</h3>
      <p class="sub">${esc(p.energy)}</p>
      <div class="divider"></div>
      <h3>You might notice</h3>
      <div class="pill-row mt-8">${p.likelySymptoms.map((x) => `<span class="pill">${esc(x)}</span>`).join("")}</div>
    </div>

    <div class="section-title">Personalized for your ${p.shortName.toLowerCase()} phase</div>
    ${recs.map((r, i) => `
      <div class="card rec-card" id="rec-${i}">
        <div class="area" style="color:${areaColor(r.area)}">${areaIcon(r.area)} ${r.area}
          <span class="badge ${r.evidence}" data-action="evidence-info" data-ev="${r.evidence}">${EVIDENCE_LABEL[r.evidence]}</span>
        </div>
        <h3>${esc(r.title)}</h3>
        <p class="sub">${esc(r.detail)}</p>
        <button class="why-toggle" data-action="toggle-why" data-i="${i}">Why this? ↓</button>
        <div class="why">${esc(r.why)}</div>
      </div>`).join("")}

    <div class="section-title">Planning your day</div>
    <div class="card">
      <h3>Focus &amp; productivity</h3>
      <p class="sub">${esc(p.focusTip)}</p>
    </div>

    <button class="cta ghost" data-action="nav" data-route="chat">
      <span>✦&nbsp; Ask your Hormone Concierge</span><span class="arrow">→</span>
    </button>

    <div class="disclaimer-box">Wooma offers educational wellness guidance, not medical advice. Patterns and predictions are estimates that improve as you track.</div>
  </div>`;
}

function areaIcon(a: string): string {
  return a === "nutrition" ? "🥗" : a === "movement" ? "🏃‍♀️" : "🌙";
}
function areaColor(a: string): string {
  return a === "nutrition" ? "var(--teal)" : a === "movement" ? "var(--gold)" : "var(--violet)";
}

on("toggle-why", (el) => {
  const card = document.getElementById(`rec-${el.dataset.i}`);
  if (!card) return;
  card.classList.toggle("open");
  el.textContent = card.classList.contains("open") ? "Why this? ↑" : "Why this? ↓";
});

on("evidence-info", (el) => {
  const ev = el.dataset.ev as keyof typeof EVIDENCE_EXPLAINER;
  openSheet(`
    <h3 style="margin-bottom:8px;">Evidence confidence</h3>
    <p class="sub" style="margin-bottom:14px;">Wooma labels every recommendation with the strength of the research behind it — so you know not just <em>what</em>, but how confident to be.</p>
    ${(["high", "moderate", "emerging"] as const).map((k) => `
      <div class="card" style="margin-bottom:10px;${k === ev ? "border-color:var(--accent);" : ""}">
        <span class="badge ${k}">${EVIDENCE_LABEL[k]}</span>
        <p class="sub mt-8">${EVIDENCE_EXPLAINER[k]}</p>
      </div>`).join("")}
    <button class="btn-primary" data-action="close-sheet">Got it</button>`);
});

on("close-sheet", () => closeSheet());

on("period-started", () => {
  openSheet(`
    <h3 style="margin-bottom:8px;">Log period start?</h3>
    <p class="sub">This sets today as day 1 of a new cycle and recalibrates your predictions.</p>
    <button class="btn-primary" data-action="confirm-period-start">Yes, it started today</button>
    <button class="btn-text" data-action="close-sheet">Cancel</button>`);
});

on("confirm-period-start", () => {
  recordPeriodStart(todayIso());
  closeSheet();
  toast("New cycle started — predictions updated 💗");
  render();
});

// settings sheet registered in screens/settings.ts
void navigate;
