// Hormone Concierge — Wooma's conversational layer.
// MVP: an on-device rule engine that combines cycle phase, logged symptoms and chat style.
// Transparency is the differentiator: it explains *why*, and labels evidence strength.

import { state, getLog, todayIso } from "../store";
import { cycleStatus } from "./cycle";
import { PHASES, RECOMMENDATIONS, CRAVING_SUPPORT, EVIDENCE_LABEL } from "./content";

export interface Reply {
  text: string;
  chips?: string[];
  topic: string;
}

const DEFAULT_CHIPS = ["Why am I so tired?", "What should I eat today?", "How should I train today?", "Help with cramps"];

function detailed(): boolean {
  return state.profile.chatStyle === "detailed";
}

function logNudge(): string {
  const log = getLog(todayIso());
  const hasData = log.symptoms.length > 0 || log.mood !== undefined || log.energy !== undefined;
  return hasData ? "" : "\n\nI notice you haven't logged anything today. Tracking how you feel helps me give you much better guidance — how is your body feeling right now?";
}

function phaseIntro(): string {
  const s = cycleStatus();
  const p = PHASES[s.phase];
  return `You're on cycle day ${s.cycleDay}, in your ${p.name.toLowerCase()}.`;
}

export function greeting(): Reply {
  const s = cycleStatus();
  const p = PHASES[s.phase];
  const text = detailed()
    ? `Hi, I'm your Wooma Concierge 🌙\n\n${phaseIntro()} ${p.hormones}\n\nI can help you understand what your body may need today — food, movement, recovery, symptoms, or just "why do I feel like this?". What's on your mind?`
    : `Hi! ${phaseIntro()}\n\nAsk me anything about food, training, symptoms or energy today.`;
  return { text, chips: DEFAULT_CHIPS, topic: "greeting" };
}

