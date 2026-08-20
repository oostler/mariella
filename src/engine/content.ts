// Phase knowledge base — evidence-informed wellness content with transparent confidence tiers.
// Wellness guidance only: educational, not medical advice.

import type { PhaseId } from "./cycle";

export type Evidence = "high" | "moderate" | "emerging";

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  high: "High confidence",
  moderate: "Moderate evidence",
  emerging: "Emerging evidence"
};

export const EVIDENCE_EXPLAINER: Record<Evidence, string> = {
  high: "Well-established fundamentals (e.g. protein intake, sleep hygiene, exercise basics).",
  moderate: "Supported by research for some individuals (e.g. magnesium, inflammation-related nutrition).",
  emerging: "Early or mixed research — may help, worth experimenting with mindfully."
};

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  shortName: string;
  color: string;
  hormones: string;
  blurb: string;
  energy: string;
  mood: string;
  likelySymptoms: string[];
  focusTip: string;
}

export const PHASES: Record<PhaseId, PhaseInfo> = {
  menstrual: {
    id: "menstrual",
    name: "Menstrual phase",
    shortName: "Menstrual",
    color: "var(--ph-menstrual)",
    hormones: "Estrogen and progesterone are at their lowest as your period begins.",
    blurb: "Your body is doing real work right now. Energy is often lowest in these first days — treat rest as productive.",
    energy: "Typically lowest of the month, often rising toward the end of your period.",
    mood: "Many feel inward-focused and tired at first, with relief as the days pass.",
    likelySymptoms: ["Cramps", "Fatigue", "Backache", "Headache"],
    focusTip: "Favor lighter commitments and reflective work. If energy allows, days 3–5 are good for easing back in."
  },
  follicular: {
    id: "follicular",
    name: "Follicular phase",
    shortName: "Follicular",
    color: "var(--ph-follicular)",
    hormones: "Estrogen is climbing steadily as your body prepares to ovulate.",
    blurb: "Rising estrogen tends to bring rising energy, sharper focus and a more social mood — a natural tailwind.",
    energy: "Building day by day. Many feel their strongest and most motivated here.",
    mood: "Often upbeat, curious and social. Confidence tends to climb with estrogen.",
    likelySymptoms: ["Higher energy", "Clearer skin", "Stronger workouts"],
    focusTip: "Great window for hard problems, planning, presenting, and trying new things. Schedule the big stuff."
  },
  ovulatory: {
    id: "ovulatory",
    name: "Ovulatory phase",
    shortName: "Ovulatory",
    color: "var(--ph-ovulatory)",
    hormones: "Estrogen peaks and luteinizing hormone surges, triggering ovulation.",
    blurb: "Peak estrogen often means peak energy, communication and confidence — your monthly high point.",
    energy: "Usually the highest of your cycle. Great capacity for intensity.",
    mood: "Outgoing and articulate for many. Some feel a brief energy dip right after ovulation.",
    likelySymptoms: ["Peak energy", "Mild twinges", "Increased discharge"],
    focusTip: "Ideal for conversations that matter: interviews, negotiations, difficult talks, social events."
  },
  luteal: {
    id: "luteal",
    name: "Luteal phase",
    shortName: "Luteal",
    color: "var(--ph-luteal)",
    hormones: "Progesterone rises then falls; estrogen dips, rebounds, then falls before your period.",
    blurb: "Your body burns slightly more energy now — cravings and lower patience are biology, not a character flaw.",
    energy: "Gradually tapering. The last few days before your period are often the lowest.",
    mood: "More sensitive and inward for many. PMS symptoms tend to appear in the late luteal days.",
    likelySymptoms: ["Cravings", "Bloating", "Irritability", "Breast tenderness", "Fatigue"],
    focusTip: "Favor finishing over starting: wrap up projects, clear the backlog, protect your evenings."
  }
};

export interface Recommendation {
  area: "nutrition" | "movement" | "recovery";
  title: string;
  detail: string;
  why: string;
  evidence: Evidence;
}

