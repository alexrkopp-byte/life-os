import { useState, useEffect, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const HABITS = [
  { id: "music",   label: "Music / Sync",   icon: "♪", color: "#E8FF47" },
  { id: "workout", label: "Workout",         icon: "◉", color: "#60A5FA" },
  { id: "meditate",label: "Meditation",      icon: "◎", color: "#34D399" },
  { id: "content", label: "Content",         icon: "◈", color: "#FF6B35" },
  { id: "finance", label: "Finance",         icon: "◎", color: "#34D399" },
  { id: "dj",      label: "DJ Practice",     icon: "⦿", color: "#C084FC" },
  { id: "land",    label: "Land / Build",    icon: "⌂", color: "#FB7185" },
  { id: "review",  label: "Weekly Review",   icon: "⟁", color: "#4ECDC4" },
];

const NON_NEGS = [
  { id: "music3",   habit: "music",    text: "3+ music/sync sessions this week" },
  { id: "workout3", habit: "workout",  text: "3+ workouts this week" },
  { id: "content1", habit: "content",  text: "1+ piece of content posted" },
  { id: "finance1", habit: "finance",  text: "Finance check-in done" },
  { id: "review1",  habit: "review",   text: "Sunday review done" },
  { id: "land1",    habit: "land",     text: "1 action on land/cabin project" },
];

const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

const DEFAULT_SCHEDULE = {
  MON: [
    { time: "7–8am",    habit: "workout", task: "Gym / Run" },
    { time: "8–9am",    habit: "meditate",task: "Meditate + plan day" },
    { time: "9am–12pm", habit: "music",   task: "Music creation / sync session" },
    { time: "12–1pm",   habit: null,      task: "Lunch — cook something real" },
    { time: "1–3pm",    habit: null,      task: "Tour management window" },
    { time: "3–4pm",    habit: "finance", task: "Markets / trading review" },
    { time: "4–5pm",    habit: "content", task: "Content creation / post" },
    { time: "5pm+",     habit: null,      task: "Partner time / personal" },
  ],
  TUE: [
    { time: "7–8am",    habit: "workout", task: "Gym / Run" },
    { time: "8–9am",    habit: "meditate",task: "Meditate" },
    { time: "9am–12pm", habit: "music",   task: "Music creation / sync session" },
    { time: "12–1pm",   habit: null,      task: "Lunch" },
    { time: "1–3pm",    habit: null,      task: "Tour management window" },
    { time: "3–4pm",    habit: "finance", task: "Options trade review" },
    { time: "4–5pm",    habit: "content", task: "Shoot / edit content" },
    { time: "5pm+",     habit: null,      task: "Partner time / personal" },
  ],
  WED: [
    { time: "7–8am",    habit: "workout", task: "Ocean / long walk" },
    { time: "8–9am",    habit: "meditate",task: "Meditate" },
    { time: "9am–12pm", habit: "music",   task: "Music creation / sync session" },
    { time: "12–1pm",   habit: null,      task: "Lunch" },
    { time: "1–3pm",    habit: null,      task: "Tour management window" },
    { time: "3–4pm",    habit: "finance", task: "Investing + portfolio check" },
    { time: "4–5pm",    habit: "land",    task: "App / business sprint" },
    { time: "5pm+",     habit: null,      task: "Partner time / personal" },
  ],
  THU: [
    { time: "7–8am",    habit: "workout", task: "Gym / Run" },
    { time: "8–9am",    habit: "meditate",task: "Meditate" },
    { time: "9am–12pm", habit: "music",   task: "Music creation / sync session" },
    { time: "12–1pm",   habit: null,      task: "Lunch" },
    { time: "1–3pm",    habit: null,      task: "Tour management window" },
    { time: "3–4pm",    habit: "finance", task: "Options trade / learning" },
    { time: "4–5pm",    habit: "content", task: "Content strategy / writing" },
    { time: "5pm+",     habit: null,      task: "Partner time / personal" },
  ],
  FRI: [
    { time: "7–8am",    habit: "workout", task: "Gym / Run" },
    { time: "8–9am",    habit: "meditate",task: "Meditate" },
    { time: "9am–12pm", habit: "music",   task: "Music creation / sync session" },
    { time: "12–1pm",   habit: null,      task: "Lunch" },
    { time: "1–3pm",    habit: null,      task: "Tour management — wrap week" },
    { time: "3–4pm",    habit: "finance", task: "Weekly finance review" },
    { time: "4–5pm",    habit: "land",    task: "App / business sprint" },
    { time: "5pm+",     habit: null,      task: "Partner time / personal" },
  ],
  SAT: [
    { time: "7–9am",    habit: "workout", task: "Ocean / slow morning" },
    { time: "9am–12pm", habit: "dj",      task: "DJ practice session" },
    { time: "12–2pm",   habit: null,      task: "Lunch + cook properly" },
    { time: "2–5pm",    habit: "content", task: "Content batch day" },
    { time: "5pm+",     habit: null,      task: "Shows / social / free" },
  ],
  SUN: [
    { time: "7–9am",    habit: null,      task: "Rest / ocean / slow" },
    { time: "9–11am",   habit: "review",  task: "Weekly review (30 min)" },
    { time: "11am–1pm", habit: "land",    task: "Cabin / land / renovation planning" },
    { time: "1–3pm",    habit: "finance", task: "NYC home search" },
    { time: "3pm+",     habit: null,      task: "Meal prep + partner time" },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

const todayDayName = () => {
  const names = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  return names[new Date().getDay()];
};



const daysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
const firstDayOfMonth = (year, month) => {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Mon=0
};

const getHabit = (id) => HABITS.find(h => h.id === id);

// ─── STORAGE HOOK ─────────────────────────────────────────────────────────────

function useStorage(key, defaultVal) {
  const [val, setVal] = useState(defaultVal);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(key);
        if (r) setVal(JSON.parse(r.value));
      } catch(e) {}
      setLoaded(true);
    })();
  }, [key]);

  const save = useCallback(async (newVal) => {
    const v = typeof newVal === "function" ? newVal(val) : newVal;
    setVal(v);
    try { await window.storage.set(key, JSON.stringify(v)); } catch(e) {}
  }, [key, val]);

  return [val, save, loaded];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HabitDot({ habitId, size = 8 }) {
  const h = getHabit(habitId);
  if (!h) return null;
  return <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:h.color, flexShrink:0 }} />;
}

