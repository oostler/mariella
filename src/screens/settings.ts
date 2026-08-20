// Settings sheet — cycle parameters, chat style, data ownership (export / erase).

import { state, save, resetState, todayIso } from "../store";
import { on, toast, openSheet, closeSheet } from "../ui";
import { render } from "../main";

on("open-settings", () => {
  const p = state.profile;
  openSheet(`
    <h3 style="margin-bottom:14px;">Settings</h3>

    <div class="card">
      <h3 style="font-size:15px;">Cycle length</h3>
      <div class="stepper mt-8">
        <button data-action="set-cycle" data-d="-1">−</button>
        <div class="val" id="set-cycle-val">${p.cycleLength}<small>days</small></div>
        <button data-action="set-cycle" data-d="1">+</button>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:15px;">Period length</h3>
      <div class="stepper mt-8">
        <button data-action="set-period" data-d="-1">−</button>
        <div class="val" id="set-period-val">${p.periodLength}<small>days</small></div>
        <button data-action="set-period" data-d="1">+</button>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:15px;">Concierge style</h3>
      <div class="chip-row mt-8">
        <button class="chip ${p.chatStyle === "detailed" ? "on" : ""}" data-action="set-style" data-v="detailed">Detailed</button>
        <button class="chip ${p.chatStyle === "direct" ? "on" : ""}" data-action="set-style" data-v="direct">Direct</button>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:15px;">Your data</h3>
      <p class="sub mt-8">Everything lives in this browser only. Export it as a file, or erase it completely.</p>
      <div class="chip-row mt-16">
        <button class="chip" data-action="export-data">⬇ Export JSON</button>
        <button class="chip" data-action="erase-data" style="color:var(--ph-menstrual);border-color:rgb(224 92 114 / 40%);">Erase everything</button>
      </div>
    </div>

    <p class="muted" style="text-align:center;margin-top:8px;">Wooma MVP · wellness support, not medical advice</p>
    <button class="btn-primary" data-action="close-settings">Done</button>`);
});

on("set-cycle", (el) => {
  state.profile.cycleLength = Math.min(45, Math.max(20, state.profile.cycleLength + Number(el.dataset.d)));
  save();
  const v = document.getElementById("set-cycle-val");
  if (v) v.innerHTML = `${state.profile.cycleLength}<small>days</small>`;
});

on("set-period", (el) => {
  state.profile.periodLength = Math.min(10, Math.max(1, state.profile.periodLength + Number(el.dataset.d)));
  save();
  const v = document.getElementById("set-period-val");
  if (v) v.innerHTML = `${state.profile.periodLength}<small>days</small>`;
});

on("set-style", (el) => {
  state.profile.chatStyle = el.dataset.v as "detailed" | "direct";
  save();
  document.querySelectorAll('[data-action="set-style"]').forEach((b) =>
    b.classList.toggle("on", (b as HTMLElement).dataset.v === state.profile.chatStyle));
  toast(`Concierge set to ${state.profile.chatStyle}`);
});

on("export-data", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wooma-export-${todayIso()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Data exported ⬇");
});

on("erase-data", () => {
  openSheet(`
    <h3>Erase all data?</h3>
    <p class="sub mt-8">This permanently deletes your cycle history, logs, chat and grocery list from this device. There is no server copy — this cannot be undone.</p>
    <button class="btn-primary" data-action="erase-confirm" style="background:var(--ph-menstrual);color:#fff;">Yes, erase everything</button>
    <button class="btn-text" data-action="close-settings">Cancel</button>`);
});

on("erase-confirm", () => {
  resetState();
  closeSheet();
  location.hash = "";
  render();
});

on("close-settings", () => {
  closeSheet();
  render();
});
