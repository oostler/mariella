// Cycle screen: Wheel · Calendar · Patterns (Cycle & Symptom Intelligence).

import { state, iso, fromIso, todayIso, fmtDate } from "../store";
import { cycleStatus, markFor, cycleStats, symptomPatterns, ovulationDayFor, phaseForDay, type PhaseId } from "../engine/cycle";
import { PHASES } from "../engine/content";
import { on, esc, openSheet } from "../ui";
import { render, navigate } from "../main";

let view: "wheel" | "calendar" | "patterns" = "wheel";

export function renderCycle(): string {
  return `
  <div class="screen">
    <header class="app-header">
      <div><div class="kicker">Your current cycle</div><h1>Cycle</h1></div>
      <span class="wordmark">wooma</span>
    </header>
    <div class="seg">
      ${(["wheel", "calendar", "patterns"] as const).map((v) =>
        `<button class="${view === v ? "active" : ""}" data-action="cycle-view" data-v="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join("")}
    </div>
    ${view === "wheel" ? wheelView() : view === "calendar" ? calendarView() : patternsView()}
  </div>`;
}

/* ---------- Wheel ---------- */

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function resolveColor(phase: PhaseId): string {
  const map: Record<PhaseId, string> = {
    menstrual: "--ph-menstrual", follicular: "--ph-follicular",
    ovulatory: "--ph-ovulatory", luteal: "--ph-luteal"
  };
  return getComputedStyle(document.documentElement).getPropertyValue(map[phase]).trim() || "#e0668f";
}

function wheelView(): string {
  const s = cycleStatus();
  const { cycleLength, periodLength } = state.profile;
  const p = PHASES[s.phase];
  const size = 300, cx = 150, cy = 150, r = 122;
  const dayAngle = 360 / cycleLength;
  const gap = Math.min(3, dayAngle * 0.25);

  // Phase arcs
  const segments: { phase: PhaseId; from: number; to: number }[] = [];
  let segStart = 1;
  let current = phaseForDay(1, cycleLength, periodLength);
  for (let d = 2; d <= cycleLength + 1; d++) {
    const ph = d <= cycleLength ? phaseForDay(d, cycleLength, periodLength) : null;
    if (ph !== current) {
      segments.push({ phase: current, from: segStart, to: d - 1 });
      if (ph) { current = ph; segStart = d; }
    }
  }

  const arcs = segments.map((seg) => {
    const a0 = (seg.from - 1) * dayAngle + gap / 2;
    const a1 = seg.to * dayAngle - gap / 2;
    return `<path d="${arcPath(cx, cy, r, a0, a1)}" stroke="${resolveColor(seg.phase)}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  }).join("");

  // Day ticks
  const ticks = Array.from({ length: cycleLength }, (_, i) => {
    const [x, y] = polar(cx, cy, r - 20, (i + 0.5) * dayAngle);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="rgba(255,255,255,0.22)"/>`;
  }).join("");

  // Current day marker
  const dayIdx = Math.min(s.cycleDay, cycleLength) - 1;
  const [mx, my] = polar(cx, cy, r, (dayIdx + 0.5) * dayAngle);
  const marker = `
    <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="13" fill="#fff"/>
    <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="13" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="5"/>
    <text x="${mx.toFixed(1)}" y="${(my + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#17090f">${s.cycleDay}</text>`;

  // Ovulation star
  const ovu = ovulationDayFor(cycleLength);
  const [ox, oy] = polar(cx, cy, r, (ovu - 0.5) * dayAngle);
  const ovuMark = `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="4.5" fill="var(--ph-ovulatory)"/>`;

  const statusLine = s.isLate
    ? `Your period is <strong>${s.daysLate} day${s.daysLate === 1 ? "" : "s"} late</strong>`
    : `Next period predicted <strong>${fmtDate(s.nextPeriodDate)}</strong>`;

  return `
    <div class="card" style="padding:18px 12px;">
      <div class="wheel-wrap" style="position:relative;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          ${arcs}${ticks}${ovuMark}${marker}
        </svg>
        <div class="wheel-center" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
          <div class="day-label">Cycle day</div>
          <div class="day-num">${s.cycleDay}</div>
          <div class="phase" style="color:${PHASES[s.phase].color}">${PHASES[s.phase].shortName}</div>
        </div>
      </div>
      <p class="sub" style="text-align:center;margin-top:6px;">${statusLine}</p>
    </div>

    <div class="cal-legend" style="justify-content:center;">
      ${(Object.keys(PHASES) as PhaseId[]).map((k) => `<span><i style="background:${PHASES[k].color}"></i>${PHASES[k].shortName}</span>`).join("")}
    </div>

    <div class="card">
      <h3 style="color:${p.color}">${p.name}</h3>
      <p class="sub">${esc(p.hormones)}</p>
      <div class="divider"></div>
      <p class="sub"><strong style="color:var(--text)">Mood:</strong> ${esc(p.mood)}</p>
      <p class="sub mt-8"><strong style="color:var(--text)">Best for:</strong> ${esc(p.focusTip)}</p>
    </div>

    ${s.inFertileWindow ? `<div class="card" style="border-color:rgb(95 184 173 / 45%);"><h3 style="color:var(--teal)">Fertile window</h3><p class="sub">Estimated days ${s.fertileStart}–${s.fertileEnd} of your cycle. Calendar estimates are approximate — not suitable for contraception.</p></div>` : ""}`;
}

/* ---------- Calendar ---------- */

function calendarView(): string {
  const now = new Date();
  const months = [0, 1, 2].map((off) => monthGrid(new Date(now.getFullYear(), now.getMonth() + off, 1)));
  return `
    <div class="cal-legend">
      <span><i style="background:var(--ph-menstrual)"></i>Period</span>
      <span><i style="border:1.5px dashed rgb(224 92 114 / 70%);background:none;"></i>Predicted</span>
      <span><i style="background:rgb(95 184 173 / 45%)"></i>Fertile</span>
      <span><i style="background:var(--gold)"></i>Logged</span>
    </div>
    ${months.join("")}`;
}

function monthGrid(first: Date): string {
  const year = first.getFullYear(), month = first.getMonth();
  const label = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayIso();

  let cells = `<div class="cal-grid">`;
  for (const d of ["S", "M", "T", "W", "T", "F", "S"]) cells += `<div class="cal-dow">${d}</div>`;
  for (let i = 0; i < startDow; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateIso = iso(new Date(year, month, d));
    const m = markFor(dateIso);
    const log = state.logs[dateIso];
    const hasLog = !!log && (log.symptoms.length > 0 || log.mood !== undefined || log.energy !== undefined || (log.flow && log.flow !== "none"));
    const cls = [
      "cal-day",
      m.period ? "period" : m.predictedPeriod ? "predicted" : m.fertile ? "fertile" : "",
      m.ovulation ? "ovu" : "",
      dateIso === today ? "today" : "",
      hasLog ? "logged" : ""
    ].filter(Boolean).join(" ");
    cells += `<div class="${cls}" data-action="cal-day" data-date="${dateIso}">${d}</div>`;
  }
  cells += `</div>`;
  return `<div class="cal-month"><h3>${label}</h3>${cells}</div>`;
}

/* ---------- Patterns ---------- */

function hormoneCurves(): string {
  // Stylized hormone curves across one cycle (educational illustration).
  const w = 320, h = 120, len = state.profile.cycleLength;
  const x = (day: number) => (day / len) * w;
  const ovu = ovulationDayFor(len);
  const estrogen = `M ${x(0)} 100 C ${x(ovu * 0.5)} 95, ${x(ovu * 0.72)} 18, ${x(ovu - 1)} 14 C ${x(ovu + 1)} 30, ${x(ovu + 2)} 78, ${x(ovu + 4)} 72 C ${x(ovu + 7)} 46, ${x(len - 4)} 52, ${x(len)} 96`;
  const progesterone = `M ${x(0)} 104 C ${x(ovu * 0.6)} 106, ${x(ovu)} 102, ${x(ovu + 2)} 88 C ${x(ovu + 5)} 38, ${x(len - 5)} 34, ${x(len)} 100`;
  const testosterone = `M ${x(0)} 92 C ${x(ovu * 0.6)} 88, ${x(ovu - 2)} 62, ${x(ovu)} 60 C ${x(ovu + 3)} 66, ${x(len - 6)} 84, ${x(len)} 90`;
  const [cx] = [x(Math.min(cycleStatus().cycleDay, len))];
  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;">
      <line x1="${cx}" y1="6" x2="${cx}" y2="112" stroke="rgba(255,255,255,0.25)" stroke-dasharray="3 4"/>
      <path d="${estrogen}" fill="none" stroke="var(--accent-soft)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="${progesterone}" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="${testosterone}" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <text x="${cx + 5}" y="14" font-size="9" fill="var(--text-faint)">today</text>
    </svg>
    <div class="hormone-legend">
      <span><i style="background:var(--accent-soft)"></i>Estrogen</span>
      <span><i style="background:var(--gold)"></i>Progesterone</span>
      <span><i style="background:var(--teal)"></i>Testosterone</span>
    </div>`;
}

function patternsView(): string {
  const stats = cycleStats();
  const pats = symptomPatterns();
  const logCount = Object.values(state.logs).filter((l) => l.symptoms.length || l.mood !== undefined).length;
  return `
    <div class="stat-grid">
      <div class="stat"><div class="num">${stats.avgCycleLength ?? state.profile.cycleLength}<small> days</small></div><div class="label">${stats.avgCycleLength ? "Avg cycle (tracked)" : "Cycle length (setting)"}</div></div>
      <div class="stat"><div class="num">${stats.cycleVariation ?? "–"}<small>${stats.cycleVariation !== null ? " days" : ""}</small></div><div class="label">Cycle variation</div></div>
      <div class="stat"><div class="num">${state.profile.periodLength}<small> days</small></div><div class="label">Period length</div></div>
      <div class="stat"><div class="num">${stats.cyclesTracked}</div><div class="label">Cycles tracked</div></div>
    </div>

    <div class="card">
      <h3>Hormones across your cycle</h3>
      <p class="sub mb-8">A stylized view of the hormonal weather behind your days.</p>
      ${hormoneCurves()}
    </div>

    <div class="card">
      <h3>Symptom patterns</h3>
      ${pats.length
        ? pats.map((p) => `<p class="sub mt-8">• <strong style="color:var(--text)">${esc(p.symptom)}</strong> logged ${p.count}× in your ${PHASES[p.phase].shortName.toLowerCase()} phase</p>`).join("")
        : `<p class="sub">We don't have enough data yet to find a pattern. Keep logging symptoms every day to unlock your insights.</p>
           <button class="chip mt-16" data-action="nav" data-route="log" style="border-color:var(--accent-deep);color:var(--accent-soft);">＋ Log symptoms</button>`}
      ${logCount > 0 && pats.length === 0 ? `<p class="muted mt-8">${logCount} day${logCount === 1 ? "" : "s"} logged so far — patterns appear once a symptom repeats in the same phase.</p>` : ""}
    </div>

    <div class="card">
      <h3>Why patterns matter</h3>
      <p class="sub">The goal isn't to assume every woman experiences her cycle the same way — it's to learn <em>your</em> patterns. Once Wooma sees a symptom repeat at the same cycle point, it can warn you ahead of time and tailor that day's guidance.</p>
    </div>`;
}

/* ---------- events ---------- */

on("cycle-view", (el) => {
  view = el.dataset.v as typeof view;
  render();
});

on("cal-day", (el) => {
  const dateIso = el.dataset.date!;
  const m = markFor(dateIso);
  const log = state.logs[dateIso];
  const d = fromIso(dateIso);
  const start = fromIso(state.profile.lastPeriodStart);
  const dayNum = Math.floor((d.getTime() - start.getTime()) / 86400000) % state.profile.cycleLength + 1;
  const phaseInfo = m.phase ? PHASES[m.phase] : null;
  const logged = log && (log.symptoms.length || log.mood !== undefined || (log.flow && log.flow !== "none"));

  openSheet(`
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <h3>${esc(fmtDate(dateIso))}</h3>
      ${dayNum > 0 ? `<span class="muted">Cycle day ${dayNum}</span>` : ""}
    </div>
    ${phaseInfo ? `<span class="pill mt-8"><span class="dot" style="background:${phaseInfo.color}"></span>${phaseInfo.name}${m.predictedPeriod ? " · predicted period" : ""}${m.ovulation ? " · est. ovulation" : ""}</span>` : ""}
    <div class="divider"></div>
    ${logged
      ? `${log!.mood !== undefined ? `<p class="sub">Mood: ${["😞", "😕", "😐", "🙂", "😄"][log!.mood! - 1]}</p>` : ""}
         ${log!.energy !== undefined ? `<p class="sub">Energy: ${log!.energy}/5</p>` : ""}
         ${log!.flow && log!.flow !== "none" ? `<p class="sub">Flow: ${log!.flow}</p>` : ""}
         ${log!.symptoms.length ? `<div class="pill-row mt-8">${log!.symptoms.map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>` : ""}`
      : `<p class="sub" style="text-align:center;padding:16px 0;">No experiences tracked</p>`}
    <button class="btn-primary" data-action="track-day" data-date="${dateIso}">Track</button>`);
});

on("track-day", (el) => {
  sessionStorage.setItem("wooma-log-date", el.dataset.date!);
  navigate("log");
  document.querySelector(".sheet-backdrop")?.remove();
});