export const RECOMMENDATIONS: Record<PhaseId, Recommendation[]> = {
  menstrual: [
    {
      area: "nutrition",
      title: "Replenish iron + warm, gentle meals",
      detail: "Lean red meat, lentils, spinach and beans, paired with vitamin C to absorb better. Warm soups and broths feel easiest now.",
      why: "Menstrual blood loss depletes iron, which can compound fatigue. Vitamin C meaningfully improves non-heme iron absorption.",
      evidence: "high"
    },
    {
      area: "movement",
      title: "Gentle movement, not zero movement",
      detail: "Walks, easy yoga or stretching. If you feel good, light strength work is fine — let symptoms set the ceiling.",
      why: "Light movement increases circulation and can reduce cramp intensity for many people, without adding recovery load.",
      evidence: "moderate"
    },
    {
      area: "recovery",
      title: "Heat + earlier nights",
      detail: "A heating pad for cramps, and aim to be in bed 30–60 minutes earlier than usual.",
      why: "Topical heat measurably relieves menstrual cramping, and sleep need is often higher during your period.",
      evidence: "high"
    }
  ],
  follicular: [
    {
      area: "nutrition",
      title: "Protein + complex carbs to fuel the climb",
      detail: "Eggs, greek yogurt, chicken, oats, quinoa and colorful vegetables. Fresh, lighter meals tend to sit well now.",
      why: "Rising estrogen improves insulin sensitivity for many, so your body uses carbohydrates efficiently — fuel the energy you have.",
      evidence: "moderate"
    },
    {
      area: "movement",
      title: "Push progressive overload",
      detail: "Strength PRs, intervals, a harder class, a longer run. This is the window to build.",
      why: "Estrogen supports muscle repair and pain tolerance; many people recover fastest from hard sessions in this phase.",
      evidence: "moderate"
    },
    {
      area: "recovery",
      title: "Ride the wave, keep the base",
      detail: "You'll likely need less down-regulation — but keep sleep consistent so the good week compounds.",
      why: "Consistent sleep timing is one of the strongest levers for sustained energy, whatever the phase.",
      evidence: "high"
    }
  ],
  ovulatory: [
    {
      area: "nutrition",
      title: "Light, bright and hydrating",
      detail: "Salads with protein, fruit, raw veg, plenty of water. Fiber (cruciferous veg, flax) supports estrogen metabolism.",
      why: "Appetite often dips at peak estrogen; light meals keep energy stable, and fiber helps your body process the estrogen peak.",
      evidence: "moderate"
    },
    {
      area: "movement",
      title: "Go for intensity — with warm-ups",
      detail: "HIIT, heavy lifts, competitive sport. Take an extra 5 minutes to warm up properly.",
      why: "Power output peaks for many around ovulation. Some research suggests ligament laxity shifts near the estrogen peak, so warm-ups matter.",
      evidence: "emerging"
    },
    {
      area: "recovery",
      title: "Bank the good sleep",
      detail: "Energy can mask fatigue this week. Keep your wind-down routine even if you don't feel you need it.",
      why: "Post-ovulation, rising progesterone slightly raises body temperature and can disturb sleep — a strong routine now cushions that.",
      evidence: "moderate"
    }
  ],
  luteal: [
    {
      area: "nutrition",
      title: "Steady blood sugar beats the crash",
      detail: "Higher-protein meals, complex carbs (sweet potato, oats), magnesium-rich foods: dark chocolate, leafy greens, pumpkin seeds, bananas.",
      why: "Your metabolic rate rises slightly and blood-sugar swings hit harder now — steady fuel blunts cravings. Magnesium shows benefit for PMS symptoms in multiple trials.",
      evidence: "moderate"
    },
    {
      area: "movement",
      title: "Swap intensity for consistency",
      detail: "Moderate strength, steady-state cardio, pilates, long walks. Save the PRs for after your period starts.",
      why: "Higher core temperature and lower recovery capacity make all-out sessions cost more now; consistent moderate work maintains fitness without digging a hole.",
      evidence: "moderate"
    },
    {
      area: "recovery",
      title: "Protect sleep + lower the stimulation",
      detail: "Cool bedroom, caffeine before noon, screens down earlier. Add 10 minutes of anything that genuinely relaxes you.",
      why: "Progesterone's rise and fall disrupts sleep architecture in the late luteal phase, and poor sleep amplifies PMS mood symptoms.",
      evidence: "high"
    }
  ]
};

export interface Meal {
  name: string;
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  tags: string[];
  ingredients: string[];
}

