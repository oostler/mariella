// Food — Personalized Nutrition Intelligence: phase-based meals, craving support, grocery list.

import { state, save } from "../store";
import { cycleStatus } from "../engine/cycle";
import { PHASES, MEALS, CRAVING_SUPPORT, RECOMMENDATIONS, EVIDENCE_LABEL } from "../engine/content";
import { on, esc, toast } from "../ui";
import { render } from "../main";

export function renderFood(): string {
  const s = cycleStatus();
  const p = PHASES[s.phase];
  const meals = MEALS[s.phase];
  const nutriRec = RECOMMENDATIONS[s.phase].find((r) => r.area === "nutrition")!;

  return `
  <div class="screen">
    <header class="app-header">
      <div><div class="kicker">Nutrition intelligence</div><h1>Food</h1></div>
      <span class="wordmark">wooma</span>
    </header>

    <div class="card" style="border-color:color-mix(in srgb, ${p.color} 45%, var(--line));">
      <div class="area" style="color:${p.color};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;display:flex;align-items:center;gap:8px;">
        ${p.shortName} phase focus
        <span class="badge ${nutriRec.evidence}">${EVIDENCE_LABEL[nutriRec.evidence]}</span>
      </div>
      <h3 class="mt-8">${esc(nutriRec.title)}</h3>
      <p class="sub">${esc(nutriRec.why)}</p>
    </div>

    <div class="card" style="background:linear-gradient(150deg, var(--card-2), var(--card));">
      <h3>🍫 Craving support</h3>
      <p class="sub">${esc(CRAVING_SUPPORT[s.phase])}</p>
    </div>

    <div class="section-title">Meal ideas for this phase</div>
    ${meals.map((m, i) => `
      <div class="card meal-card">
        <span class="slot">${m.slot}</span>
        <h3>${esc(m.name)}</h3>
        <div class="tags">${m.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <button class="add-grocery" data-action="add-meal-grocery" data-i="${i}">＋ Add ingredients to grocery list</button>
      </div>`).join("")}

    <div class="section-title">Grocery list</div>
    <div class="card">
      ${state.grocery.length === 0
        ? `<p class="sub" style="text-align:center;padding:8px 0;">Your list is empty — add ingredients from any meal above.</p>`
        : state.grocery.map((g, i) => `
          <div class="grocery-item ${g.done ? "done" : ""}">
            <button class="box" data-action="grocery-toggle" data-i="${i}">${g.done ? "✓" : ""}</button>
            <span class="name">${esc(g.name)}</span>
            <button class="rm" data-action="grocery-rm" data-i="${i}">×</button>
          </div>`).join("")}
      ${state.grocery.length ? `<button class="chip mt-16" data-action="grocery-clear">Clear checked</button>` : ""}
    </div>

    <div class="disclaimer-box">Meal guidance is general wellness support tuned to your cycle phase — always adapt to your own dietary needs, preferences and any medical guidance you follow.</div>
  </div>`;
}

on("add-meal-grocery", (el) => {
  const s = cycleStatus();
  const meal = MEALS[s.phase][Number(el.dataset.i)];
  if (!meal) return;
  let added = 0;
  for (const ing of meal.ingredients) {
    if (!state.grocery.some((g) => g.name === ing)) {
      state.grocery.push({ name: ing, done: false });
      added++;
    }
  }
  save();
  toast(added ? `Added ${added} ingredient${added === 1 ? "" : "s"} 🛒` : "Already on your list ✓");
  render();
});

on("grocery-toggle", (el) => {
  const item = state.grocery[Number(el.dataset.i)];
  if (item) { item.done = !item.done; save(); render(); }
});

on("grocery-rm", (el) => {
  state.grocery.splice(Number(el.dataset.i), 1);
  save();
  render();
});

on("grocery-clear", () => {
  state.grocery = state.grocery.filter((g) => !g.done);
  save();
  render();
});