function Pill({ habitId, small }) {
  const h = getHabit(habitId);
  if (!h) return (
    <span style={{ padding: small?"2px 7px":"3px 9px", borderRadius:20, fontSize:small?9:10, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.3)", letterSpacing:"0.05em" }}>PERSONAL</span>
  );
  return (
    <span style={{ padding: small?"2px 7px":"3px 9px", borderRadius:20, fontSize:small?9:10, background:h.color+"22", color:h.color, border:`1px solid ${h.color}44`, letterSpacing:"0.05em", fontWeight:700, display:"inline-flex", alignItems:"center", gap:4 }}>
      <span>{h.icon}</span><span>{h.label.toUpperCase()}</span>
    </span>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("today");
  // today's habit log: { "2026-03-05": { music: true, workout: false, ... } }
  const [habitLog, setHabitLog] = useStorage("habitlog-v1", {});
const [weekChecks, setWeekChecks] = useStorage("weekcheck-v1", {});
const [schedule, setSchedule] = useStorage("schedule-v1", DEFAULT_SCHEDULE);

  const [editingBlock, setEditingBlock] = useState(null);
  const [editText, setEditText] = useState("");
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });

  const todayStr = today();
  const todayDay = todayDayName();

  // Week ID: simple ISO week approximation
  const weekId = (() => {
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const wk = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${wk}`;
  })();

  const todayHabits = habitLog[todayStr] || {};
  const currentWeekChecks = weekChecks[weekId] || {};

  const toggleHabit = async (habitId) => {
    const updated = { ...habitLog, [todayStr]: { ...(habitLog[todayStr]||{}), [habitId]: !todayHabits[habitId] } };
    setHabitLog(updated);
  };

  const toggleWeekCheck = async (checkId) => {
    const updated = { ...weekChecks, [weekId]: { ...(weekChecks[weekId]||{}), [checkId]: !currentWeekChecks[checkId] } };
    setWeekChecks(updated);
  };

  const startEdit = (day, idx) => {
    setEditingBlock({ day, idx });
    setEditText(schedule[day][idx].task);
  };

  const saveEdit = async () => {
    if (!editingBlock) return;
    const { day, idx } = editingBlock;
    const updated = { ...schedule, [day]: schedule[day].map((b,i) => i===idx ? {...b, task: editText} : b) };
    setSchedule(updated);
    setEditingBlock(null);
  };

  const habitsDoneToday = HABITS.filter(h => todayHabits[h.id]).length;
  const nnDone = NON_NEGS.filter(n => currentWeekChecks[n.id]).length;

  // Cal helpers
  const { year, month } = calMonth;
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });

  // For a given date string, get done habits
  const dayScore = (dateStr) => {
    const log = habitLog[dateStr] || {};
    return HABITS.filter(h => log[h.id]).length;
  };

  const scoreColor = (score) => {
    if (score === 0) return "rgba(255,255,255,0.04)";
    if (score <= 2) return "#E8FF4730";
    if (score <= 4) return "#E8FF4770";
    return "#E8FF47bb";
  };

  const VIEWS = ["today","week","calendar","schedule"];

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#f0f0f0", fontFamily:"'Courier New', monospace", paddingBottom:60 }}>

      {/* TOP BAR */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"20px 20px 14px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.35em", color:"rgba(255,255,255,0.25)", marginBottom:4 }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toUpperCase()}
          </div>
          <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", color:"#E8FF47" }}>LIFE OS <span style={{color:"rgba(255,255,255,0.2)"}}>2026</span></div>
        </div>
        <div style={{ display:"flex", gap:2, background:"rgba(255,255,255,0.04)", borderRadius:6, padding:3 }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"6px 12px", borderRadius:4,
              background: view===v ? "#E8FF47" : "transparent",
              color: view===v ? "#080808" : "rgba(255,255,255,0.35)",
              border:"none", cursor:"pointer", fontSize:10,
              letterSpacing:"0.1em", fontFamily:"'Courier New', monospace", fontWeight:700, transition:"all 0.15s",
            }}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 20px" }}>

        {/* ── TODAY VIEW ── */}
        {view === "today" && (
          <div>
            {/* Progress ring summary */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, padding:"16px 18px", background:"rgba(232,255,71,0.05)", border:"1px solid rgba(232,255,71,0.15)", borderRadius:8 }}>
              <div style={{ position:"relative", width:52, height:52 }}>
                <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="#E8FF47" strokeWidth="4"
                    strokeDasharray={`${2*Math.PI*20}`}
                    strokeDashoffset={`${2*Math.PI*20*(1 - habitsDoneToday/HABITS.length)}`}
                    strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#E8FF47" }}>{habitsDoneToday}</div>
              </div>
              <div>
                <div style={{ fontSize:13, color:"#f0f0f0", marginBottom:2 }}>{habitsDoneToday === HABITS.length ? "🔥 Full day — locked in." : habitsDoneToday >= 4 ? "Solid day so far." : "Let's get it."}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>{habitsDoneToday} / {HABITS.length} HABITS TODAY</div>
              </div>
            </div>

            {/* Habit checklist */}
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>TODAY — {todayStr}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:28 }}>
              {HABITS.map(h => {
                const done = !!todayHabits[h.id];
                return (
                  <div key={h.id} onClick={() => toggleHabit(h.id)} style={{
                    display:"flex", alignItems:"center", gap:13, padding:"12px 15px",
                    background: done ? `${h.color}12` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${done ? h.color+"40" : "rgba(255,255,255,0.07)"}`,
                    borderRadius:7, cursor:"pointer", transition:"all 0.2s",
                  }}>
                    <div style={{
                      width:20, height:20, borderRadius:4, flexShrink:0,
                      border: `2px solid ${done ? h.color : "rgba(255,255,255,0.18)"}`,
                      background: done ? h.color : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.2s",
                    }}>
                      {done && <span style={{ color:"#080808", fontSize:11, fontWeight:900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:16, color: done ? h.color : "rgba(255,255,255,0.4)" }}>{h.icon}</span>
                    <span style={{ flex:1, fontSize:13, color: done ? "#f0f0f0" : "rgba(255,255,255,0.5)", textDecoration: done ? "none" : "none" }}>{h.label}</span>
                    {done && <span style={{ fontSize:9, letterSpacing:"0.15em", color:h.color }}>DONE</span>}
                  </div>
                );
              })}
            </div>

            {/* Today's schedule preview */}
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>TODAY'S SCHEDULE — {todayDay}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {(schedule[todayDay]||[]).map((block,i) => {
                const h = getHabit(block.habit);
                return (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                    background: h ? `${h.color}0a` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${h ? h.color+"28" : "rgba(255,255,255,0.05)"}`,
                    borderRadius:5,
                  }}>
                    <div style={{ minWidth:80, fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.03em" }}>{block.time}</div>
                    <div style={{ flex:1, fontSize:12, color: h ? "#f0f0f0" : "rgba(255,255,255,0.4)" }}>{block.task}</div>
                    {h && <HabitDot habitId={h.id} size={7} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WEEK VIEW ── */}
        {view === "week" && (
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>WEEK {weekId} — NON-NEGOTIABLES</div>
            {/* Progress */}
            <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, marginBottom:16, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(nnDone/NON_NEGS.length)*100}%`, background:"#E8FF47", transition:"width 0.4s ease", borderRadius:2 }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:28 }}>
              {NON_NEGS.map(nn => {
                const done = !!currentWeekChecks[nn.id];
                const h = getHabit(nn.habit);
                return (
                  <div key={nn.id} onClick={() => toggleWeekCheck(nn.id)} style={{
                    display:"flex", alignItems:"center", gap:13, padding:"12px 15px",
                    background: done ? "rgba(232,255,71,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${done ? "rgba(232,255,71,0.25)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius:7, cursor:"pointer", transition:"all 0.2s",
                  }}>
                    <div style={{
                      width:18, height:18, borderRadius:3, flexShrink:0,
                      border: `2px solid ${done ? "#E8FF47" : "rgba(255,255,255,0.18)"}`,
                      background: done ? "#E8FF47" : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s",
                    }}>
                      {done && <span style={{ color:"#080808", fontSize:10, fontWeight:900 }}>✓</span>}
                    </div>
                    <span style={{ flex:1, fontSize:12, color: done ? "rgba(255,255,255,0.35)" : "#f0f0f0", textDecoration: done ? "line-through" : "none" }}>{nn.text}</span>
                    {h && <Pill habitId={h.id} small />}
                  </div>
                );
              })}
            </div>

            {/* Day-by-day schedule */}
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>WEEKLY SCHEDULE</div>
            {DAYS.map(day => (
              <div key={day} style={{ marginBottom:16 }}>
                <div style={{
                  fontSize:10, fontWeight:700, letterSpacing:"0.15em",
                  color: day === todayDay ? "#E8FF47" : "rgba(255,255,255,0.3)",
                  marginBottom:6, display:"flex", alignItems:"center", gap:8,
                }}>
                  {day}
                  {day === todayDay && <span style={{ fontSize:8, background:"#E8FF47", color:"#080808", padding:"1px 6px", borderRadius:10 }}>TODAY</span>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {(schedule[day]||[]).map((block,i) => {
                    const h = getHabit(block.habit);
                    return (
                      <div key={i} style={{
                        display:"flex", alignItems:"center", gap:10, padding:"8px 12px",
                        background: h ? `${h.color}0a` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${h ? h.color+"20" : "rgba(255,255,255,0.04)"}`,
                        borderRadius:5,
                      }}>
                        <div style={{ minWidth:78, fontSize:9, color:"rgba(255,255,255,0.25)" }}>{block.time}</div>
                        <div style={{ flex:1, fontSize:11, color: h ? "#e0e0e0" : "rgba(255,255,255,0.35)" }}>{block.task}</div>
                        {h && <HabitDot habitId={h.id} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === "calendar" && (
          <div>
            {/* Month nav */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <button onClick={() => setCalMonth(p => { const d = new Date(p.year, p.month-1); return {year:d.getFullYear(), month:d.getMonth()}; })}
                style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)", borderRadius:4, padding:"6px 14px", cursor:"pointer", fontFamily:"'Courier New', monospace", fontSize:12 }}>← PREV</button>
              <div style={{ fontSize:14, fontWeight:700, letterSpacing:"0.1em", color:"#E8FF47" }}>{monthName.toUpperCase()} {year}</div>
              <button onClick={() => setCalMonth(p => { const d = new Date(p.year, p.month+1); return {year:d.getFullYear(), month:d.getMonth()}; })}
                style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)", borderRadius:4, padding:"6px 14px", cursor:"pointer", fontFamily:"'Courier New', monospace", fontSize:12 }}>NEXT →</button>
            </div>

            {/* Day labels */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
              {["M","T","W","T","F","S","S"].map((d,i) => (
                <div key={i} style={{ textAlign:"center", fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em", padding:"4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:24 }}>
              {Array.from({ length: firstDay }).map((_,i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: numDays }).map((_,i) => {
                const day = i+1;
                const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const score = dayScore(dateStr);
                const isToday = dateStr === todayStr;
                const isFuture = dateStr > todayStr;
                return (
                  <div key={day} style={{
                    aspectRatio:"1", borderRadius:5,
                    background: isFuture ? "rgba(255,255,255,0.02)" : score === 0 ? "rgba(255,255,255,0.04)" : scoreColor(score),
                    border: isToday ? "2px solid #E8FF47" : "1px solid rgba(255,255,255,0.06)",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    gap:2,
                  }}>
                    <div style={{ fontSize:10, color: isToday ? "#E8FF47" : isFuture ? "rgba(255,255,255,0.2)" : score > 0 ? "#080808" : "rgba(255,255,255,0.35)", fontWeight: isToday ? 700 : 400 }}>{day}</div>
                    {!isFuture && score > 0 && (
                      <div style={{ fontSize:7, color: score > 0 ? "#080808cc" : "transparent", fontWeight:700 }}>{score}/{HABITS.length}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ fontSize:10, letterSpacing:"0.15em", color:"rgba(255,255,255,0.25)", marginBottom:10 }}>INTENSITY LEGEND</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:24, flexWrap:"wrap" }}>
              {[
                { label:"0 habits", bg:"rgba(255,255,255,0.04)" },
                { label:"1–2", bg:"#E8FF4730" },
                { label:"3–4", bg:"#E8FF4770" },
                { label:"5+", bg:"#E8FF47bb" },
              ].map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:14, height:14, borderRadius:3, background:l.bg, border:"1px solid rgba(255,255,255,0.08)" }} />
                  <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Habit breakdown for month */}
            <div style={{ fontSize:10, letterSpacing:"0.15em", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>MONTHLY STREAKS</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {HABITS.map(h => {
                const count = Array.from({length:numDays},(_,i)=>{
                  const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
                  return (habitLog[ds]||{})[h.id] ? 1 : 0;
                }).reduce((a,b)=>a+b,0);
                const pct = numDays > 0 ? count / numDays : 0;
                return (
                  <div key={h.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:90, fontSize:10, color:h.color, letterSpacing:"0.05em", flexShrink:0 }}>{h.icon} {h.label}</div>
                    <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct*100}%`, background:h.color, borderRadius:3, transition:"width 0.5s ease" }} />
                    </div>
                    <div style={{ width:32, fontSize:10, color:"rgba(255,255,255,0.35)", textAlign:"right" }}>{count}d</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SCHEDULE EDIT VIEW ── */}
        {view === "schedule" && (
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.25)", marginBottom:4 }}>EDIT YOUR SCHEDULE</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:20 }}>Tap any task to rename it. Changes save automatically.</div>
            {DAYS.map(day => (
              <div key={day} style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"rgba(255,255,255,0.4)", marginBottom:7 }}>{day}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {(schedule[day]||[]).map((block,idx) => {
                    const h = getHabit(block.habit);
                    const isEditing = editingBlock?.day===day && editingBlock?.idx===idx;
                    return (
                      <div key={idx} style={{
                        display:"flex", alignItems:"center", gap:10, padding:"10px 13px",
                        background: h ? `${h.color}0d` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isEditing ? "#E8FF47" : h ? h.color+"28" : "rgba(255,255,255,0.06)"}`,
                        borderRadius:6,
                      }}>
                        <div style={{ minWidth:78, fontSize:9, color:"rgba(255,255,255,0.25)" }}>{block.time}</div>
                        {isEditing ? (
                          <input value={editText} onChange={e=>setEditText(e.target.value)}
                            onBlur={saveEdit} onKeyDown={e=>e.key==="Enter"&&saveEdit()} autoFocus
                            style={{ flex:1, background:"transparent", border:"none", borderBottom:"1px solid #E8FF47", color:"#f0f0f0", fontSize:12, fontFamily:"'Courier New', monospace", outline:"none", padding:"2px 0" }}
                          />
                        ) : (
                          <div onClick={() => startEdit(day,idx)} style={{ flex:1, fontSize:12, cursor:"text", color: h ? "#e0e0e0" : "rgba(255,255,255,0.35)" }}>{block.task}</div>
                        )}
                        <Pill habitId={block.habit} small />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}