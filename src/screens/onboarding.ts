// Onboarding: welcome → safety & privacy → cycle basics → goals → chat style.

import { state, save, recordPeriodStart, iso, addDays, todayIso } from "../store";
import { GOALS } from "../engine/content";
import { on, esc } from "../ui";
import { render } from "../main";

interface OnbDraft {
  step: number;
  lastPeriod: string;
  cycleLength: number;
  periodLength: number;
  goals: string[];
  chatStyle: "detailed" | "direct";
}

const draft: OnbDraft = {
  step: 0,
  lastPeriod: iso(addDays(new Date(), -6)),
  cycleLength: 28,
  periodLength: 5,
  goals: [],
  chatStyle: "detailed"
};

const TOTAL_STEPS = 5;

function dots(): string {
  return `<div class="step-dots">${Array.from({ length: TOTAL_STEPS }, (_, i) =>
    `<i class="${i <= draft.step ? "on" : ""}"></i>`).join("")}</div>`;
}

export function renderOnboarding(): string {
  const steps = [welcome, safety, cycleBasics, goals, chatStyle];
  return `<div class="onb">${steps[draft.step]()}</div>`;
}

function welcome(): string {
  return `
    <div class="top" style="display:flex;flex-direction:column;justify-content:center;text-align:center;">
      <div class="brand-mark">🌙</div>
      <div class="wordmark" style="font-size:34px;margin-bottom:14px;">wooma</div>
      <h1 style="font-size:26px;">Your hormones change every&nbsp;day.<br/>Your plan should&nbsp;too.</h1>
      <p class="lead mt-16">Wooma turns your cycle into practical daily guidance — what to eat, how to move, when to rest — so you can stop guessing and start understanding your body.</p>
    </div>
    <button class="btn-primary" data-action="onb-next">Get started</button>`;
}

function safety(): string {
  return `
    <div class="top">
      ${dots()}
      <div class="brand-mark">🔒</div>
      <p class="kicker" style="color:var(--text-faint);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Before we start, a few important promises</p>
      <h1>Safety &amp; Privacy First</h1>
      <h2>Support, not diagnosis</h2>
      <p class="body-text">Wooma is designed for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. If you think you may have a medical emergency, call your doctor or emergency services immediately.</p>
      <h2>Privacy commitment</h2>
      <p class="body-text">Your data never leaves this device. Everything you track is stored locally in your browser — there are no accounts, no servers, and no third parties. You own it completely, and you can erase it at any time from Settings.</p>
    </div>
    <button class="btn-primary" data-action="onb-next">I understand</button>`;
}

function cycleBasics(): string {
  return `
    <div class="top">
      ${dots()}
      <h1>Let's find where you are</h1>
      <p class="lead">Three quick details so Wooma can locate you in your cycle. Estimates are fine — everything sharpens as you track.</p>
      <div class="field">
        <label>First day of your last period</label>
        <input type="date" id="onb-date" value="${draft.lastPeriod}" max="${todayIso()}" />
      </div>
      <div class="field">
        <label>Average cycle length</label>
        <div class="stepper">
          <button data-action="onb-step" data-k="cycleLength" data-d="-1">−</button>
          <div class="val">${draft.cycleLength}<small>days</small></div>
          <button data-action="onb-step" data-k="cycleLength" data-d="1">+</button>
        </div>
      </div>
      <div class="field">
        <label>Average period length</label>
        <div class="stepper">
          <button data-action="onb-step" data-k="periodLength" data-d="-1">−</button>
          <div class="val">${draft.periodLength}<small>days</small></div>
          <button data-action="onb-step" data-k="periodLength" data-d="1">+</button>
        </div>
      </div>
    </div>
    <button class="btn-primary" data-action="onb-next">Continue</button>`;
}

function goals(): string {
  return `
    <div class="top">
      ${dots()}
      <h1>What matters most right now?</h1>
      <p class="lead">Pick as many as you like — Wooma tunes its daily guidance around them.</p>
      <div class="chip-row">
        ${GOALS.map((g) => `<button class="chip ${draft.goals.includes(g) ? "on" : ""}" data-action="onb-goal" data-goal="${esc(g)}" style="padding:12px 18px;font-size:15px;">${esc(g)}</button>`).join("")}
      </div>
    </div>
    <button class="btn-primary" data-action="onb-next">Continue</button>`;
}

function chatStyle(): string {
  return `
    <div class="top">
      ${dots()}
      <h1>How should we chat?</h1>
      <p class="lead">Choose the communication style that fits you best right now. You can switch this anytime.</p>
      <button class="choice-card ${draft.chatStyle === "detailed" ? "on" : ""}" data-action="onb-style" data-style="detailed">
        <span><span class="t">Detailed</span><div class="d">Walk me through it. Deeper explanations and longer context.</div></span>
        <span class="go">→</span>
      </button>
      <button class="choice-card ${draft.chatStyle === "direct" ? "on" : ""}" data-action="onb-style" data-style="direct">
        <span><span class="t">Direct</span><div class="d">Keep it simple. Just the key insights without the extra fluff.</div></span>
        <span class="go">→</span>
      </button>
    </div>
    <button class="btn-primary" data-action="onb-finish">Start my Wooma</button>`;
}

on("onb-next", () => {
  if (draft.step === 2) {
    const input = document.getElementById("onb-date") as HTMLInputElement | null;
    if (input?.value) draft.lastPeriod = input.value;
  }
  draft.step = Math.min(draft.step + 1, TOTAL_STEPS - 1);
  render();
});

on("onb-step", (el) => {
  const input = document.getElementById("onb-date") as HTMLInputElement | null;
  if (input?.value) draft.lastPeriod = input.value;
  const k = el.dataset.k as "cycleLength" | "periodLength";
  const d = Number(el.dataset.d);
  if (k === "cycleLength") draft.cycleLength = Math.min(45, Math.max(20, draft.cycleLength + d));
  else draft.periodLength = Math.min(10, Math.max(1, draft.periodLength + d));
  render();
});

on("onb-goal", (el) => {
  const g = el.dataset.goal!;
  draft.goals = draft.goals.includes(g) ? draft.goals.filter((x) => x !== g) : [...draft.goals, g];
  render();
});

on("onb-style", (el) => {
  draft.chatStyle = el.dataset.style as "detailed" | "direct";
  render();
});

on("onb-finish", () => {
  state.profile.lastPeriodStart = draft.lastPeriod;
  state.profile.cycleLength = draft.cycleLength;
  state.profile.periodLength = draft.periodLength;
  state.profile.goals = draft.goals;
  state.profile.chatStyle = draft.chatStyle;
  state.profile.onboarded = true;
  recordPeriodStart(draft.lastPeriod);
  save();
  location.hash = "#/today";
  render();
});
