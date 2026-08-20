// Track screen — symptoms, mood, energy, flow, sleep, notes for a given day.

import { getLog, setLog, todayIso, fmtDateLong, type Flow } from "../store";
import { SYMPTOMS, MOOD_EMOJI } from "../engine/content";
import { on, esc, toast } from "../ui";
import { render, navigate } from "../main";

const FLOWS: Flow[] = ["none", "spotting", "light", "medium", "heavy"];

function activeDate(): string {
  return sessionStorage.getItem("wooma-log-date") ?? todayIso();
}

export function renderLog(): string {
  const date = activeDate();
  const log = getLog(date);
  const isToday = date === todayIso();

  return `
  <div class="screen">
    <header class="app-header">
      <div>
        <div class="kicker">${isToday ? "Tracking today" : "Tracking"}</div>
        <h1>${esc(fmtDateLong(date))}</h1>
      </div>
      ${!isToday ? `<button class="icon-btn" data-action="log-today" title="Jump to today">↩</button>` : ""}
    </header>

    <div class="section-title">Mood</div>
    <div class="scale-row">
      ${MOOD_EMOJI.map((e, i) => `<button class="${log.mood === i + 1 ? "on" : ""}" data-action="log-mood" data-v="${i + 1}">${e}</button>`).join("")}
    </div>

    <div class="section-title">Energy</div>
    <div class="scale-row nums">
      ${[1, 2, 3, 4, 5].map((n) => `<button class="${log.energy === n ? "on" : ""}" data-action="log-energy" data-v="${n}">${n}</button>`).join("")}
    </div>

    <div class="section-title">Flow</div>
    <div class="chip-row">
      ${FLOWS.map((f) => `<button class="chip ${log.flow === f ? "on" : ""}" data-action="log-flow" data-v="${f}">${f === "none" ? "No flow" : f[0].toUpperCase() + f.slice(1)}</button>`).join("")}
    </div>

    <div class="section-title">Symptoms</div>
    <div class="chip-row">
      ${SYMPTOMS.map((s) => `<button class="chip ${log.symptoms.includes(s) ? "on" : ""}" data-action="log-symptom" data-v="${esc(s)}">${esc(s)}</button>`).join("")}
    </div>

    <div class="section-title">Sleep last night</div>
    <div class="chip-row">
      ${[5, 6, 7, 8, 9].map((h) => `<button class="chip ${log.sleepHours === h ? "on" : ""}" data-action="log-sleep" data-v="${h}">${h === 5 ? "≤5" : h === 9 ? "9+" : h}h</button>`).join("")}
    </div>

    <div class="section-title">Notes</div>
    <textarea class="note" id="log-note" placeholder="Anything else worth remembering about today…">${esc(log.note ?? "")}</textarea>

    <button class="cta mt-16" data-action="log-save"><span>Save today's log</span><span class="arrow">✓</span></button>
    <p class="muted" style="text-align:center;">Saved privately on this device. The more you log, the smarter your guidance gets.</p>
  </div>`;
}

function update(mutate: (log: ReturnType<typeof getLog>) => void): void {
  const log = getLog(activeDate());
  const note = (document.getElementById("log-note") as HTMLTextAreaElement | null)?.value;
  if (note !== undefined) log.note = note;
  mutate(log);
  setLog(log);
  render();
}

on("log-mood", (el) => update((l) => { l.mood = l.mood === Number(el.dataset.v) ? undefined : Number(el.dataset.v); }));
on("log-energy", (el) => update((l) => { l.energy = l.energy === Number(el.dataset.v) ? undefined : Number(el.dataset.v); }));
on("log-flow", (el) => update((l) => { l.flow = l.flow === el.dataset.v ? undefined : el.dataset.v as Flow; }));
on("log-sleep", (el) => update((l) => { l.sleepHours = l.sleepHours === Number(el.dataset.v) ? undefined : Number(el.dataset.v); }));
on("log-symptom", (el) => update((l) => {
  const s = el.dataset.v!;
  l.symptoms = l.symptoms.includes(s) ? l.symptoms.filter((x) => x !== s) : [...l.symptoms, s];
}));

on("log-save", () => {
  update(() => { /* note captured in update() */ });
  toast("Logged 💗 Your guidance just got smarter");
  sessionStorage.removeItem("wooma-log-date");
  navigate("today");
});

on("log-today", () => {
  sessionStorage.removeItem("wooma-log-date");
  render();
});
