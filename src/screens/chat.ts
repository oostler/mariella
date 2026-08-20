// Hormone Concierge — chat UI.

import { state, save } from "../store";
import { greeting, respond } from "../engine/concierge";
import { on, esc, md } from "../ui";
import { render, navigate } from "../main";

export function renderChat(): string {
  if (state.chat.length === 0) {
    const g = greeting();
    state.chat.push({ role: "bot", text: g.text, chips: g.chips, time: Date.now() });
    state.chatTopic = g.topic;
    save();
  }

  const msgs = state.chat.map((m, i) => {
    if (m.role === "user") return `<div class="msg user">${esc(m.text)}</div>`;
    const isLast = i === state.chat.length - 1;
    return `
      <div class="msg bot">
        <div class="bot-name">✦ Concierge</div>
        <div class="bubble">${md(m.text)}</div>
      </div>
      ${isLast && m.chips?.length ? `<div class="chat-chips">${m.chips.map((c) =>
        `<button class="chip" data-action="chat-chip" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}`;
  }).join("");

  setTimeout(() => {
    const sc = document.getElementById("chat-scroll");
    if (sc) sc.scrollTop = sc.scrollHeight;
    document.getElementById("chat-input")?.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") sendCurrent();
    });
  }, 0);

  return `
  <div class="screen chat-screen">
    <header class="app-header">
      <div><div class="kicker">Hormone Concierge</div><h1>Ask Wooma</h1></div>
      <button class="icon-btn" data-action="chat-clear" title="New conversation">✎</button>
    </header>
    <div class="chat-scroll" id="chat-scroll">${msgs}</div>
    <div class="chat-input-bar">
      <div class="row">
        <input id="chat-input" type="text" placeholder="Ask about food, energy, symptoms…" autocomplete="off" />
        <button class="send-btn" data-action="chat-send">↑</button>
      </div>
      <div class="chat-disclaimer">Concierge can make mistakes. Educational support — not medical advice.</div>
    </div>
  </div>`;
}

function pushUser(text: string): void {
  state.chat.push({ role: "user", text, time: Date.now() });
  save();
  render();

  // typing indicator, then reply
  setTimeout(() => {
    const sc = document.getElementById("chat-scroll");
    if (sc) {
      const t = document.createElement("div");
      t.className = "msg bot";
      t.innerHTML = `<div class="bot-name">✦ Concierge</div><div class="bubble typing"><i></i><i></i><i></i></div>`;
      sc.appendChild(t);
      sc.scrollTop = sc.scrollHeight;
    }
  }, 60);

  setTimeout(() => {
    const r = respond(text);
    // "Log symptoms" chip routes instead of chatting
    state.chat.push({ role: "bot", text: r.text, chips: r.chips, time: Date.now() });
    state.chatTopic = r.topic;
    if (state.chat.length > 80) state.chat = state.chat.slice(-80);
    save();
    render();
  }, 900 + Math.random() * 500);
}

function sendCurrent(): void {
  const input = document.getElementById("chat-input") as HTMLInputElement | null;
  const text = input?.value.trim();
  if (!text) return;
  input!.value = "";
  pushUser(text);
}

on("chat-send", sendCurrent);

on("chat-chip", (el) => {
  const q = el.dataset.q!;
  if (q === "Log symptoms") { navigate("log"); return; }
  pushUser(q);
});

on("chat-clear", () => {
  state.chat = [];
  state.chatTopic = undefined;
  save();
  render();
});
