(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(s){if(s.ep)return;s.ep=!0;const l=a(s);fetch(s.href,l)}})();const ee="wooma-state-v1";function F(){return{profile:{lastPeriodStart:E(j(new Date,-6)),cycleLength:28,periodLength:5,goals:[],chatStyle:"detailed",onboarded:!1},periodStarts:[],logs:{},chat:[],grocery:[]}}let n=we();function we(){try{const e=localStorage.getItem(ee);if(!e)return F();const t=JSON.parse(e);return{...F(),...t,profile:{...F().profile,...t.profile}}}catch{return F()}}function v(){try{localStorage.setItem(ee,JSON.stringify(n))}catch{}}function $e(){n=F(),v()}function U(e){return n.logs[e]??{date:e,symptoms:[]}}function xe(e){n.logs[e.date]=e,v()}function te(e){n.periodStarts.includes(e)||(n.periodStarts.push(e),n.periodStarts.sort()),n.profile.lastPeriodStart=n.periodStarts[n.periodStarts.length-1],v()}function E(e){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${o}`}function P(e){const[t,a,o]=e.split("-").map(Number);return new Date(t,a-1,o)}function j(e,t){const a=new Date(e);return a.setDate(a.getDate()+t),a}function q(e,t){const a=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime();return Math.round(a/864e5)}function C(){return E(new Date)}function ae(e){return P(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})}function oe(e){return P(e).toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}function h(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ke(e){return h(e).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}function B(e){document.querySelector(".toast")?.remove();const t=document.createElement("div");t.className="toast",t.textContent=e,document.body.appendChild(t),setTimeout(()=>t.remove(),2200)}function O(e){D();const t=document.createElement("div");t.className="sheet-backdrop",t.innerHTML=`<div class="sheet"><div class="grab"></div>${e}</div>`,t.addEventListener("click",a=>{a.target===t&&D()}),document.body.appendChild(t)}function D(){document.querySelector(".sheet-backdrop")?.remove()}const se=new Map;function d(e,t){se.set(e,t)}function Le(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const a=se.get(t.dataset.action);a&&a(t,e)})}const $={high:"High confidence",moderate:"Moderate evidence",emerging:"Emerging evidence"},Se={high:"Well-established fundamentals (e.g. protein intake, sleep hygiene, exercise basics).",moderate:"Supported by research for some individuals (e.g. magnesium, inflammation-related nutrition).",emerging:"Early or mixed research — may help, worth experimenting with mindfully."},w={menstrual:{id:"menstrual",name:"Menstrual phase",shortName:"Menstrual",color:"var(--ph-menstrual)",hormones:"Estrogen and progesterone are at their lowest as your period begins.",blurb:"Your body is doing real work right now. Energy is often lowest in these first days — treat rest as productive.",energy:"Typically lowest of the month, often rising toward the end of your period.",mood:"Many feel inward-focused and tired at first, with relief as the days pass.",likelySymptoms:["Cramps","Fatigue","Backache","Headache"],focusTip:"Favor lighter commitments and reflective work. If energy allows, days 3–5 are good for easing back in."},follicular:{id:"follicular",name:"Follicular phase",shortName:"Follicular",color:"var(--ph-follicular)",hormones:"Estrogen is climbing steadily as your body prepares to ovulate.",blurb:"Rising estrogen tends to bring rising energy, sharper focus and a more social mood — a natural tailwind.",energy:"Building day by day. Many feel their strongest and most motivated here.",mood:"Often upbeat, curious and social. Confidence tends to climb with estrogen.",likelySymptoms:["Higher energy","Clearer skin","Stronger workouts"],focusTip:"Great window for hard problems, planning, presenting, and trying new things. Schedule the big stuff."},ovulatory:{id:"ovulatory",name:"Ovulatory phase",shortName:"Ovulatory",color:"var(--ph-ovulatory)",hormones:"Estrogen peaks and luteinizing hormone surges, triggering ovulation.",blurb:"Peak estrogen often means peak energy, communication and confidence — your monthly high point.",energy:"Usually the highest of your cycle. Great capacity for intensity.",mood:"Outgoing and articulate for many. Some feel a brief energy dip right after ovulation.",likelySymptoms:["Peak energy","Mild twinges","Increased discharge"],focusTip:"Ideal for conversations that matter: interviews, negotiations, difficult talks, social events."},luteal:{id:"luteal",name:"Luteal phase",shortName:"Luteal",color:"var(--ph-luteal)",hormones:"Progesterone rises then falls; estrogen dips, rebounds, then falls before your period.",blurb:"Your body burns slightly more energy now — cravings and lower patience are biology, not a character flaw.",energy:"Gradually tapering. The last few days before your period are often the lowest.",mood:"More sensitive and inward for many. PMS symptoms tend to appear in the late luteal days.",likelySymptoms:["Cravings","Bloating","Irritability","Breast tenderness","Fatigue"],focusTip:"Favor finishing over starting: wrap up projects, clear the backlog, protect your evenings."}},V={menstrual:[{area:"nutrition",title:"Replenish iron + warm, gentle meals",detail:"Lean red meat, lentils, spinach and beans, paired with vitamin C to absorb better. Warm soups and broths feel easiest now.",why:"Menstrual blood loss depletes iron, which can compound fatigue. Vitamin C meaningfully improves non-heme iron absorption.",evidence:"high"},{area:"movement",title:"Gentle movement, not zero movement",detail:"Walks, easy yoga or stretching. If you feel good, light strength work is fine — let symptoms set the ceiling.",why:"Light movement increases circulation and can reduce cramp intensity for many people, without adding recovery load.",evidence:"moderate"},{area:"recovery",title:"Heat + earlier nights",detail:"A heating pad for cramps, and aim to be in bed 30–60 minutes earlier than usual.",why:"Topical heat measurably relieves menstrual cramping, and sleep need is often higher during your period.",evidence:"high"}],follicular:[{area:"nutrition",title:"Protein + complex carbs to fuel the climb",detail:"Eggs, greek yogurt, chicken, oats, quinoa and colorful vegetables. Fresh, lighter meals tend to sit well now.",why:"Rising estrogen improves insulin sensitivity for many, so your body uses carbohydrates efficiently — fuel the energy you have.",evidence:"moderate"},{area:"movement",title:"Push progressive overload",detail:"Strength PRs, intervals, a harder class, a longer run. This is the window to build.",why:"Estrogen supports muscle repair and pain tolerance; many people recover fastest from hard sessions in this phase.",evidence:"moderate"},{area:"recovery",title:"Ride the wave, keep the base",detail:"You'll likely need less down-regulation — but keep sleep consistent so the good week compounds.",why:"Consistent sleep timing is one of the strongest levers for sustained energy, whatever the phase.",evidence:"high"}],ovulatory:[{area:"nutrition",title:"Light, bright and hydrating",detail:"Salads with protein, fruit, raw veg, plenty of water. Fiber (cruciferous veg, flax) supports estrogen metabolism.",why:"Appetite often dips at peak estrogen; light meals keep energy stable, and fiber helps your body process the estrogen peak.",evidence:"moderate"},{area:"movement",title:"Go for intensity — with warm-ups",detail:"HIIT, heavy lifts, competitive sport. Take an extra 5 minutes to warm up properly.",why:"Power output peaks for many around ovulation. Some research suggests ligament laxity shifts near the estrogen peak, so warm-ups matter.",evidence:"emerging"},{area:"recovery",title:"Bank the good sleep",detail:"Energy can mask fatigue this week. Keep your wind-down routine even if you don't feel you need it.",why:"Post-ovulation, rising progesterone slightly raises body temperature and can disturb sleep — a strong routine now cushions that.",evidence:"moderate"}],luteal:[{area:"nutrition",title:"Steady blood sugar beats the crash",detail:"Higher-protein meals, complex carbs (sweet potato, oats), magnesium-rich foods: dark chocolate, leafy greens, pumpkin seeds, bananas.",why:"Your metabolic rate rises slightly and blood-sugar swings hit harder now — steady fuel blunts cravings. Magnesium shows benefit for PMS symptoms in multiple trials.",evidence:"moderate"},{area:"movement",title:"Swap intensity for consistency",detail:"Moderate strength, steady-state cardio, pilates, long walks. Save the PRs for after your period starts.",why:"Higher core temperature and lower recovery capacity make all-out sessions cost more now; consistent moderate work maintains fitness without digging a hole.",evidence:"moderate"},{area:"recovery",title:"Protect sleep + lower the stimulation",detail:"Cool bedroom, caffeine before noon, screens down earlier. Add 10 minutes of anything that genuinely relaxes you.",why:"Progesterone's rise and fall disrupts sleep architecture in the late luteal phase, and poor sleep amplifies PMS mood symptoms.",evidence:"high"}]},ne={menstrual:[{name:"Ginger-lentil soup with spinach",slot:"lunch",tags:["iron","warming","anti-inflammatory"],ingredients:["red lentils","spinach","fresh ginger","vegetable broth","onion"]},{name:"Beef & broccoli rice bowl",slot:"dinner",tags:["iron","protein","b12"],ingredients:["lean beef","broccoli","brown rice","garlic","soy sauce"]},{name:"Oatmeal with banana, cacao & almond butter",slot:"breakfast",tags:["magnesium","comfort","fiber"],ingredients:["oats","banana","cacao powder","almond butter"]},{name:"Dark chocolate + orange segments",slot:"snack",tags:["magnesium","vitamin c","craving-friendly"],ingredients:["dark chocolate (70%+)","orange"]}],follicular:[{name:"Greek yogurt bowl with berries & seeds",slot:"breakfast",tags:["protein","probiotic","fresh"],ingredients:["greek yogurt","mixed berries","pumpkin seeds","honey"]},{name:"Chicken quinoa power salad",slot:"lunch",tags:["protein","complex carbs","light"],ingredients:["chicken breast","quinoa","cucumber","cherry tomatoes","feta","lemon"]},{name:"Salmon, sweet potato & greens",slot:"dinner",tags:["omega-3","protein"],ingredients:["salmon fillet","sweet potato","kale","olive oil"]},{name:"Apple + peanut butter",slot:"snack",tags:["fiber","steady energy"],ingredients:["apple","peanut butter"]}],ovulatory:[{name:"Smoothie: mango, spinach & protein",slot:"breakfast",tags:["light","hydrating","protein"],ingredients:["mango","spinach","protein powder","coconut water"]},{name:"Rainbow crunch bowl with shrimp",slot:"lunch",tags:["light","fiber","bright"],ingredients:["shrimp","red cabbage","carrot","edamame","brown rice","sesame dressing"]},{name:"Grilled chicken, flax slaw & citrus",slot:"dinner",tags:["fiber","estrogen metabolism"],ingredients:["chicken thighs","cabbage slaw","ground flaxseed","orange"]},{name:"Watermelon + mint",slot:"snack",tags:["hydrating","refreshing"],ingredients:["watermelon","fresh mint"]}],luteal:[{name:"Savory oats with egg & avocado",slot:"breakfast",tags:["steady blood sugar","protein"],ingredients:["oats","egg","avocado","chili flakes"]},{name:"Turkey & sweet potato skillet",slot:"lunch",tags:["protein","complex carbs","b6"],ingredients:["ground turkey","sweet potato","bell pepper","spinach","paprika"]},{name:"Chickpea & pumpkin-seed curry",slot:"dinner",tags:["magnesium","fiber","comfort"],ingredients:["chickpeas","coconut milk","pumpkin seeds","tomatoes","curry paste","rice"]},{name:"Dark chocolate bark with pumpkin seeds",slot:"snack",tags:["magnesium","craving-friendly"],ingredients:["dark chocolate (70%+)","pumpkin seeds","sea salt"]}]},ie={menstrual:"Craving comfort food? Totally normal — low hormones, tired body. Warm and satisfying beats strict: a real meal now prevents a snack spiral later.",follicular:"Cravings are usually quieter this week. If one shows up, it's often just hunger — you may genuinely need more fuel on training days.",ovulatory:"Appetite often dips at the peak. Don't under-eat by accident — a light but complete meal keeps tonight's sleep and tomorrow's energy intact.",luteal:"Chocolate and carb cravings peak now — that's rising progesterone and a slightly faster metabolism, not weak willpower. Pair the craving with protein or fiber and enjoy it properly."},Pe=["Cramps","Headache","Bloating","Fatigue","Cravings","Acne","Breast tenderness","Backache","Nausea","Insomnia","Anxiety","Irritability"],Ce=["More energy","Fewer cramps & symptoms","Better nutrition","Smarter training","Steadier mood","Better sleep"],re=["😞","😕","😐","🙂","😄"],p={step:0,lastPeriod:E(j(new Date,-6)),cycleLength:28,periodLength:5,goals:[],chatStyle:"detailed"},le=5;function _(){return`<div class="step-dots">${Array.from({length:le},(e,t)=>`<i class="${t<=p.step?"on":""}"></i>`).join("")}</div>`}function Te(){return`<div class="onb">${[Me,Ie,Ee,De,Ne][p.step]()}</div>`}function Me(){return`
    <div class="top" style="display:flex;flex-direction:column;justify-content:center;text-align:center;">
      <div class="brand-mark">🌙</div>
      <div class="wordmark" style="font-size:34px;margin-bottom:14px;">wooma</div>
      <h1 style="font-size:26px;">Your hormones change every&nbsp;day.<br/>Your plan should&nbsp;too.</h1>
      <p class="lead mt-16">Wooma turns your cycle into practical daily guidance — what to eat, how to move, when to rest — so you can stop guessing and start understanding your body.</p>
    </div>
    <button class="btn-primary" data-action="onb-next">Get started</button>`}function Ie(){return`
    <div class="top">
      ${_()}
      <div class="brand-mark">🔒</div>
      <p class="kicker" style="color:var(--text-faint);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Before we start, a few important promises</p>
      <h1>Safety &amp; Privacy First</h1>
      <h2>Support, not diagnosis</h2>
      <p class="body-text">Wooma is designed for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. If you think you may have a medical emergency, call your doctor or emergency services immediately.</p>
      <h2>Privacy commitment</h2>
      <p class="body-text">Your data never leaves this device. Everything you track is stored locally in your browser — there are no accounts, no servers, and no third parties. You own it completely, and you can erase it at any time from Settings.</p>
    </div>
    <button class="btn-primary" data-action="onb-next">I understand</button>`}function Ee(){return`
    <div class="top">
      ${_()}
      <h1>Let's find where you are</h1>
      <p class="lead">Three quick details so Wooma can locate you in your cycle. Estimates are fine — everything sharpens as you track.</p>
      <div class="field">
        <label>First day of your last period</label>
        <input type="date" id="onb-date" value="${p.lastPeriod}" max="${C()}" />
      </div>
      <div class="field">
        <label>Average cycle length</label>
        <div class="stepper">
          <button data-action="onb-step" data-k="cycleLength" data-d="-1">−</button>
          <div class="val">${p.cycleLength}<small>days</small></div>
          <button data-action="onb-step" data-k="cycleLength" data-d="1">+</button>
        </div>
      </div>
      <div class="field">
        <label>Average period length</label>
        <div class="stepper">
          <button data-action="onb-step" data-k="periodLength" data-d="-1">−</button>
          <div class="val">${p.periodLength}<small>days</small></div>
          <button data-action="onb-step" data-k="periodLength" data-d="1">+</button>
        </div>
      </div>
    </div>
    <button class="btn-primary" data-action="onb-next">Continue</button>`}function De(){return`
    <div class="top">
      ${_()}
      <h1>What matters most right now?</h1>
      <p class="lead">Pick as many as you like — Wooma tunes its daily guidance around them.</p>
      <div class="chip-row">
        ${Ce.map(e=>`<button class="chip ${p.goals.includes(e)?"on":""}" data-action="onb-goal" data-goal="${h(e)}" style="padding:12px 18px;font-size:15px;">${h(e)}</button>`).join("")}
      </div>
    </div>
    <button class="btn-primary" data-action="onb-next">Continue</button>`}function Ne(){return`
    <div class="top">
      ${_()}
      <h1>How should we chat?</h1>
      <p class="lead">Choose the communication style that fits you best right now. You can switch this anytime.</p>
      <button class="choice-card ${p.chatStyle==="detailed"?"on":""}" data-action="onb-style" data-style="detailed">
        <span><span class="t">Detailed</span><div class="d">Walk me through it. Deeper explanations and longer context.</div></span>
        <span class="go">→</span>
      </button>
      <button class="choice-card ${p.chatStyle==="direct"?"on":""}" data-action="onb-style" data-style="direct">
        <span><span class="t">Direct</span><div class="d">Keep it simple. Just the key insights without the extra fluff.</div></span>
        <span class="go">→</span>
      </button>
    </div>
    <button class="btn-primary" data-action="onb-finish">Start my Wooma</button>`}d("onb-next",()=>{if(p.step===2){const e=document.getElementById("onb-date");e?.value&&(p.lastPeriod=e.value)}p.step=Math.min(p.step+1,le-1),u()});d("onb-step",e=>{const t=document.getElementById("onb-date");t?.value&&(p.lastPeriod=t.value);const a=e.dataset.k,o=Number(e.dataset.d);a==="cycleLength"?p.cycleLength=Math.min(45,Math.max(20,p.cycleLength+o)):p.periodLength=Math.min(10,Math.max(1,p.periodLength+o)),u()});d("onb-goal",e=>{const t=e.dataset.goal;p.goals=p.goals.includes(t)?p.goals.filter(a=>a!==t):[...p.goals,t],u()});d("onb-style",e=>{p.chatStyle=e.dataset.style,u()});d("onb-finish",()=>{n.profile.lastPeriodStart=p.lastPeriod,n.profile.cycleLength=p.cycleLength,n.profile.periodLength=p.periodLength,n.profile.goals=p.goals,n.profile.chatStyle=p.chatStyle,n.profile.onboarded=!0,te(p.lastPeriod),v(),location.hash="#/today",u()});function A(e,t,a){const o=Y(t);return e<=a?"menstrual":e<o-1?"follicular":e<=o+1?"ovulatory":"luteal"}function Y(e){return Math.max(8,e-14)}function L(e=new Date){const{lastPeriodStart:t,cycleLength:a,periodLength:o}=n.profile,s=P(t),i=Math.max(0,q(s,e))+1,r=Y(a),c=i>a,g=c?"luteal":A(i,a,o),y=Math.max(1,r-5),m=r+1,k=j(s,a),T=c?j(s,a+r):j(s,r-1);return{cycleDay:i,phase:g,isLate:c,daysLate:c?i-a:0,ovulationDay:r,fertileStart:y,fertileEnd:m,inFertileWindow:!c&&i>=y&&i<=m,nextPeriodDate:E(k),daysToNextPeriod:q(e,k),nextOvulationDate:E(T),lastPeriodStart:t}}function X(e){const{cycleLength:t,periodLength:a}=n.profile,o=P(e),s={period:!1,predictedPeriod:!1,fertile:!1,ovulation:!1,phase:null},l=n.periodStarts.length?n.periodStarts:[n.profile.lastPeriodStart];let i=null;for(const W of l){const I=P(W);I.getTime()<=o.getTime()&&(i=I)}if(!i)return s;let r=q(i,o);const g=Math.floor(r/t)>0;r=r%t;const y=r+1,m=Y(t),k=A(y,t,a),T=y<=a,z=n.logs[e]?.flow;return{period:T&&!g||z!==void 0&&z!=="none",predictedPeriod:T&&g,fertile:y>=Math.max(1,m-5)&&y<=m+1,ovulation:y===m,phase:k}}function We(){const e=n.periodStarts,t=[];for(let s=1;s<e.length;s++){const l=q(P(e[s-1]),P(e[s]));l>=15&&l<=60&&t.push(l)}const a=t.length?Math.round(t.reduce((s,l)=>s+l,0)/t.length):null,o=t.length>=2?Math.max(...t)-Math.min(...t):null;return{avgCycleLength:a,cycleVariation:o,avgPeriodLength:e.length?n.profile.periodLength:null,cyclesTracked:Math.max(0,e.length-1)}}function Fe(){const{cycleLength:e,periodLength:t}=n.profile,a=new Map;for(const s of Object.values(n.logs)){if(!s.symptoms.length)continue;const i=X(s.date).phase??A(1,e,t);for(const r of s.symptoms){const c=a.get(r)??new Map;c.set(i,(c.get(i)??0)+1),a.set(r,c)}}const o=[];for(const[s,l]of a)for(const[i,r]of l)r>=2&&o.push({symptom:s,count:r,phase:i});return o.sort((s,l)=>l.count-s.count).slice(0,6)}function je(){const e=new Date().getHours();return e<5?"Hello, night owl":e<12?"Good morning":e<18?"Good afternoon":"Good evening"}function He(){const e=L(),t=w[e.phase],a=108,o=46,s=2*Math.PI*o,l=Math.min(1,e.cycleDay/n.profile.cycleLength);return`
    <svg width="${a}" height="${a}" viewBox="0 0 ${a} ${a}">
      <circle cx="54" cy="54" r="${o}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
      <circle cx="54" cy="54" r="${o}" fill="none" stroke="${Ae(t.color)}" stroke-width="8"
        stroke-linecap="round" stroke-dasharray="${s*l} ${s}" transform="rotate(-90 54 54)"/>
      <text x="54" y="47" text-anchor="middle" fill="var(--text-faint)" font-size="9.5" letter-spacing="1.5" font-family="var(--font-ui)">DAY</text>
      <text x="54" y="72" text-anchor="middle" fill="var(--text)" font-size="27" font-family="var(--font-display)">${e.cycleDay}</text>
    </svg>`}function Ae(e){const t=e.match(/var\((--[a-z-]+)\)/)?.[1];return t?getComputedStyle(document.documentElement).getPropertyValue(t).trim()||"#e0668f":e}function Be(){const e=L(),t=w[e.phase],a=U(C()),o=a.symptoms.length>0||a.mood!==void 0||a.energy!==void 0,s=V[e.phase],l=e.phase!=="menstrual"&&(e.isLate||e.daysToNextPeriod<=3),i=e.isLate?`Period ${e.daysLate} day${e.daysLate===1?"":"s"} late`:e.inFertileWindow?`Fertile window · ovulation ~day ${e.ovulationDay}`:e.daysToNextPeriod<=n.profile.cycleLength-e.ovulationDay?`Period in ~${e.daysToNextPeriod} day${e.daysToNextPeriod===1?"":"s"}`:`Ovulation ~day ${e.ovulationDay}`;return`
  <div class="screen">
    <header class="app-header">
      <div>
        <div class="kicker">${je()}</div>
        <h1>${h(oe(C()))}</h1>
      </div>
      <button class="icon-btn" data-action="open-settings" aria-label="Settings">⚙︎</button>
    </header>

    <div class="hero" style="--hero-glow: color-mix(in srgb, ${t.color} 30%, transparent);">
      <div class="ring-wrap">${He()}</div>
      <div>
        <div class="phase-name" style="color:${t.color}">${t.shortName} phase</div>
        <div class="phase-blurb">${h(t.blurb)}</div>
        <div class="pill-row"><span class="pill"><span class="dot" style="background:${t.color}"></span>${h(i)}</span></div>
      </div>
    </div>

    ${l?'<button class="cta ghost" data-action="period-started"><span>🩸&nbsp; My period started today</span><span class="arrow">→</span></button>':""}

    <button class="cta" data-action="nav" data-route="log">
      <span>${o?`${a.mood!==void 0?re[a.mood-1]:"✓"}&nbsp; Update today's log`:"How do you feel today?"}</span>
      <span class="arrow">→</span>
    </button>

    <div class="section-title">Today's biological insights</div>
    <div class="card">
      <h3>Hormones</h3>
      <p class="sub">${h(t.hormones)}</p>
      <div class="divider"></div>
      <h3>Energy</h3>
      <p class="sub">${h(t.energy)}</p>
      <div class="divider"></div>
      <h3>You might notice</h3>
      <div class="pill-row mt-8">${t.likelySymptoms.map(r=>`<span class="pill">${h(r)}</span>`).join("")}</div>
    </div>

    <div class="section-title">Personalized for your ${t.shortName.toLowerCase()} phase</div>
    ${s.map((r,c)=>`
      <div class="card rec-card" id="rec-${c}">
        <div class="area" style="color:${Ye(r.area)}">${Oe(r.area)} ${r.area}
          <span class="badge ${r.evidence}" data-action="evidence-info" data-ev="${r.evidence}">${$[r.evidence]}</span>
        </div>
        <h3>${h(r.title)}</h3>
        <p class="sub">${h(r.detail)}</p>
        <button class="why-toggle" data-action="toggle-why" data-i="${c}">Why this? ↓</button>
        <div class="why">${h(r.why)}</div>
      </div>`).join("")}

    <div class="section-title">Planning your day</div>
    <div class="card">
      <h3>Focus &amp; productivity</h3>
      <p class="sub">${h(t.focusTip)}</p>
    </div>

    <button class="cta ghost" data-action="nav" data-route="chat">
      <span>✦&nbsp; Ask your Hormone Concierge</span><span class="arrow">→</span>
    </button>

    <div class="disclaimer-box">Wooma offers educational wellness guidance, not medical advice. Patterns and predictions are estimates that improve as you track.</div>
  </div>`}function Oe(e){return e==="nutrition"?"🥗":e==="movement"?"🏃‍♀️":"🌙"}function Ye(e){return e==="nutrition"?"var(--teal)":e==="movement"?"var(--gold)":"var(--violet)"}d("toggle-why",e=>{const t=document.getElementById(`rec-${e.dataset.i}`);t&&(t.classList.toggle("open"),e.textContent=t.classList.contains("open")?"Why this? ↑":"Why this? ↓")});d("evidence-info",e=>{const t=e.dataset.ev;O(`
    <h3 style="margin-bottom:8px;">Evidence confidence</h3>
    <p class="sub" style="margin-bottom:14px;">Wooma labels every recommendation with the strength of the research behind it — so you know not just <em>what</em>, but how confident to be.</p>
    ${["high","moderate","emerging"].map(a=>`
      <div class="card" style="margin-bottom:10px;${a===t?"border-color:var(--accent);":""}">
        <span class="badge ${a}">${$[a]}</span>
        <p class="sub mt-8">${Se[a]}</p>
      </div>`).join("")}
    <button class="btn-primary" data-action="close-sheet">Got it</button>`)});d("close-sheet",()=>D());d("period-started",()=>{O(`
    <h3 style="margin-bottom:8px;">Log period start?</h3>
    <p class="sub">This sets today as day 1 of a new cycle and recalibrates your predictions.</p>
    <button class="btn-primary" data-action="confirm-period-start">Yes, it started today</button>
    <button class="btn-text" data-action="close-sheet">Cancel</button>`)});d("confirm-period-start",()=>{te(C()),D(),B("New cycle started — predictions updated 💗"),u()});let R="wheel";function ze(){return`
  <div class="screen">
    <header class="app-header">
      <div><div class="kicker">Your current cycle</div><h1>Cycle</h1></div>
      <span class="wordmark">wooma</span>
    </header>
    <div class="seg">
      ${["wheel","calendar","patterns"].map(e=>`<button class="${R===e?"active":""}" data-action="cycle-view" data-v="${e}">${e[0].toUpperCase()+e.slice(1)}</button>`).join("")}
    </div>
    ${R==="wheel"?qe():R==="calendar"?Ve():Je()}
  </div>`}function H(e,t,a,o){const s=(o-90)*Math.PI/180;return[e+a*Math.cos(s),t+a*Math.sin(s)]}function Re(e,t,a,o,s){const[l,i]=H(e,t,a,o),[r,c]=H(e,t,a,s),g=s-o>180?1:0;return`M ${l.toFixed(1)} ${i.toFixed(1)} A ${a} ${a} 0 ${g} 1 ${r.toFixed(1)} ${c.toFixed(1)}`}function Ge(e){const t={menstrual:"--ph-menstrual",follicular:"--ph-follicular",ovulatory:"--ph-ovulatory",luteal:"--ph-luteal"};return getComputedStyle(document.documentElement).getPropertyValue(t[e]).trim()||"#e0668f"}function qe(){const e=L(),{cycleLength:t,periodLength:a}=n.profile,o=w[e.phase],s=300,l=150,i=150,r=122,c=360/t,g=Math.min(3,c*.25),y=[];let m=1,k=A(1,t,a);for(let b=2;b<=t+1;b++){const M=b<=t?A(b,t,a):null;M!==k&&(y.push({phase:k,from:m,to:b-1}),M&&(k=M,m=b))}const T=y.map(b=>{const M=(b.from-1)*c+g/2,K=b.to*c-g/2;return`<path d="${Re(l,i,r,M,K)}" stroke="${Ge(b.phase)}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.85"/>`}).join(""),z=Array.from({length:t},(b,M)=>{const[K,be]=H(l,i,r-20,(M+.5)*c);return`<circle cx="${K.toFixed(1)}" cy="${be.toFixed(1)}" r="1.6" fill="rgba(255,255,255,0.22)"/>`}).join(""),Q=Math.min(e.cycleDay,t)-1,[W,I]=H(l,i,r,(Q+.5)*c),ue=`
    <circle cx="${W.toFixed(1)}" cy="${I.toFixed(1)}" r="13" fill="#fff"/>
    <circle cx="${W.toFixed(1)}" cy="${I.toFixed(1)}" r="13" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="5"/>
    <text x="${W.toFixed(1)}" y="${(I+4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#17090f">${e.cycleDay}</text>`,ge=Y(t),[ye,me]=H(l,i,r,(ge-.5)*c),fe=`<circle cx="${ye.toFixed(1)}" cy="${me.toFixed(1)}" r="4.5" fill="var(--ph-ovulatory)"/>`,ve=e.isLate?`Your period is <strong>${e.daysLate} day${e.daysLate===1?"":"s"} late</strong>`:`Next period predicted <strong>${ae(e.nextPeriodDate)}</strong>`;return`
    <div class="card" style="padding:18px 12px;">
      <div class="wheel-wrap" style="position:relative;">
        <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
          ${T}${z}${fe}${ue}
        </svg>
        <div class="wheel-center" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
          <div class="day-label">Cycle day</div>
          <div class="day-num">${e.cycleDay}</div>
          <div class="phase" style="color:${w[e.phase].color}">${w[e.phase].shortName}</div>
        </div>
      </div>
      <p class="sub" style="text-align:center;margin-top:6px;">${ve}</p>
    </div>

    <div class="cal-legend" style="justify-content:center;">
      ${Object.keys(w).map(b=>`<span><i style="background:${w[b].color}"></i>${w[b].shortName}</span>`).join("")}
    </div>

    <div class="card">
      <h3 style="color:${o.color}">${o.name}</h3>
      <p class="sub">${h(o.hormones)}</p>
      <div class="divider"></div>
      <p class="sub"><strong style="color:var(--text)">Mood:</strong> ${h(o.mood)}</p>
      <p class="sub mt-8"><strong style="color:var(--text)">Best for:</strong> ${h(o.focusTip)}</p>
    </div>

    ${e.inFertileWindow?`<div class="card" style="border-color:rgb(95 184 173 / 45%);"><h3 style="color:var(--teal)">Fertile window</h3><p class="sub">Estimated days ${e.fertileStart}–${e.fertileEnd} of your cycle. Calendar estimates are approximate — not suitable for contraception.</p></div>`:""}`}function Ve(){const e=new Date;return`
    <div class="cal-legend">
      <span><i style="background:var(--ph-menstrual)"></i>Period</span>
      <span><i style="border:1.5px dashed rgb(224 92 114 / 70%);background:none;"></i>Predicted</span>
      <span><i style="background:rgb(95 184 173 / 45%)"></i>Fertile</span>
      <span><i style="background:var(--gold)"></i>Logged</span>
    </div>
    ${[0,1,2].map(a=>Ue(new Date(e.getFullYear(),e.getMonth()+a,1))).join("")}`}function Ue(e){const t=e.getFullYear(),a=e.getMonth(),o=e.toLocaleDateString(void 0,{month:"long",year:"numeric"}),s=new Date(t,a,1).getDay(),l=new Date(t,a+1,0).getDate(),i=C();let r='<div class="cal-grid">';for(const c of["S","M","T","W","T","F","S"])r+=`<div class="cal-dow">${c}</div>`;for(let c=0;c<s;c++)r+='<div class="cal-day empty"></div>';for(let c=1;c<=l;c++){const g=E(new Date(t,a,c)),y=X(g),m=n.logs[g],k=!!m&&(m.symptoms.length>0||m.mood!==void 0||m.energy!==void 0||m.flow&&m.flow!=="none"),T=["cal-day",y.period?"period":y.predictedPeriod?"predicted":y.fertile?"fertile":"",y.ovulation?"ovu":"",g===i?"today":"",k?"logged":""].filter(Boolean).join(" ");r+=`<div class="${T}" data-action="cal-day" data-date="${g}">${c}</div>`}return r+="</div>",`<div class="cal-month"><h3>${o}</h3>${r}</div>`}function _e(){const a=n.profile.cycleLength,o=g=>g/a*320,s=Y(a),l=`M ${o(0)} 100 C ${o(s*.5)} 95, ${o(s*.72)} 18, ${o(s-1)} 14 C ${o(s+1)} 30, ${o(s+2)} 78, ${o(s+4)} 72 C ${o(s+7)} 46, ${o(a-4)} 52, ${o(a)} 96`,i=`M ${o(0)} 104 C ${o(s*.6)} 106, ${o(s)} 102, ${o(s+2)} 88 C ${o(s+5)} 38, ${o(a-5)} 34, ${o(a)} 100`,r=`M ${o(0)} 92 C ${o(s*.6)} 88, ${o(s-2)} 62, ${o(s)} 60 C ${o(s+3)} 66, ${o(a-6)} 84, ${o(a)} 90`,[c]=[o(Math.min(L().cycleDay,a))];return`
    <svg viewBox="0 0 320 120" style="width:100%;height:auto;">
      <line x1="${c}" y1="6" x2="${c}" y2="112" stroke="rgba(255,255,255,0.25)" stroke-dasharray="3 4"/>
      <path d="${l}" fill="none" stroke="var(--accent-soft)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="${i}" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="${r}" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <text x="${c+5}" y="14" font-size="9" fill="var(--text-faint)">today</text>
    </svg>
    <div class="hormone-legend">
      <span><i style="background:var(--accent-soft)"></i>Estrogen</span>
      <span><i style="background:var(--gold)"></i>Progesterone</span>
      <span><i style="background:var(--teal)"></i>Testosterone</span>
    </div>`}function Je(){const e=We(),t=Fe(),a=Object.values(n.logs).filter(o=>o.symptoms.length||o.mood!==void 0).length;return`
    <div class="stat-grid">
      <div class="stat"><div class="num">${e.avgCycleLength??n.profile.cycleLength}<small> days</small></div><div class="label">${e.avgCycleLength?"Avg cycle (tracked)":"Cycle length (setting)"}</div></div>
      <div class="stat"><div class="num">${e.cycleVariation??"–"}<small>${e.cycleVariation!==null?" days":""}</small></div><div class="label">Cycle variation</div></div>
      <div class="stat"><div class="num">${n.profile.periodLength}<small> days</small></div><div class="label">Period length</div></div>
      <div class="stat"><div class="num">${e.cyclesTracked}</div><div class="label">Cycles tracked</div></div>
    </div>

    <div class="card">
      <h3>Hormones across your cycle</h3>
      <p class="sub mb-8">A stylized view of the hormonal weather behind your days.</p>
      ${_e()}
    </div>

    <div class="card">
      <h3>Symptom patterns</h3>
      ${t.length?t.map(o=>`<p class="sub mt-8">• <strong style="color:var(--text)">${h(o.symptom)}</strong> logged ${o.count}× in your ${w[o.phase].shortName.toLowerCase()} phase</p>`).join(""):`<p class="sub">We don't have enough data yet to find a pattern. Keep logging symptoms every day to unlock your insights.</p>
           <button class="chip mt-16" data-action="nav" data-route="log" style="border-color:var(--accent-deep);color:var(--accent-soft);">＋ Log symptoms</button>`}
      ${a>0&&t.length===0?`<p class="muted mt-8">${a} day${a===1?"":"s"} logged so far — patterns appear once a symptom repeats in the same phase.</p>`:""}
    </div>

    <div class="card">
      <h3>Why patterns matter</h3>
      <p class="sub">The goal isn't to assume every woman experiences her cycle the same way — it's to learn <em>your</em> patterns. Once Wooma sees a symptom repeat at the same cycle point, it can warn you ahead of time and tailor that day's guidance.</p>
    </div>`}d("cycle-view",e=>{R=e.dataset.v,u()});d("cal-day",e=>{const t=e.dataset.date,a=X(t),o=n.logs[t],s=P(t),l=P(n.profile.lastPeriodStart),i=Math.floor((s.getTime()-l.getTime())/864e5)%n.profile.cycleLength+1,r=a.phase?w[a.phase]:null,c=o&&(o.symptoms.length||o.mood!==void 0||o.flow&&o.flow!=="none");O(`
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <h3>${h(ae(t))}</h3>
      ${i>0?`<span class="muted">Cycle day ${i}</span>`:""}
    </div>
    ${r?`<span class="pill mt-8"><span class="dot" style="background:${r.color}"></span>${r.name}${a.predictedPeriod?" · predicted period":""}${a.ovulation?" · est. ovulation":""}</span>`:""}
    <div class="divider"></div>
    ${c?`${o.mood!==void 0?`<p class="sub">Mood: ${["😞","😕","😐","🙂","😄"][o.mood-1]}</p>`:""}
         ${o.energy!==void 0?`<p class="sub">Energy: ${o.energy}/5</p>`:""}
         ${o.flow&&o.flow!=="none"?`<p class="sub">Flow: ${o.flow}</p>`:""}
         ${o.symptoms.length?`<div class="pill-row mt-8">${o.symptoms.map(g=>`<span class="pill">${h(g)}</span>`).join("")}</div>`:""}`:'<p class="sub" style="text-align:center;padding:16px 0;">No experiences tracked</p>'}
    <button class="btn-primary" data-action="track-day" data-date="${t}">Track</button>`)});d("track-day",e=>{sessionStorage.setItem("wooma-log-date",e.dataset.date),J("log"),document.querySelector(".sheet-backdrop")?.remove()});const Ke=["none","spotting","light","medium","heavy"];function ce(){return sessionStorage.getItem("wooma-log-date")??C()}function Xe(){const e=ce(),t=U(e),a=e===C();return`
  <div class="screen">
    <header class="app-header">
      <div>
        <div class="kicker">${a?"Tracking today":"Tracking"}</div>
        <h1>${h(oe(e))}</h1>
      </div>
      ${a?"":'<button class="icon-btn" data-action="log-today" title="Jump to today">↩</button>'}
    </header>

    <div class="section-title">Mood</div>
    <div class="scale-row">
      ${re.map((o,s)=>`<button class="${t.mood===s+1?"on":""}" data-action="log-mood" data-v="${s+1}">${o}</button>`).join("")}
    </div>

    <div class="section-title">Energy</div>
    <div class="scale-row nums">
      ${[1,2,3,4,5].map(o=>`<button class="${t.energy===o?"on":""}" data-action="log-energy" data-v="${o}">${o}</button>`).join("")}
    </div>

    <div class="section-title">Flow</div>
    <div class="chip-row">
      ${Ke.map(o=>`<button class="chip ${t.flow===o?"on":""}" data-action="log-flow" data-v="${o}">${o==="none"?"No flow":o[0].toUpperCase()+o.slice(1)}</button>`).join("")}
    </div>

    <div class="section-title">Symptoms</div>
    <div class="chip-row">
      ${Pe.map(o=>`<button class="chip ${t.symptoms.includes(o)?"on":""}" data-action="log-symptom" data-v="${h(o)}">${h(o)}</button>`).join("")}
    </div>

    <div class="section-title">Sleep last night</div>
    <div class="chip-row">
      ${[5,6,7,8,9].map(o=>`<button class="chip ${t.sleepHours===o?"on":""}" data-action="log-sleep" data-v="${o}">${o===5?"≤5":o===9?"9+":o}h</button>`).join("")}
    </div>

    <div class="section-title">Notes</div>
    <textarea class="note" id="log-note" placeholder="Anything else worth remembering about today…">${h(t.note??"")}</textarea>

    <button class="cta mt-16" data-action="log-save"><span>Save today's log</span><span class="arrow">✓</span></button>
    <p class="muted" style="text-align:center;">Saved privately on this device. The more you log, the smarter your guidance gets.</p>
  </div>`}function N(e){const t=U(ce()),a=document.getElementById("log-note")?.value;a!==void 0&&(t.note=a),e(t),xe(t),u()}d("log-mood",e=>N(t=>{t.mood=t.mood===Number(e.dataset.v)?void 0:Number(e.dataset.v)}));d("log-energy",e=>N(t=>{t.energy=t.energy===Number(e.dataset.v)?void 0:Number(e.dataset.v)}));d("log-flow",e=>N(t=>{t.flow=t.flow===e.dataset.v?void 0:e.dataset.v}));d("log-sleep",e=>N(t=>{t.sleepHours=t.sleepHours===Number(e.dataset.v)?void 0:Number(e.dataset.v)}));d("log-symptom",e=>N(t=>{const a=e.dataset.v;t.symptoms=t.symptoms.includes(a)?t.symptoms.filter(o=>o!==a):[...t.symptoms,a]}));d("log-save",()=>{N(()=>{}),B("Logged 💗 Your guidance just got smarter"),sessionStorage.removeItem("wooma-log-date"),J("today")});d("log-today",()=>{sessionStorage.removeItem("wooma-log-date"),u()});const G=["Why am I so tired?","What should I eat today?","How should I train today?","Help with cramps"];function x(){return n.profile.chatStyle==="detailed"}function f(){const e=U(C());return e.symptoms.length>0||e.mood!==void 0||e.energy!==void 0?"":`

I notice you haven't logged anything today. Tracking how you feel helps me give you much better guidance — how is your body feeling right now?`}function S(){const e=L(),t=w[e.phase];return`You're on cycle day ${e.cycleDay}, in your ${t.name.toLowerCase()}.`}function de(){const e=L(),t=w[e.phase];return{text:x()?`Hi, I'm your Wooma Concierge 🌙

${S()} ${t.hormones}

I can help you understand what your body may need today — food, movement, recovery, symptoms, or just "why do I feel like this?". What's on your mind?`:`Hi! ${S()}

Ask me anything about food, training, symptoms or energy today.`,chips:G,topic:"greeting"}}function Qe(e){const t=e.toLowerCase(),a=L(),o=w[a.phase],s=(...i)=>i.some(r=>t.includes(r));if(s("why")&&t.length<40&&n.chatTopic&&n.chatTopic!=="greeting")return Ze(n.chatTopic);if(s("cramp","pain","hurt","ache"))return{text:x()?`Cramps can often feel a bit easier with warm, gentle foods and good hydration. Try things like:
• warm soups or broths
• bananas, oats and rice
• leafy greens and beans for magnesium and iron
• yogurt or fermented foods if they suit you
• ginger or peppermint tea

For right now: a heating pad, rest, and plenty of water genuinely help — topical heat is one of the best-evidenced comfort measures (${$.high.toLowerCase()}).${f()}

If pain is severe or regularly disrupts your life, that's worth discussing with a clinician — you deserve answers, not just coping.`:`Warm foods, magnesium-rich snacks (dark chocolate, bananas, leafy greens), ginger tea, a heating pad and water. Heat has strong evidence behind it.${f()}`,chips:["Why does this help?","What should I eat today?","Log symptoms"],topic:"cramps"};if(s("tired","fatigue","exhaust","energy","drained","sleepy")){const i={menstrual:"your hormones are at their monthly low point while your body does the physical work of menstruation — fatigue now is biology, not laziness",follicular:"which is usually a higher-energy window — so if you're tired, look at sleep, fuel and stress first; your hormones aren't the likely culprit this week",ovulatory:"which is typically peak-energy — a dip here often traces back to sleep debt or under-fueling rather than your cycle",luteal:"and rising progesterone has a genuinely sedating effect while your body burns a little more energy — feeling more tired here is extremely common"};return{text:x()?`${S()}

Right now ${i[a.phase]}.

What tends to help today:
• eat regular meals with protein — blood-sugar dips read as exhaustion
• get outside light early in the day
• if you train, ${a.phase==="luteal"||a.phase==="menstrual"?"keep it moderate — consistency over intensity":"you can push — energy usually follows"}
• protect tonight's sleep window${f()}`:`${S()} Right now ${i[a.phase]}. Regular protein-forward meals, morning light, and ${a.phase==="luteal"||a.phase==="menstrual"?"moderate movement":"a proper workout"} usually help most.${f()}`,chips:["Why does this help?","How should I train today?","Help me sleep better"],topic:"energy"}}if(s("crav","chocolate","sugar","snack"))return{text:`${ie[a.phase]}

${x()?"Practical version: don't fight the craving with willpower — change its context. Add protein or fiber alongside it (dark chocolate + nuts, toast + eggs), stay hydrated, and eat it slowly, guilt-free. Restriction now usually rebounds later.":"Pair the craving with protein or fiber, hydrate, and enjoy it without guilt — restriction rebounds."}`,chips:["What should I eat today?","Why does this help?"],topic:"cravings"};if(s("eat","food","meal","nutrition","hungry","recipe","cook","breakfast","lunch","dinner")){const i=V[a.phase].find(c=>c.area==="nutrition");return{text:x()?`${S()}

**${i.title}** (${$[i.evidence].toLowerCase()})
${i.detail}

Why: ${i.why}

The Food tab has full meal ideas for this phase, and you can add ingredients straight to your grocery list.${f()}`:`${i.title}: ${i.detail}

See the Food tab for meal ideas.${f()}`,chips:["Why does this help?","I'm having cravings","Help with cramps"],topic:"nutrition"}}if(s("train","workout","exercise","gym","run","lift","yoga","fitness","cardio")){const i=V[a.phase].find(c=>c.area==="movement");return{text:x()?`${S()}

**${i.title}** (${$[i.evidence].toLowerCase()})
${i.detail}

Why: ${i.why}

And the golden rule over any phase-based guidance: how you actually feel today wins. A logged energy level helps me calibrate this.${f()}`:`${i.title}: ${i.detail}

How you feel today always overrides the plan.${f()}`,chips:["Why does this help?","Why am I so tired?","Log symptoms"],topic:"movement"}}if(s("sleep","insomnia","awake","night")){const i=a.phase==="luteal";return{text:x()?`${i?"Late-cycle sleep trouble is real: progesterone's rise and fall raises your core temperature and fragments sleep architecture — you're not imagining it.":"Sleep is the highest-leverage recovery tool you have, in any phase."}

Tonight:
• cool the bedroom a degree or two ${i?"(this matters extra right now)":""}
• caffeine before noon only
• screens down 45 minutes before bed — light delays melatonin
• same wake time tomorrow, even if the night is rough

Sleep hygiene fundamentals are ${$.high.toLowerCase()} territory — boring, but they work.${f()}`:`${i?"Progesterone raises body temp late-cycle — sleep really is harder now. ":""}Cool room, early caffeine cutoff, screens down 45 min before bed, consistent wake time.${f()}`,chips:["Why does this help?","Why am I so tired?"],topic:"sleep"}}if(s("mood","anxious","anxiety","sad","irritab","angry","cry","emotional","overwhelm","stress")){const i=a.phase==="luteal"?`You're in your luteal phase, when falling estrogen affects serotonin — heightened emotions now have a real biological basis. It's not "just in your head", and it's also temporary.`:`You're in your ${o.name.toLowerCase()}, ${o.mood.toLowerCase()}`;return{text:x()?`${i}

What reliably helps mood across the research:
• movement, even a 15-minute walk (${$.high.toLowerCase()})
• steady meals — blood-sugar crashes mimic anxiety
• daylight, especially in the morning
• lowering the bar today: fewer commitments, earlier night

Be as kind to yourself as you'd be to a friend feeling this way.${f()}

If low mood is persistent or heavy, please reach out to someone you trust or a professional — that's strength, not failure.`:`${i}

A short walk, steady meals, daylight, and a lighter schedule today genuinely help. Be kind to yourself.${f()}`,chips:["Why does this help?","Help me sleep better","Log symptoms"],topic:"mood"}}return s("bloat","puffy","water retention")?{text:x()?`Bloating is common ${a.phase==="luteal"?"in the luteal phase — progesterone slows digestion and shifts fluid balance":"around hormonal shifts"}.

What helps:
• potassium-rich foods (banana, avocado, potato) to balance sodium
• steady hydration — paradoxically, more water means less retention
• gentle movement to help digestion
• easy on carbonated drinks and very salty meals today

Most cycle-related bloating eases within a few days.${f()}`:`Potassium-rich foods, steady water intake, gentle movement, and lighter salt today. It typically passes in a few days.${f()}`,chips:["Why does this help?","What should I eat today?"],topic:"bloating"}:s("headache","migraine")?{text:x()?`${a.phase==="menstrual"||a.phase==="luteal"?'Headaches cluster around the estrogen drop right before and during your period — "menstrual migraines" are a recognized pattern.':"Hormonal headaches most often track estrogen drops, but hydration and sleep are the usual suspects any day."}

Right now:
• water first — mild dehydration is the most common trigger
• magnesium-rich foods may help (${$.moderate.toLowerCase()} for prevention)
• dim screens, fresh air, and rest if you can

Track it in your log — if headaches repeat at the same cycle point, that pattern is genuinely useful information for you and your clinician.${f()}`:`Hydrate first, magnesium-rich foods, dim light and rest. Log it — timing patterns across cycles are valuable info.${f()}`,chips:["Log symptoms","Why does this help?"],topic:"headache"}:s("late","missed period","no period")?{text:a.isLate?`Your period is currently ${a.daysLate} day${a.daysLate===1?"":"s"} past its predicted date. Before worrying: cycles commonly shift with stress, travel, illness, sleep changes and training load — a few days of variation is normal.

If pregnancy is possible for you, a test gives the clearest answer. If your period is more than a couple of weeks late, or lateness becomes a pattern, check in with a clinician.

When it does start, tap "Period started" on the Today screen so I can recalibrate your predictions.`:`Your period isn't late — it's predicted around ${a.nextPeriodDate} (${a.daysToNextPeriod} day${a.daysToNextPeriod===1?"":"s"} away). Predictions sharpen as you log more cycles.`,chips:["What phase am I in?","Log symptoms"],topic:"late"}:s("ovulat","fertile")?{text:`Your estimated ovulation is around cycle day ${a.ovulationDay}${a.inFertileWindow?" — you're in your fertile window now (days "+a.fertileStart+"–"+a.fertileEnd+")":`; your fertile window spans roughly days ${a.fertileStart}–${a.fertileEnd}`}.

Keep in mind: calendar-based estimates are approximate and shift with real life. Wooma is a wellness tool, not a contraceptive — please don't rely on these estimates to prevent or achieve pregnancy.`,chips:["What phase am I in?","What should I eat today?"],topic:"ovulation"}:s("phase","where am i","what day","cycle day","status")?{text:`${S()}

${o.hormones}

${o.blurb}

Energy: ${o.energy}
Next period predicted: ${a.isLate?`${a.daysLate} day${a.daysLate===1?"":"s"} late`:`in ${a.daysToNextPeriod} day${a.daysToNextPeriod===1?"":"s"}`}.`,chips:G,topic:"status"}:s("hello","hi ","hey")||t.trim()==="hi"?de():s("thank")?{text:"Anytime 💗 I'm here whenever you want to make sense of what your body's doing.",chips:G,topic:"thanks"}:{text:x()?`I want to give you something genuinely useful rather than a generic answer. I'm best at connecting your cycle to everyday decisions — try asking about:
• energy and fatigue
• what to eat (meals, cravings)
• training and movement
• sleep, mood, cramps, bloating or headaches
• where you are in your cycle

${S()}`:`Try me on energy, food, training, sleep, mood or symptoms. ${S()}`,chips:G,topic:"fallback"}}function Ze(e){return L(),{text:{cramps:`These suggestions work on the actual mechanism. During cramps, your uterus is contracting, driven by prostaglandins:

• Magnesium-rich foods (leafy greens, oats, bananas) support muscle relaxation.
• Warmth increases blood flow and measurably eases tension — heat patches rival painkillers in some trials (${$.high.toLowerCase()}).
• Ginger has anti-inflammatory compounds with decent trial evidence for period pain (${$.moderate.toLowerCase()}).
• Hydration keeps muscles from cramping harder.`,energy:"Energy tracks your hormones more than most people realize. Estrogen is mildly stimulating and supports serotonin and dopamine; progesterone is sedating. So the estrogen climb (follicular → ovulation) usually feels like energy, and the progesterone-dominant luteal phase feels heavier. Meals, light and sleep are the levers you control on top of that biology.",nutrition:"Phase-based nutrition is about matching fuel to what your body is doing: iron replacement during your period (you're literally losing it), efficient carb use when estrogen is high, and blood-sugar stability when progesterone makes you run slightly hotter and hungrier. None of it is restriction — it's timing.",movement:`Estrogen supports muscle repair, pain tolerance and power output, so high-estrogen windows favor intensity. In the luteal phase your core temperature is up ~0.3–0.5°C and recovery capacity dips, so the same session costs more. Training with your cycle isn't about doing less — it's about spending effort where it buys the most (${$.moderate.toLowerCase()}).`,sleep:"Progesterone's rise and fall changes your sleep architecture and raises core body temperature — and you sleep best when your core temp can drop. That's why cooling the room and winding down early matter extra in the late luteal phase. The fundamentals (consistent wake time, early caffeine cutoff, dim evenings) are among the best-evidenced habits in all of health science.",mood:"Estrogen supports serotonin — so when it falls in the late luteal phase, mood sensitivity genuinely increases. Movement, daylight and steady meals all act on the same systems (serotonin, cortisol, blood sugar) from the behavioral side. Knowing it's biology helps you respond with strategy instead of self-blame.",bloating:"Progesterone slows gut motility and shifts how your body handles sodium and fluid, so late-cycle bloating is hormonal, not dietary failure. Potassium counterbalances sodium; hydration signals your body it can release retained water; movement helps the slowed digestion along.",headache:"Estrogen withdrawal is a known migraine trigger — receptor-level changes in the brain's pain pathways. That's why headaches cluster right before and during your period. Hydration and magnesium raise the threshold; tracking timing turns a mystery into a predictable, manageable pattern.",cravings:"In the luteal phase your metabolic rate rises (~100–300 kcal/day) and progesterone influences appetite signaling — your body is asking for more energy, often as quick carbs. Pairing carbs with protein or fiber slows glucose absorption, which satisfies the craving without the crash that triggers the next one."}[e]??"Happy to explain! Ask me about a specific area — food, training, sleep, mood or symptoms — and I'll show you the reasoning and the strength of the evidence behind it.",chips:["What should I eat today?","How should I train today?"],topic:e}}function et(){if(n.chat.length===0){const t=de();n.chat.push({role:"bot",text:t.text,chips:t.chips,time:Date.now()}),n.chatTopic=t.topic,v()}const e=n.chat.map((t,a)=>{if(t.role==="user")return`<div class="msg user">${h(t.text)}</div>`;const o=a===n.chat.length-1;return`
      <div class="msg bot">
        <div class="bot-name">✦ Concierge</div>
        <div class="bubble">${ke(t.text)}</div>
      </div>
      ${o&&t.chips?.length?`<div class="chat-chips">${t.chips.map(s=>`<button class="chip" data-action="chat-chip" data-q="${h(s)}">${h(s)}</button>`).join("")}</div>`:""}`}).join("");return setTimeout(()=>{const t=document.getElementById("chat-scroll");t&&(t.scrollTop=t.scrollHeight),document.getElementById("chat-input")?.addEventListener("keydown",a=>{a.key==="Enter"&&pe()})},0),`
  <div class="screen chat-screen">
    <header class="app-header">
      <div><div class="kicker">Hormone Concierge</div><h1>Ask Wooma</h1></div>
      <button class="icon-btn" data-action="chat-clear" title="New conversation">✎</button>
    </header>
    <div class="chat-scroll" id="chat-scroll">${e}</div>
    <div class="chat-input-bar">
      <div class="row">
        <input id="chat-input" type="text" placeholder="Ask about food, energy, symptoms…" autocomplete="off" />
        <button class="send-btn" data-action="chat-send">↑</button>
      </div>
      <div class="chat-disclaimer">Concierge can make mistakes. Educational support — not medical advice.</div>
    </div>
  </div>`}function he(e){n.chat.push({role:"user",text:e,time:Date.now()}),v(),u(),setTimeout(()=>{const t=document.getElementById("chat-scroll");if(t){const a=document.createElement("div");a.className="msg bot",a.innerHTML='<div class="bot-name">✦ Concierge</div><div class="bubble typing"><i></i><i></i><i></i></div>',t.appendChild(a),t.scrollTop=t.scrollHeight}},60),setTimeout(()=>{const t=Qe(e);n.chat.push({role:"bot",text:t.text,chips:t.chips,time:Date.now()}),n.chatTopic=t.topic,n.chat.length>80&&(n.chat=n.chat.slice(-80)),v(),u()},900+Math.random()*500)}function pe(){const e=document.getElementById("chat-input"),t=e?.value.trim();t&&(e.value="",he(t))}d("chat-send",pe);d("chat-chip",e=>{const t=e.dataset.q;if(t==="Log symptoms"){J("log");return}he(t)});d("chat-clear",()=>{n.chat=[],n.chatTopic=void 0,v(),u()});function tt(){const e=L(),t=w[e.phase],a=ne[e.phase],o=V[e.phase].find(s=>s.area==="nutrition");return`
  <div class="screen">
    <header class="app-header">
      <div><div class="kicker">Nutrition intelligence</div><h1>Food</h1></div>
      <span class="wordmark">wooma</span>
    </header>

    <div class="card" style="border-color:color-mix(in srgb, ${t.color} 45%, var(--line));">
      <div class="area" style="color:${t.color};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;display:flex;align-items:center;gap:8px;">
        ${t.shortName} phase focus
        <span class="badge ${o.evidence}">${$[o.evidence]}</span>
      </div>
      <h3 class="mt-8">${h(o.title)}</h3>
      <p class="sub">${h(o.why)}</p>
    </div>

    <div class="card" style="background:linear-gradient(150deg, var(--card-2), var(--card));">
      <h3>🍫 Craving support</h3>
      <p class="sub">${h(ie[e.phase])}</p>
    </div>

    <div class="section-title">Meal ideas for this phase</div>
    ${a.map((s,l)=>`
      <div class="card meal-card">
        <span class="slot">${s.slot}</span>
        <h3>${h(s.name)}</h3>
        <div class="tags">${s.tags.map(i=>`<span>${h(i)}</span>`).join("")}</div>
        <button class="add-grocery" data-action="add-meal-grocery" data-i="${l}">＋ Add ingredients to grocery list</button>
      </div>`).join("")}

    <div class="section-title">Grocery list</div>
    <div class="card">
      ${n.grocery.length===0?'<p class="sub" style="text-align:center;padding:8px 0;">Your list is empty — add ingredients from any meal above.</p>':n.grocery.map((s,l)=>`
          <div class="grocery-item ${s.done?"done":""}">
            <button class="box" data-action="grocery-toggle" data-i="${l}">${s.done?"✓":""}</button>
            <span class="name">${h(s.name)}</span>
            <button class="rm" data-action="grocery-rm" data-i="${l}">×</button>
          </div>`).join("")}
      ${n.grocery.length?'<button class="chip mt-16" data-action="grocery-clear">Clear checked</button>':""}
    </div>

    <div class="disclaimer-box">Meal guidance is general wellness support tuned to your cycle phase — always adapt to your own dietary needs, preferences and any medical guidance you follow.</div>
  </div>`}d("add-meal-grocery",e=>{const t=L(),a=ne[t.phase][Number(e.dataset.i)];if(!a)return;let o=0;for(const s of a.ingredients)n.grocery.some(l=>l.name===s)||(n.grocery.push({name:s,done:!1}),o++);v(),B(o?`Added ${o} ingredient${o===1?"":"s"} 🛒`:"Already on your list ✓"),u()});d("grocery-toggle",e=>{const t=n.grocery[Number(e.dataset.i)];t&&(t.done=!t.done,v(),u())});d("grocery-rm",e=>{n.grocery.splice(Number(e.dataset.i),1),v(),u()});d("grocery-clear",()=>{n.grocery=n.grocery.filter(e=>!e.done),v(),u()});d("open-settings",()=>{const e=n.profile;O(`
    <h3 style="margin-bottom:14px;">Settings</h3>

    <div class="card">
      <h3 style="font-size:15px;">Cycle length</h3>
      <div class="stepper mt-8">
        <button data-action="set-cycle" data-d="-1">−</button>
        <div class="val" id="set-cycle-val">${e.cycleLength}<small>days</small></div>
        <button data-action="set-cycle" data-d="1">+</button>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:15px;">Period length</h3>
      <div class="stepper mt-8">
        <button data-action="set-period" data-d="-1">−</button>
        <div class="val" id="set-period-val">${e.periodLength}<small>days</small></div>
        <button data-action="set-period" data-d="1">+</button>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size:15px;">Concierge style</h3>
      <div class="chip-row mt-8">
        <button class="chip ${e.chatStyle==="detailed"?"on":""}" data-action="set-style" data-v="detailed">Detailed</button>
        <button class="chip ${e.chatStyle==="direct"?"on":""}" data-action="set-style" data-v="direct">Direct</button>
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
    <button class="btn-primary" data-action="close-settings">Done</button>`)});d("set-cycle",e=>{n.profile.cycleLength=Math.min(45,Math.max(20,n.profile.cycleLength+Number(e.dataset.d))),v();const t=document.getElementById("set-cycle-val");t&&(t.innerHTML=`${n.profile.cycleLength}<small>days</small>`)});d("set-period",e=>{n.profile.periodLength=Math.min(10,Math.max(1,n.profile.periodLength+Number(e.dataset.d))),v();const t=document.getElementById("set-period-val");t&&(t.innerHTML=`${n.profile.periodLength}<small>days</small>`)});d("set-style",e=>{n.profile.chatStyle=e.dataset.v,v(),document.querySelectorAll('[data-action="set-style"]').forEach(t=>t.classList.toggle("on",t.dataset.v===n.profile.chatStyle)),B(`Concierge set to ${n.profile.chatStyle}`)});d("export-data",()=>{const e=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=`wooma-export-${C()}.json`,t.click(),URL.revokeObjectURL(t.href),B("Data exported ⬇")});d("erase-data",()=>{O(`
    <h3>Erase all data?</h3>
    <p class="sub mt-8">This permanently deletes your cycle history, logs, chat and grocery list from this device. There is no server copy — this cannot be undone.</p>
    <button class="btn-primary" data-action="erase-confirm" style="background:var(--ph-menstrual);color:#fff;">Yes, erase everything</button>
    <button class="btn-text" data-action="close-settings">Cancel</button>`)});d("erase-confirm",()=>{$e(),D(),location.hash="",u()});d("close-settings",()=>{D(),u()});const Z=document.getElementById("app"),at=[{route:"today",icon:"☀️",label:"Today"},{route:"cycle",icon:"◌",label:"Cycle"},{route:"log",icon:"+",label:"Track"},{route:"chat",icon:"✦",label:"Concierge"},{route:"food",icon:"🥣",label:"Food"}];function ot(){const e=location.hash.replace(/^#\/?/,"");return n.profile.onboarded?["today","cycle","log","chat","food"].includes(e)?e:"today":"onboarding"}function J(e){location.hash===`#/${e}`?u():location.hash=`#/${e}`}function u(){const e=ot();if(window.scrollTo(0,0),e==="onboarding"){Z.innerHTML=Te();return}const t={today:Be,cycle:ze,log:Xe,chat:et,food:tt},a=`
    <nav class="tabbar">
      ${at.map(o=>`
        <button class="${o.route==="log"?"track-btn":""} ${e===o.route?"active":""}"
                data-action="nav" data-route="${o.route}">
          <span class="ic">${o.icon}</span><span>${o.label}</span>
        </button>`).join("")}
    </nav>`;Z.innerHTML=t[e]()+a,document.dispatchEvent(new CustomEvent("screen:mounted",{detail:{route:e}}))}d("nav",e=>J(e.dataset.route));Le();window.addEventListener("hashchange",u);u();