export const MEALS: Record<PhaseId, Meal[]> = {
  menstrual: [
    { name: "Ginger-lentil soup with spinach", slot: "lunch", tags: ["iron", "warming", "anti-inflammatory"], ingredients: ["red lentils", "spinach", "fresh ginger", "vegetable broth", "onion"] },
    { name: "Beef & broccoli rice bowl", slot: "dinner", tags: ["iron", "protein", "b12"], ingredients: ["lean beef", "broccoli", "brown rice", "garlic", "soy sauce"] },
    { name: "Oatmeal with banana, cacao & almond butter", slot: "breakfast", tags: ["magnesium", "comfort", "fiber"], ingredients: ["oats", "banana", "cacao powder", "almond butter"] },
    { name: "Dark chocolate + orange segments", slot: "snack", tags: ["magnesium", "vitamin c", "craving-friendly"], ingredients: ["dark chocolate (70%+)", "orange"] }
  ],
  follicular: [
    { name: "Greek yogurt bowl with berries & seeds", slot: "breakfast", tags: ["protein", "probiotic", "fresh"], ingredients: ["greek yogurt", "mixed berries", "pumpkin seeds", "honey"] },
    { name: "Chicken quinoa power salad", slot: "lunch", tags: ["protein", "complex carbs", "light"], ingredients: ["chicken breast", "quinoa", "cucumber", "cherry tomatoes", "feta", "lemon"] },
    { name: "Salmon, sweet potato & greens", slot: "dinner", tags: ["omega-3", "protein"], ingredients: ["salmon fillet", "sweet potato", "kale", "olive oil"] },
    { name: "Apple + peanut butter", slot: "snack", tags: ["fiber", "steady energy"], ingredients: ["apple", "peanut butter"] }
  ],
  ovulatory: [
    { name: "Smoothie: mango, spinach & protein", slot: "breakfast", tags: ["light", "hydrating", "protein"], ingredients: ["mango", "spinach", "protein powder", "coconut water"] },
    { name: "Rainbow crunch bowl with shrimp", slot: "lunch", tags: ["light", "fiber", "bright"], ingredients: ["shrimp", "red cabbage", "carrot", "edamame", "brown rice", "sesame dressing"] },
    { name: "Grilled chicken, flax slaw & citrus", slot: "dinner", tags: ["fiber", "estrogen metabolism"], ingredients: ["chicken thighs", "cabbage slaw", "ground flaxseed", "orange"] },
    { name: "Watermelon + mint", slot: "snack", tags: ["hydrating", "refreshing"], ingredients: ["watermelon", "fresh mint"] }
  ],
  luteal: [
    { name: "Savory oats with egg & avocado", slot: "breakfast", tags: ["steady blood sugar", "protein"], ingredients: ["oats", "egg", "avocado", "chili flakes"] },
    { name: "Turkey & sweet potato skillet", slot: "lunch", tags: ["protein", "complex carbs", "b6"], ingredients: ["ground turkey", "sweet potato", "bell pepper", "spinach", "paprika"] },
    { name: "Chickpea & pumpkin-seed curry", slot: "dinner", tags: ["magnesium", "fiber", "comfort"], ingredients: ["chickpeas", "coconut milk", "pumpkin seeds", "tomatoes", "curry paste", "rice"] },
    { name: "Dark chocolate bark with pumpkin seeds", slot: "snack", tags: ["magnesium", "craving-friendly"], ingredients: ["dark chocolate (70%+)", "pumpkin seeds", "sea salt"] }
  ]
};

export const CRAVING_SUPPORT: Record<PhaseId, string> = {
  menstrual: "Craving comfort food? Totally normal — low hormones, tired body. Warm and satisfying beats strict: a real meal now prevents a snack spiral later.",
  follicular: "Cravings are usually quieter this week. If one shows up, it's often just hunger — you may genuinely need more fuel on training days.",
  ovulatory: "Appetite often dips at the peak. Don't under-eat by accident — a light but complete meal keeps tonight's sleep and tomorrow's energy intact.",
  luteal: "Chocolate and carb cravings peak now — that's rising progesterone and a slightly faster metabolism, not weak willpower. Pair the craving with protein or fiber and enjoy it properly."
};

export const SYMPTOMS = [
  "Cramps", "Headache", "Bloating", "Fatigue", "Cravings", "Acne",
  "Breast tenderness", "Backache", "Nausea", "Insomnia", "Anxiety", "Irritability"
];

export const GOALS = [
  "More energy", "Fewer cramps & symptoms", "Better nutrition",
  "Smarter training", "Steadier mood", "Better sleep"
];

export const MOOD_EMOJI = ["😞", "😕", "😐", "🙂", "😄"];
