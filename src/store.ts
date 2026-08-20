// Wooma state — persisted locally on this device only (privacy-first: no server, no accounts).

export type ChatStyle = "detailed" | "direct";
export type Flow = "none" | "spotting" | "light" | "medium" | "heavy";

export interface Profile {
  lastPeriodStart: string; // ISO date of most recent period start
  cycleLength: number;     // days
  periodLength: number;    // days
  goals: string[];
  chatStyle: ChatStyle;
  onboarded: boolean;
}

export interface DayLog {
  date: string; // ISO date
  mood?: number; // 1..5
  energy?: number; // 1..5
  flow?: Flow;
  symptoms: string[];
  sleepHours?: number;
  note?: string;
}

export interface ChatMsg {
  role: "user" | "bot";
  text: string;
  chips?: string[];
  time: number;
}

export interface GroceryItem {
  name: string;
  done: boolean;
}

export interface State {
  profile: Profile;
  periodStarts: string[]; // history, ISO dates, ascending
  logs: Record<string, DayLog>;
  chat: ChatMsg[];
  chatTopic?: string; // last concierge topic, for "why?" follow-ups
  grocery: GroceryItem[];
}

const KEY = "wooma-state-v1";

function defaults(): State {
  return {
    profile: {
      lastPeriodStart: iso(addDays(new Date(), -6)),
      cycleLength: 28,
      periodLength: 5,
      goals: [],
      chatStyle: "detailed",
      onboarded: false
    },
    periodStarts: [],
    logs: {},
    chat: [],
    grocery: []
  };
}

export let state: State = load();

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as State;
    return { ...defaults(), ...parsed, profile: { ...defaults().profile, ...parsed.profile } };
  } catch {
    return defaults();
  }
}

export function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — app still works for the session */
  }
}

export function resetState(): void {
  state = defaults();
  save();
}

export function getLog(date: string): DayLog {
  return state.logs[date] ?? { date, symptoms: [] };
}

export function setLog(log: DayLog): void {
  state.logs[log.date] = log;
  save();
}

export function recordPeriodStart(date: string): void {
  if (!state.periodStarts.includes(date)) {
    state.periodStarts.push(date);
    state.periodStarts.sort();
  }
  state.profile.lastPeriodStart = state.periodStarts[state.periodStarts.length - 1];
  save();
}

// ---- date helpers ----

export function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime() -
    new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  return Math.round(ms / 86400000);
}

export function todayIso(): string {
  return iso(new Date());
}

export function fmtDate(s: string): string {
  return fromIso(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fmtDateLong(s: string): string {
  return fromIso(s).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