export function respond(raw: string): Reply {
  const input = raw.toLowerCase();
  const s = cycleStatus();
  const p = PHASES[s.phase];
  const has = (...words: string[]) => words.some((w) => input.includes(w));

  // Follow-up: "why?" / "why does this help"
  if (has("why") && input.length < 40 && state.chatTopic && state.chatTopic !== "greeting") {
    return explainWhy(state.chatTopic);
  }

  if (has("cramp", "pain", "hurt", "ache")) {
    const rec = RECOMMENDATIONS.menstrual;
    const text = detailed()
      ? `Cramps can often feel a bit easier with warm, gentle foods and good hydration. Try things like:\n• warm soups or broths\n• bananas, oats and rice\n• leafy greens and beans for magnesium and iron\n• yogurt or fermented foods if they suit you\n• ginger or peppermint tea\n\nFor right now: a heating pad, rest, and plenty of water genuinely help — topical heat is one of the best-evidenced comfort measures (${EVIDENCE_LABEL.high.toLowerCase()}).${logNudge()}\n\nIf pain is severe or regularly disrupts your life, that's worth discussing with a clinician — you deserve answers, not just coping.`
      : `Warm foods, magnesium-rich snacks (dark chocolate, bananas, leafy greens), ginger tea, a heating pad and water. Heat has strong evidence behind it.${logNudge()}`;
    void rec;
    return { text, chips: ["Why does this help?", "What should I eat today?", "Log symptoms"], topic: "cramps" };
  }

  if (has("tired", "fatigue", "exhaust", "energy", "drained", "sleepy")) {
    const energyByPhase: Record<string, string> = {
      menstrual: "your hormones are at their monthly low point while your body does the physical work of menstruation — fatigue now is biology, not laziness",
      follicular: "which is usually a higher-energy window — so if you're tired, look at sleep, fuel and stress first; your hormones aren't the likely culprit this week",
      ovulatory: "which is typically peak-energy — a dip here often traces back to sleep debt or under-fueling rather than your cycle",
      luteal: "and rising progesterone has a genuinely sedating effect while your body burns a little more energy — feeling more tired here is extremely common"
    };
    const text = detailed()
      ? `${phaseIntro()}\n\nRight now ${energyByPhase[s.phase]}.\n\nWhat tends to help today:\n• eat regular meals with protein — blood-sugar dips read as exhaustion\n• get outside light early in the day\n• if you train, ${s.phase === "luteal" || s.phase === "menstrual" ? "keep it moderate — consistency over intensity" : "you can push — energy usually follows"}\n• protect tonight's sleep window${logNudge()}`
      : `${phaseIntro()} Right now ${energyByPhase[s.phase]}. Regular protein-forward meals, morning light, and ${s.phase === "luteal" || s.phase === "menstrual" ? "moderate movement" : "a proper workout"} usually help most.${logNudge()}`;
    return { text, chips: ["Why does this help?", "How should I train today?", "Help me sleep better"], topic: "energy" };
  }

  if (has("crav", "chocolate", "sugar", "snack")) {
    const text = `${CRAVING_SUPPORT[s.phase]}\n\n${detailed() ? `Practical version: don't fight the craving with willpower — change its context. Add protein or fiber alongside it (dark chocolate + nuts, toast + eggs), stay hydrated, and eat it slowly, guilt-free. Restriction now usually rebounds later.` : "Pair the craving with protein or fiber, hydrate, and enjoy it without guilt — restriction rebounds."}`;
    return { text, chips: ["What should I eat today?", "Why does this help?"], topic: "cravings" };
  }

  if (has("eat", "food", "meal", "nutrition", "hungry", "recipe", "cook", "breakfast", "lunch", "dinner")) {
    const rec = RECOMMENDATIONS[s.phase].find((r) => r.area === "nutrition")!;
    const text = detailed()
      ? `${phaseIntro()}\n\n**${rec.title}** (${EVIDENCE_LABEL[rec.evidence].toLowerCase()})\n${rec.detail}\n\nWhy: ${rec.why}\n\nThe Food tab has full meal ideas for this phase, and you can add ingredients straight to your grocery list.${logNudge()}`
      : `${rec.title}: ${rec.detail}\n\nSee the Food tab for meal ideas.${logNudge()}`;
    return { text, chips: ["Why does this help?", "I'm having cravings", "Help with cramps"], topic: "nutrition" };
  }

  if (has("train", "workout", "exercise", "gym", "run", "lift", "yoga", "fitness", "cardio")) {
    const rec = RECOMMENDATIONS[s.phase].find((r) => r.area === "movement")!;
    const text = detailed()
      ? `${phaseIntro()}\n\n**${rec.title}** (${EVIDENCE_LABEL[rec.evidence].toLowerCase()})\n${rec.detail}\n\nWhy: ${rec.why}\n\nAnd the golden rule over any phase-based guidance: how you actually feel today wins. A logged energy level helps me calibrate this.${logNudge()}`
      : `${rec.title}: ${rec.detail}\n\nHow you feel today always overrides the plan.${logNudge()}`;
    return { text, chips: ["Why does this help?", "Why am I so tired?", "Log symptoms"], topic: "movement" };
  }

  if (has("sleep", "insomnia", "awake", "night")) {
    const luteal = s.phase === "luteal";
    const text = detailed()
      ? `${luteal ? "Late-cycle sleep trouble is real: progesterone's rise and fall raises your core temperature and fragments sleep architecture — you're not imagining it." : "Sleep is the highest-leverage recovery tool you have, in any phase."}\n\nTonight:\n• cool the bedroom a degree or two ${luteal ? "(this matters extra right now)" : ""}\n• caffeine before noon only\n• screens down 45 minutes before bed — light delays melatonin\n• same wake time tomorrow, even if the night is rough\n\nSleep hygiene fundamentals are ${EVIDENCE_LABEL.high.toLowerCase()} territory — boring, but they work.${logNudge()}`
      : `${luteal ? "Progesterone raises body temp late-cycle — sleep really is harder now. " : ""}Cool room, early caffeine cutoff, screens down 45 min before bed, consistent wake time.${logNudge()}`;
    return { text, chips: ["Why does this help?", "Why am I so tired?"], topic: "sleep" };
  }

  if (has("mood", "anxious", "anxiety", "sad", "irritab", "angry", "cry", "emotional", "overwhelm", "stress")) {
    const lutealNote = s.phase === "luteal"
      ? "You're in your luteal phase, when falling estrogen affects serotonin — heightened emotions now have a real biological basis. It's not \"just in your head\", and it's also temporary."
      : `You're in your ${p.name.toLowerCase()}, ${p.mood.toLowerCase()}`;
    const text = detailed()
      ? `${lutealNote}\n\nWhat reliably helps mood across the research:\n• movement, even a 15-minute walk (${EVIDENCE_LABEL.high.toLowerCase()})\n• steady meals — blood-sugar crashes mimic anxiety\n• daylight, especially in the morning\n• lowering the bar today: fewer commitments, earlier night\n\nBe as kind to yourself as you'd be to a friend feeling this way.${logNudge()}\n\nIf low mood is persistent or heavy, please reach out to someone you trust or a professional — that's strength, not failure.`
      : `${lutealNote}\n\nA short walk, steady meals, daylight, and a lighter schedule today genuinely help. Be kind to yourself.${logNudge()}`;
    return { text, chips: ["Why does this help?", "Help me sleep better", "Log symptoms"], topic: "mood" };
  }

  if (has("bloat", "puffy", "water retention")) {
    const text = detailed()
      ? `Bloating is common ${s.phase === "luteal" ? "in the luteal phase — progesterone slows digestion and shifts fluid balance" : "around hormonal shifts"}.\n\nWhat helps:\n• potassium-rich foods (banana, avocado, potato) to balance sodium\n• steady hydration — paradoxically, more water means less retention\n• gentle movement to help digestion\n• easy on carbonated drinks and very salty meals today\n\nMost cycle-related bloating eases within a few days.${logNudge()}`
      : `Potassium-rich foods, steady water intake, gentle movement, and lighter salt today. It typically passes in a few days.${logNudge()}`;
    return { text, chips: ["Why does this help?", "What should I eat today?"], topic: "bloating" };
  }

  if (has("headache", "migraine")) {
    const text = detailed()
      ? `${s.phase === "menstrual" || s.phase === "luteal" ? "Headaches cluster around the estrogen drop right before and during your period — \"menstrual migraines\" are a recognized pattern." : "Hormonal headaches most often track estrogen drops, but hydration and sleep are the usual suspects any day."}\n\nRight now:\n• water first — mild dehydration is the most common trigger\n• magnesium-rich foods may help (${EVIDENCE_LABEL.moderate.toLowerCase()} for prevention)\n• dim screens, fresh air, and rest if you can\n\nTrack it in your log — if headaches repeat at the same cycle point, that pattern is genuinely useful information for you and your clinician.${logNudge()}`
      : `Hydrate first, magnesium-rich foods, dim light and rest. Log it — timing patterns across cycles are valuable info.${logNudge()}`;
    return { text, chips: ["Log symptoms", "Why does this help?"], topic: "headache" };
  }

  if (has("late", "missed period", "no period")) {
    const late = s.isLate;
    const text = late
      ? `Your period is currently ${s.daysLate} day${s.daysLate === 1 ? "" : "s"} past its predicted date. Before worrying: cycles commonly shift with stress, travel, illness, sleep changes and training load — a few days of variation is normal.\n\nIf pregnancy is possible for you, a test gives the clearest answer. If your period is more than a couple of weeks late, or lateness becomes a pattern, check in with a clinician.\n\nWhen it does start, tap "Period started" on the Today screen so I can recalibrate your predictions.`
      : `Your period isn't late — it's predicted around ${s.nextPeriodDate} (${s.daysToNextPeriod} day${s.daysToNextPeriod === 1 ? "" : "s"} away). Predictions sharpen as you log more cycles.`;
    return { text, chips: ["What phase am I in?", "Log symptoms"], topic: "late" };
  }

  if (has("ovulat", "fertile")) {
    const text = `Your estimated ovulation is around cycle day ${s.ovulationDay}${s.inFertileWindow ? " — you're in your fertile window now (days " + s.fertileStart + "–" + s.fertileEnd + ")" : `; your fertile window spans roughly days ${s.fertileStart}–${s.fertileEnd}`}.\n\nKeep in mind: calendar-based estimates are approximate and shift with real life. Wooma is a wellness tool, not a contraceptive — please don't rely on these estimates to prevent or achieve pregnancy.`;
    return { text, chips: ["What phase am I in?", "What should I eat today?"], topic: "ovulation" };
  }

  if (has("phase", "where am i", "what day", "cycle day", "status")) {
    const text = `${phaseIntro()}\n\n${p.hormones}\n\n${p.blurb}\n\nEnergy: ${p.energy}\nNext period predicted: ${s.isLate ? `${s.daysLate} day${s.daysLate === 1 ? "" : "s"} late` : `in ${s.daysToNextPeriod} day${s.daysToNextPeriod === 1 ? "" : "s"}`}.`;
    return { text, chips: DEFAULT_CHIPS, topic: "status" };
  }

  if (has("hello", "hi ", "hey") || input.trim() === "hi") {
    return greeting();
  }

  if (has("thank")) {
    return { text: "Anytime 💗 I'm here whenever you want to make sense of what your body's doing.", chips: DEFAULT_CHIPS, topic: "thanks" };
  }

  // Fallback
  const text = detailed()
    ? `I want to give you something genuinely useful rather than a generic answer. I'm best at connecting your cycle to everyday decisions — try asking about:\n• energy and fatigue\n• what to eat (meals, cravings)\n• training and movement\n• sleep, mood, cramps, bloating or headaches\n• where you are in your cycle\n\n${phaseIntro()}`
    : `Try me on energy, food, training, sleep, mood or symptoms. ${phaseIntro()}`;
  return { text, chips: DEFAULT_CHIPS, topic: "fallback" };
}

