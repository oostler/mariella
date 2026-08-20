// Cycle math — the biological layer of the Wooma Intelligence Engine.

import { state, fromIso, iso, addDays, daysBetween } from "../store";

export type PhaseId = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface CycleStatus {
  cycleDay: number;        // 1-based; can exceed cycleLength when late
  phase: PhaseId;
  isLate: boolean;
  daysLate: number;
  ovulationDay: number;    // cycle day of estimated ovulation
  fertileStart: number;    // cycle day
  fertileEnd: number;      // cycle day
  inFertileWindow: boolean;
  nextPeriodDate: string;  // ISO
  daysToNextPeriod: number; // negative if late
  nextOvulationDate: string; // ISO
  lastPeriodStart: string;
}

export function phaseForDay(cycleDay: number, cycleLength: number, periodLength: number): PhaseId {
  const ovu = ovulationDayFor(cycleLength);
  if (cycleDay <= periodLength) return "menstrual";
  if (cycleDay < ovu - 1) return "follicular";
  if (cycleDay <= ovu + 1) return "ovulatory";
  return "luteal";
}

export function ovulationDayFor(cycleLength: number): number {
  // Luteal phase is comparatively stable at ~14 days.
  return Math.max(8, cycleLength - 14);
}

export function cycleStatus(today = new Date()): CycleStatus {
  const { lastPeriodStart, cycleLength, periodLength } = state.profile;
  const start = fromIso(lastPeriodStart);
  const since = Math.max(0, daysBetween(start, today));
  const cycleDay = since + 1;
  const ovulationDay = ovulationDayFor(cycleLength);
  const isLate = cycleDay > cycleLength;
  const phase = isLate ? "luteal" : phaseForDay(cycleDay, cycleLength, periodLength);
  const fertileStart = Math.max(1, ovulationDay - 5);
  const fertileEnd = ovulationDay + 1;
  const nextPeriod = addDays(start, cycleLength);
  const nextOvu = isLate ? addDays(start, cycleLength + ovulationDay) : addDays(start, ovulationDay - 1);
  return {
    cycleDay,
    phase,
    isLate,
    daysLate: isLate ? cycleDay - cycleLength : 0,
    ovulationDay,
    fertileStart,
    fertileEnd,
    inFertileWindow: !isLate && cycleDay >= fertileStart && cycleDay <= fertileEnd,
    nextPeriodDate: iso(nextPeriod),
    daysToNextPeriod: daysBetween(today, nextPeriod),
    nextOvulationDate: iso(nextOvu),
    lastPeriodStart
  };
}

export interface DayMark {
  period: boolean;
  predictedPeriod: boolean;
  fertile: boolean;
  ovulation: boolean;
  phase: PhaseId | null;
}

/** Classify an arbitrary calendar date for calendar rendering (looks back at history, forward at predictions). */
export function markFor(dateIso: string): DayMark {
  const { cycleLength, periodLength } = state.profile;
  const d = fromIso(dateIso);
  const none: DayMark = { period: false, predictedPeriod: false, fertile: false, ovulation: false, phase: null };

  // Which cycle does this date belong to? Anchor on the latest period start at or before the date;
  // if the date is before all recorded starts, project backwards from the earliest.
  const starts = state.periodStarts.length ? state.periodStarts : [state.profile.lastPeriodStart];
  let anchor: Date | null = null;
  for (const s of starts) {
    const sd = fromIso(s);
    if (sd.getTime() <= d.getTime()) anchor = sd;
  }
  if (!anchor) return none;

  let offset = daysBetween(anchor, d); // 0-based days since anchor
  const projectedCycles = Math.floor(offset / cycleLength);
  const isProjection = projectedCycles > 0;
  offset = offset % cycleLength;
  const cycleDay = offset + 1;

  const ovu = ovulationDayFor(cycleLength);
  const phase = phaseForDay(cycleDay, cycleLength, periodLength);
  const inPeriod = cycleDay <= periodLength;
  const loggedFlow = state.logs[dateIso]?.flow;
  const flowLogged = loggedFlow !== undefined && loggedFlow !== "none";

  return {
    period: (inPeriod && !isProjection) || flowLogged,
    predictedPeriod: inPeriod && isProjection,
    fertile: cycleDay >= Math.max(1, ovu - 5) && cycleDay <= ovu + 1,
    ovulation: cycleDay === ovu,
    phase
  };
}

export interface CycleStats {
  avgCycleLength: number | null;
  cycleVariation: number | null;
  avgPeriodLength: number | null;
  cyclesTracked: number;
}

export function cycleStats(): CycleStats {
  const starts = state.periodStarts;
  const lengths: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    const len = daysBetween(fromIso(starts[i - 1]), fromIso(starts[i]));
    if (len >= 15 && len <= 60) lengths.push(len);
  }
  const avg = lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : null;
  const variation = lengths.length >= 2 ? Math.max(...lengths) - Math.min(...lengths) : null;
  return {
    avgCycleLength: avg,
    cycleVariation: variation,
    avgPeriodLength: starts.length ? state.profile.periodLength : null,
    cyclesTracked: Math.max(0, starts.length - 1)
  };
}

export interface SymptomPattern {
  symptom: string;
  count: number;
  phase: PhaseId;
}

/** Find symptoms that recur in the same phase — Wooma's "your patterns" layer. */
export function symptomPatterns(): SymptomPattern[] {
  const { cycleLength, periodLength } = state.profile;
  const tally = new Map<string, Map<PhaseId, number>>();
  for (const log of Object.values(state.logs)) {
    if (!log.symptoms.length) continue;
    const mark = markFor(log.date);
    const phase = mark.phase ?? phaseForDay(1, cycleLength, periodLength);
    for (const s of log.symptoms) {
      const byPhase = tally.get(s) ?? new Map<PhaseId, number>();
      byPhase.set(phase, (byPhase.get(phase) ?? 0) + 1);
      tally.set(s, byPhase);
    }
  }
  const out: SymptomPattern[] = [];
  for (const [symptom, byPhase] of tally) {
    for (const [phase, count] of byPhase) {
      if (count >= 2) out.push({ symptom, count, phase });
    }
  }
  return out.sort((a, b) => b.count - a.count).slice(0, 6);
}