function explainWhy(topic: string): Reply {
  const s = cycleStatus();
  const explanations: Record<string, string> = {
    cramps: `These suggestions work on the actual mechanism. During cramps, your uterus is contracting, driven by prostaglandins:\n\n• Magnesium-rich foods (leafy greens, oats, bananas) support muscle relaxation.\n• Warmth increases blood flow and measurably eases tension — heat patches rival painkillers in some trials (${EVIDENCE_LABEL.high.toLowerCase()}).\n• Ginger has anti-inflammatory compounds with decent trial evidence for period pain (${EVIDENCE_LABEL.moderate.toLowerCase()}).\n• Hydration keeps muscles from cramping harder.`,
    energy: `Energy tracks your hormones more than most people realize. Estrogen is mildly stimulating and supports serotonin and dopamine; progesterone is sedating. So the estrogen climb (follicular → ovulation) usually feels like energy, and the progesterone-dominant luteal phase feels heavier. Meals, light and sleep are the levers you control on top of that biology.`,
    nutrition: `Phase-based nutrition is about matching fuel to what your body is doing: iron replacement during your period (you're literally losing it), efficient carb use when estrogen is high, and blood-sugar stability when progesterone makes you run slightly hotter and hungrier. None of it is restriction — it's timing.`,
    movement: `Estrogen supports muscle repair, pain tolerance and power output, so high-estrogen windows favor intensity. In the luteal phase your core temperature is up ~0.3–0.5°C and recovery capacity dips, so the same session costs more. Training with your cycle isn't about doing less — it's about spending effort where it buys the most (${EVIDENCE_LABEL.moderate.toLowerCase()}).`,
    sleep: `Progesterone's rise and fall changes your sleep architecture and raises core body temperature — and you sleep best when your core temp can drop. That's why cooling the room and winding down early matter extra in the late luteal phase. The fundamentals (consistent wake time, early caffeine cutoff, dim evenings) are among the best-evidenced habits in all of health science.`,
    mood: `Estrogen supports serotonin — so when it falls in the late luteal phase, mood sensitivity genuinely increases. Movement, daylight and steady meals all act on the same systems (serotonin, cortisol, blood sugar) from the behavioral side. Knowing it's biology helps you respond with strategy instead of self-blame.`,
    bloating: `Progesterone slows gut motility and shifts how your body handles sodium and fluid, so late-cycle bloating is hormonal, not dietary failure. Potassium counterbalances sodium; hydration signals your body it can release retained water; movement helps the slowed digestion along.`,
    headache: `Estrogen withdrawal is a known migraine trigger — receptor-level changes in the brain's pain pathways. That's why headaches cluster right before and during your period. Hydration and magnesium raise the threshold; tracking timing turns a mystery into a predictable, manageable pattern.`,
    cravings: `In the luteal phase your metabolic rate rises (~100–300 kcal/day) and progesterone influences appetite signaling — your body is asking for more energy, often as quick carbs. Pairing carbs with protein or fiber slows glucose absorption, which satisfies the craving without the crash that triggers the next one.`
  };
  const text = explanations[topic] ?? `Happy to explain! Ask me about a specific area — food, training, sleep, mood or symptoms — and I'll show you the reasoning and the strength of the evidence behind it.`;
  void s;
  return { text, chips: ["What should I eat today?", "How should I train today?"], topic };
}
