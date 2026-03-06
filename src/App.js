import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eelvvjjbtqrmzfzuegbi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbHZ2ampidHFybXpmenVlZ2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzE1NjMsImV4cCI6MjA4ODQwNzU2M30.PAtxWCrYHn3mvTPZHhe6MUOfAADCF7UjiUJTf9EMB_o";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Theme ─────────────────────────────────────────────────────────────────────
function useColorScheme() {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return systemDark;
  });
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return [dark, toggle];
}

const DARK = {
  bg:"#080808", bgCard:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.07)",
  borderCard:"rgba(255,255,255,0.06)", text:"#f0f0f0", textMid:"rgba(255,255,255,0.5)",
  textDim:"rgba(255,255,255,0.22)", textFaint:"rgba(255,255,255,0.12)",
  accent:"#E8FF47", accentText:"#080808", navBg:"rgba(255,255,255,0.04)",
  ringTrack:"rgba(255,255,255,0.08)", calEmpty:"rgba(255,255,255,0.02)",
  barBg:"rgba(255,255,255,0.06)", inputBorder:"rgba(255,255,255,0.1)",
  ghostBg:"#1a1a0a", scoreText:"#080808",
};
const LIGHT = {
  bg:"#f5f5f0", bgCard:"rgba(0,0,0,0.04)", border:"rgba(0,0,0,0.09)",
  borderCard:"rgba(0,0,0,0.07)", text:"#111111", textMid:"rgba(0,0,0,0.55)",
  textDim:"rgba(0,0,0,0.38)", textFaint:"rgba(0,0,0,0.18)",
  accent:"#b8c800", accentText:"#ffffff", navBg:"rgba(0,0,0,0.06)",
  ringTrack:"rgba(0,0,0,0.1)", calEmpty:"rgba(0,0,0,0.03)",
  barBg:"rgba(0,0,0,0.07)", inputBorder:"rgba(0,0,0,0.15)",
  ghostBg:"#e8e8d8", scoreText:"#ffffff",
};

const HABITS_DARK = [
  { id:"music",    label:"Music / Sync",  icon:"♪", color:"#E8FF47" },
  { id:"workout",  label:"Workout",        icon:"◉", color:"#60A5FA" },
  { id:"meditate", label:"Meditation",     icon:"◎", color:"#34D399" },
  { id:"content",  label:"Content",        icon:"◈", color:"#FF6B35" },
  { id:"finance",  label:"Finance",        icon:"◎", color:"#34D399" },
  { id:"dj",       label:"DJ Practice",    icon:"⦿", color:"#C084FC" },
  { id:"land",     label:"Land / Build",   icon:"⌂", color:"#FB7185" },
  { id:"review",   label:"Weekly Review",  icon:"⟁", color:"#4ECDC4" },
];
const HABITS_LIGHT = [
  { id:"music",    label:"Music / Sync",  icon:"♪", color:"#b8a800" },
  { id:"workout",  label:"Workout",        icon:"◉", color:"#2563eb" },
  { id:"meditate", label:"Meditation",     icon:"◎", color:"#059669" },
  { id:"content",  label:"Content",        icon:"◈", color:"#ea580c" },
  { id:"finance",  label:"Finance",        icon:"◎", color:"#059669" },
  { id:"dj",       label:"DJ Practice",    icon:"⦿", color:"#7c3aed" },
  { id:"land",     label:"Land / Build",   icon:"⌂", color:"#e11d48" },
  { id:"review",   label:"Weekly Review",  icon:"⟁", color:"#0891b2" },
];

const NON_NEGS = [
  { id:"music3",   habit:"music",   text:"3+ music/sync sessions this week" },
  { id:"workout3", habit:"workout", text:"3+ workouts this week" },
  { id:"content1", habit:"content", text:"1+ piece of content posted" },
  { id:"finance1", habit:"finance", text:"Finance check-in done" },
  { id:"review1",  habit:"review",  text:"Sunday review done" },
  { id:"land1",    habit:"land",    text:"1 action on land/cabin project" },
];

const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

const DEFAULT_SCHEDULE = {
  MON:[
    {time:"7–8am",habit:"workout",task:"Gym / Run"},
    {time:"8–9am",habit:"meditate",task:"Meditate + plan day"},
    {time:"9am–12pm",habit:"music",task:"Music creation / sync session"},
    {time:"12–1pm",habit:null,task:"Lunch — cook something real"},
    {time:"1–3pm",habit:null,task:"Tour management window"},
    {time:"3–4pm",habit:"finance",task:"Markets / trading review"},
    {time:"4–5pm",habit:"content",task:"Content creation / post"},
    {time:"5pm+",habit:null,task:"Partner time / personal"},
  ],
  TUE:[
    {time:"7–8am",habit:"workout",task:"Gym / Run"},
    {time:"8–9am",habit:"meditate",task:"Meditate"},
    {time:"9am–12pm",habit:"music",task:"Music creation / sync session"},
    {time:"12–1pm",habit:null,task:"Lunch"},
    {time:"1–3pm",habit:null,task:"Tour management window"},
    {time:"3–4pm",habit:"finance",task:"Options trade review"},
    {time:"4–5pm",habit:"content",task:"Shoot / edit content"},
    {time:"5pm+",habit:null,task:"Partner time / personal"},
  ],
  WED:[
    {time:"7–8am",habit:"workout",task:"Ocean / long walk"},
    {time:"8–9am",habit:"meditate",task:"Meditate"},
    {time:"9am–12pm",habit:"music",task:"Music creation / sync session"},
    {time:"12–1pm",habit:null,task:"Lunch"},
    {time:"1–3pm",habit:null,task:"Tour management window"},
    {time:"3–4pm",habit:"finance",task:"Investing + portfolio check"},
    {time:"4–5pm",habit:"land",task:"App / business sprint"},
    {time:"5pm+",habit:null,task:"Partner time / personal"},
  ],
  THU:[
    {time:"7–8am",habit:"workout",task:"Gym / Run"},
    {time:"8–9am",habit:"meditate",task:"Meditate"},
    {time:"9am–12pm",habit:"music",task:"Music creation / sync session"},
    {time:"12–1pm",habit:null,task:"Lunch"},
    {time:"1–3pm",habit:null,task:"Tour management window"},
    {time:"3–4pm",habit:"finance",task:"Options trade / learning"},
    {time:"4–5pm",habit:"content",task:"Content strategy / writing"},
    {time:"5pm+",habit:null,task:"Partner time / personal"},
  ],
  FRI:[
    {time:"7–8am",habit:"workout",task:"Gym / Run"},
    {time:"8–9am",habit:"meditate",task:"Meditate"},
    {time:"9am–12pm",habit:"music",task:"Music creation / sync session"},
    {time:"12–1pm",habit:null,task:"Lunch"},
    {time:"1–3pm",habit:null,task:"Tour management — wrap week"},
    {time:"3–4pm",habit:"finance",task:"Weekly finance review"},
    {time:"4–5pm",habit:"land",task:"App / business sprint"},
    {time:"5pm+",habit:null,task:"Partner time / personal"},
  ],
  SAT:[
    {time:"7–9am",habit:"workout",task:"Ocean / slow morning"},
    {time:"9am–12pm",habit:"dj",task:"DJ practice session"},
    {time:"12–2pm",habit:null,task:"Lunch + cook properly"},
    {time:"2–5pm",habit:"content",task:"Content batch day"},
    {time:"5pm+",habit:null,task:"Shows / social / free"},
  ],
  SUN:[
    {time:"7–9am",habit:null,task:"Rest / ocean / slow"},
    {time:"9–11am",habit:"review",task:"Weekly review (30 min)"},
    {time:"11am–1pm",habit:"land",task:"Cabin / land / renovation planning"},
    {time:"1–3pm",habit:"finance",task:"NYC home search"},
    {time:"3pm+",habit:null,task:"Meal prep + partner time"},
  ],
};

const getTodayStr = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const getTodayDay = () => ["SUN","MON","TUE","WED","THU","FRI","SAT"][new Date().getDay()];
const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const firstDayOfMonth = (y,m) => { const d=new Date(y,m,1).getDay(); return d===0?6:d-1; };

// ── Supabase data hooks ───────────────────────────────────────────────────────

function useHabitLog(userId) {
  const [log, setLog] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase.from("habit_logs").select("*").eq("user_id", userId)
      .then(({ data }) => {
        if (!data) return;
        const mapped = {};
        data.forEach(row => {
          if (!mapped[row.date]) mapped[row.date] = {};
          mapped[row.date][row.habit_id] = row.done;
        });
        setLog(mapped);
        setLoading(false);
      });
  }, [userId]);

  const toggle = useCallback(async (date, habitId, current) => {
    const newVal = !current;
    setLog(prev => ({ ...prev, [date]: { ...(prev[date]||{}), [habitId]: newVal } }));
    await supabase.from("habit_logs").upsert(
      { user_id: userId, date, habit_id: habitId, done: newVal },
      { onConflict: "user_id,date,habit_id" }
    );
  }, [userId]);

  return [log, toggle, loading];
}

function useWeekChecks(userId) {
  const [checks, setChecks] = useState({});

  useEffect(() => {
    if (!userId) return;
    supabase.from("week_checks").select("*").eq("user_id", userId)
      .then(({ data }) => {
        if (!data) return;
        const mapped = {};
        data.forEach(row => {
          if (!mapped[row.week_id]) mapped[row.week_id] = {};
          mapped[row.week_id][row.check_id] = row.done;
        });
        setChecks(mapped);
      });
  }, [userId]);

  const toggle = useCallback(async (weekId, checkId, current) => {
    const newVal = !current;
    setChecks(prev => ({ ...prev, [weekId]: { ...(prev[weekId]||{}), [checkId]: newVal } }));
    await supabase.from("week_checks").upsert(
      { user_id: userId, week_id: weekId, check_id: checkId, done: newVal },
      { onConflict: "user_id,week_id,check_id" }
    );
  }, [userId]);

  return [checks, toggle];
}

function useSchedule(userId) {
  const [schedule, setScheduleState] = useState(DEFAULT_SCHEDULE);
  const [todayOverride, setTodayOverrideState] = useState({});

  useEffect(() => {
    if (!userId) return;
    supabase.from("schedule_overrides").select("*").eq("user_id", userId)
      .then(({ data }) => {
        if (!data) return;
        const sched = { ...DEFAULT_SCHEDULE };
        const overrides = {};
        data.forEach(row => {
          if (row.key.startsWith("day-")) sched[row.key.replace("day-","")] = row.blocks;
          else overrides[row.key] = row.blocks;
        });
        setScheduleState(sched);
        setTodayOverrideState(overrides);
      });
  }, [userId]);

  const saveScheduleDay = useCallback(async (day, blocks) => {
    setScheduleState(prev => ({ ...prev, [day]: blocks }));
    await supabase.from("schedule_overrides").upsert(
      { user_id: userId, key: `day-${day}`, blocks },
      { onConflict: "user_id,key" }
    );
  }, [userId]);

  const saveTodayOverride = useCallback(async (date, blocks) => {
    setTodayOverrideState(prev => ({ ...prev, [date]: blocks }));
    await supabase.from("schedule_overrides").upsert(
      { user_id: userId, key: date, blocks },
      { onConflict: "user_id,key" }
    );
  }, [userId]);

  const clearTodayOverride = useCallback(async (date) => {
    setTodayOverrideState(prev => { const n={...prev}; delete n[date]; return n; });
    await supabase.from("schedule_overrides").delete().eq("user_id", userId).eq("key", date);
  }, [userId]);

  return [schedule, todayOverride, saveScheduleDay, saveTodayOverride, clearTodayOverride];
}

// ── UI Components ─────────────────────────────────────────────────────────────

function Pill({ habitId, habits, t }) {
  const h = habits.find(x=>x.id===habitId);
  if (!h) return <span style={{padding:"2px 7px",borderRadius:20,fontSize:9,background:t.bgCard,color:t.textDim,letterSpacing:"0.04em",whiteSpace:"nowrap",border:`1px solid ${t.borderCard}`}}>PERSONAL</span>;
  return <span style={{padding:"2px 7px",borderRadius:20,fontSize:9,background:h.color+"22",color:h.color,border:`1px solid ${h.color}44`,letterSpacing:"0.04em",fontWeight:700,display:"inline-flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>{h.icon} {h.label.toUpperCase()}</span>;
}

function DraggableList({ items, onReorder, dayKey, editingBlock, editText, setEditText, onEditTask, saveEdit, habits, t }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const itemRefs = useRef([]);
  const touchRef = useRef({ active:false, startIdx:null, ghost:null });

  const doSwap = (src, dst) => {
    if (src===null||dst===null||src===dst) return;
    const next=[...items];
    const {task:t1,habit:h1}=next[src],{task:t2,habit:h2}=next[dst];
    next[src]={...next[src],task:t2,habit:h2};
    next[dst]={...next[dst],task:t1,habit:h1};
    onReorder(next);
  };

  const idxFromY = y => {
    for (let i=0;i<itemRefs.current.length;i++) {
      const el=itemRefs.current[i]; if(!el) continue;
      const r=el.getBoundingClientRect();
      if (y<r.top+r.height/2) return i;
    }
    return itemRefs.current.length-1;
  };

  const onDragStart=(e,i)=>{ setDragIdx(i); e.dataTransfer.effectAllowed="move"; const g=document.createElement("div"); g.style.cssText="position:absolute;top:-9999px;"; document.body.appendChild(g); e.dataTransfer.setDragImage(g,0,0); requestAnimationFrame(()=>document.body.removeChild(g)); };
  const onDragOver=(e,i)=>{ e.preventDefault(); setOverIdx(i); };
  const onDrop=(e,i)=>{ e.preventDefault(); doSwap(dragIdx,i); setDragIdx(null); setOverIdx(null); };
  const onDragEnd=()=>{ setDragIdx(null); setOverIdx(null); };

  const onTouchStart=(e,i)=>{ const touch=e.touches[0]; touchRef.current={active:true,startIdx:i,ghost:null}; setDragIdx(i); const el=itemRefs.current[i]; if(el){ const g=el.cloneNode(true),r=el.getBoundingClientRect(); g.style.cssText=`position:fixed;pointer-events:none;opacity:0.92;z-index:9999;width:${r.width}px;left:${r.left}px;top:${touch.clientY-r.height/2}px;border:1px solid ${t.accent}99;border-radius:7px;box-shadow:0 8px 30px rgba(0,0,0,0.4);background:${t.ghostBg};`; document.body.appendChild(g); touchRef.current.ghost=g; } };
  const onTouchMove=e=>{ if(!touchRef.current.active) return; e.preventDefault(); const y=e.touches[0].clientY; if(touchRef.current.ghost) touchRef.current.ghost.style.top=`${y-24}px`; setOverIdx(idxFromY(y)); };
  const onTouchEnd=()=>{ if(!touchRef.current.active) return; doSwap(touchRef.current.startIdx,overIdx); if(touchRef.current.ghost) document.body.removeChild(touchRef.current.ghost); touchRef.current={active:false,startIdx:null,ghost:null}; setDragIdx(null); setOverIdx(null); };

  return (
    <div onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{display:"flex",flexDirection:"column",gap:6}}>
      {items.map((block,idx)=>{
        const h=habits.find(x=>x.id===block.habit);
        const isDragging=dragIdx===idx,isOver=overIdx===idx&&dragIdx!==idx;
        const isEditing=editingBlock?.day===dayKey&&editingBlock?.idx===idx;
        return (
          <div key={idx} ref={el=>itemRefs.current[idx]=el}
            draggable onDragStart={e=>onDragStart(e,idx)} onDragOver={e=>onDragOver(e,idx)} onDrop={e=>onDrop(e,idx)} onDragEnd={onDragEnd}
            onTouchStart={e=>onTouchStart(e,idx)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"12px 13px",background:isDragging?t.accent+"11":isOver?t.accent+"08":h?`${h.color}0d`:t.bgCard,border:`1px solid ${isDragging?t.accent+"55":isOver?t.accent+"35":h?h.color+"28":t.borderCard}`,borderRadius:7,opacity:isDragging?0.35:1,transform:isOver?"translateY(-2px)":"none",boxShadow:isOver?"0 4px 18px rgba(0,0,0,0.2)":"none",transition:isDragging?"none":"transform 0.12s,box-shadow 0.12s",userSelect:"none",touchAction:"none"}}>
            <div style={{color:t.textFaint,fontSize:13,cursor:"grab",flexShrink:0,touchAction:"none"}}>⠿</div>
            <div style={{minWidth:74,fontSize:9,color:t.textDim,letterSpacing:"0.03em",flexShrink:0}}>{block.time}</div>
            {isEditing?(
              <input value={editText} onChange={e=>setEditText(e.target.value)} onBlur={saveEdit} onKeyDown={e=>e.key==="Enter"&&saveEdit()} autoFocus style={{flex:1,background:"transparent",border:"none",borderBottom:`1px solid ${t.accent}`,color:t.text,fontSize:12,fontFamily:"'Courier New',monospace",outline:"none",padding:"2px 0"}}/>
            ):(
              <div onClick={()=>onEditTask(dayKey,idx)} style={{flex:1,fontSize:12,cursor:"text",color:h?t.text:t.textMid,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{block.task}</div>
            )}
            <Pill habitId={block.habit} habits={habits} t={t}/>
          </div>
        );
      })}
    </div>
  );
}

function StaticList({ items, habits, t }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {items.map((block,i)=>{ const h=habits.find(x=>x.id===block.habit); return (
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:h?`${h.color}0a`:t.bgCard,border:`1px solid ${h?h.color+"1a":t.borderCard}`,borderRadius:5}}>
          <div style={{minWidth:74,fontSize:9,color:t.textDim}}>{block.time}</div>
          <div style={{flex:1,fontSize:11,color:h?t.text:t.textMid}}>{block.task}</div>
          {h&&<span style={{width:6,height:6,borderRadius:"50%",background:h.color,flexShrink:0,display:"inline-block"}}/>}
        </div>
      ); })}
    </div>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen({ t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputStyle = { width:"100%", background:"transparent", border:`1px solid ${t.inputBorder}`, borderRadius:6, padding:"11px 13px", color:t.text, fontSize:13, fontFamily:"'Courier New',monospace", outline:"none", boxSizing:"border-box" };
  const btnStyle = { width:"100%", padding:"12px", background:t.accent, color:t.accentText, border:"none", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'Courier New',monospace", fontWeight:700, letterSpacing:"0.1em" };

  const handle = async () => {
    setError(""); setLoading(true);
    if (mode==="signup") {
      const { error:e } = await supabase.auth.signUp({ email, password });
      if (e) setError(e.message);
      else setMessage("Check your email to confirm your account, then log in.");
    } else {
      const { error:e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{marginBottom:32,textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:700,color:t.accent,letterSpacing:"-0.02em",fontFamily:"'Courier New',monospace"}}>LIFE OS <span style={{color:t.textFaint}}>2026</span></div>
          <div style={{fontSize:11,color:t.textDim,marginTop:6,letterSpacing:"0.1em"}}>{mode==="login"?"SIGN IN":"CREATE ACCOUNT"}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" style={inputStyle}/>
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" style={inputStyle} onKeyDown={e=>e.key==="Enter"&&handle()}/>
          {error&&<div style={{fontSize:11,color:"#FB7185",padding:"8px 12px",background:"rgba(251,113,133,0.1)",borderRadius:5}}>{error}</div>}
          {message&&<div style={{fontSize:11,color:t.accent,padding:"8px 12px",background:t.accent+"15",borderRadius:5}}>{message}</div>}
          <button onClick={handle} disabled={loading} style={btnStyle}>{loading?"...":(mode==="login"?"SIGN IN":"CREATE ACCOUNT")}</button>
          <div style={{textAlign:"center",fontSize:11,color:t.textDim,cursor:"pointer"}} onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");setMessage("");}}>
            {mode==="login"?"No account? Sign up →":"Have an account? Sign in →"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, toggleTheme] = useColorScheme();
  const t = isDark ? DARK : LIGHT;
  const habits = isDark ? HABITS_DARK : HABITS_LIGHT;

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_,session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

const [habitLog, toggleHabit] = useHabitLog(userId);
  const [weekChecks, toggleWeekCheck] = useWeekChecks(userId);
  const [schedule, todayOverride, saveScheduleDay, saveTodayOverride, clearTodayOverride] = useSchedule(userId);

  const [view, setView] = useState("today");
  const [editingBlock, setEditingBlock] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeDay, setActiveDay] = useState(getTodayDay());
  const [calMonth, setCalMonth] = useState(()=>{ const n=new Date(); return {year:n.getFullYear(),month:n.getMonth()}; });

  const TODAY=getTodayStr(), TODAY_DAY=getTodayDay();
  const weekId=(()=>{ const d=new Date(),j=new Date(d.getFullYear(),0,1); return `${d.getFullYear()}-W${Math.ceil(((d-j)/86400000+j.getDay()+1)/7)}`; })();
  const todayHabits=habitLog[TODAY]||{};
  const curWeek=weekChecks[weekId]||{};
  const habitsDone=habits.filter(h=>todayHabits[h.id]).length;
  const nnDone=NON_NEGS.filter(n=>curWeek[n.id]).length;
  const todayBlocks=todayOverride[TODAY]||schedule[TODAY_DAY]||[];

  const onEditTask=(dayKey,idx)=>{ const items=dayKey==="TODAY"?todayBlocks:(schedule[dayKey]||[]); setEditingBlock({day:dayKey,idx}); setEditText(items[idx]?.task||""); };
  const saveEdit=()=>{
    if (!editingBlock) return;
    const {day,idx}=editingBlock;
    if (day==="TODAY") saveTodayOverride(TODAY, todayBlocks.map((b,i)=>i===idx?{...b,task:editText}:b));
    else saveScheduleDay(day, schedule[day].map((b,i)=>i===idx?{...b,task:editText}:b));
    setEditingBlock(null);
  };

  const {year,month}=calMonth;
  const numDays=daysInMonth(year,month);
  const firstDay=firstDayOfMonth(year,month);
  const monthName=new Date(year,month,1).toLocaleString("default",{month:"long"});
  const dayScore=ds=>habits.filter(h=>(habitLog[ds]||{})[h.id]).length;
  const scoreColor=s=>s===0?t.calEmpty:s<=2?t.accent+"30":s<=4?t.accent+"70":t.accent+"bb";
  const navBtn=active=>({padding:"6px 11px",borderRadius:4,background:active?t.accent:t.navBg,color:active?t.accentText:t.textMid,border:`1px solid ${active?t.accent:t.borderCard}`,cursor:"pointer",fontSize:10,letterSpacing:"0.08em",fontFamily:"'Courier New',monospace",fontWeight:700,transition:"all 0.15s"});
  const sl={habits,t};

  if (authLoading) return <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",color:t.textDim,fontFamily:"'Courier New',monospace",fontSize:11,letterSpacing:"0.2em"}}>LOADING...</div>;
  if (!session) return <AuthScreen t={t}/>;

  return (
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'Courier New',monospace",paddingBottom:70,transition:"background 0.3s,color 0.3s"}}>

      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${t.border}`,padding:"16px 16px 12px",display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:9,letterSpacing:"0.28em",color:t.textDim,marginBottom:3}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}</div>
          <div style={{fontSize:20,fontWeight:700,color:t.accent,letterSpacing:"-0.02em"}}>LIFE OS <span style={{color:t.textFaint}}>2026</span></div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{display:"flex",gap:2,background:t.navBg,borderRadius:6,padding:3}}>
            {["today","week","calendar","schedule"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={navBtn(view===v)}>{v.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={toggleTheme} style={{width:32,height:32,borderRadius:"50%",background:t.navBg,border:`1px solid ${t.borderCard}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}} title={isDark?"Switch to light mode":"Switch to dark mode"}>
  {isDark ? "☀️" : "🌙"}
</button>
<button onClick={()=>supabase.auth.signOut()} style={{fontSize:9,color:t.textDim,background:"transparent",border:`1px solid ${t.borderCard}`,borderRadius:4,padding:"6px 10px",cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.05em"}}>OUT</button>

        </div>
      </div>

      <div style={{padding:"16px 16px"}}>

        {/* TODAY */}
        {view==="today"&&<>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,padding:"13px 15px",background:t.accent+"0d",border:`1px solid ${t.accent}22`,borderRadius:8}}>
            <div style={{position:"relative",width:48,height:48,flexShrink:0}}>
              <svg width="48" height="48" style={{transform:"rotate(-90deg)"}}>
                <circle cx="24" cy="24" r="18" fill="none" stroke={t.ringTrack} strokeWidth="4"/>
                <circle cx="24" cy="24" r="18" fill="none" stroke={t.accent} strokeWidth="4" strokeDasharray={`${2*Math.PI*18}`} strokeDashoffset={`${2*Math.PI*18*(1-habitsDone/habits.length)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:t.accent}}>{habitsDone}</div>
            </div>
            <div>
              <div style={{fontSize:13,color:t.text,marginBottom:2}}>{habitsDone===habits.length?"🔥 Full day — locked in.":habitsDone>=4?"Solid day so far.":"Let's get it."}</div>
              <div style={{fontSize:10,color:t.textDim,letterSpacing:"0.07em"}}>{habitsDone}/{habits.length} HABITS</div>
            </div>
          </div>

          <div style={{fontSize:10,letterSpacing:"0.16em",color:t.textDim,marginBottom:9}}>HABITS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {habits.map(h=>{ const done=!!todayHabits[h.id]; return (
              <div key={h.id} onClick={()=>toggleHabit(TODAY,h.id,done)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",background:done?`${h.color}16`:t.bgCard,border:`1px solid ${done?h.color+"44":t.borderCard}`,borderRadius:7,cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:`2px solid ${done?h.color:t.textFaint}`,background:done?h.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{done&&<span style={{color:t.accentText,fontSize:10,fontWeight:900}}>✓</span>}</div>
                <span style={{fontSize:14,color:done?h.color:t.textDim}}>{h.icon}</span>
                <span style={{flex:1,fontSize:13,color:done?t.text:t.textMid}}>{h.label}</span>
                {done&&<span style={{fontSize:9,letterSpacing:"0.1em",color:h.color}}>DONE</span>}
              </div>
            ); })}
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
            <div style={{fontSize:10,letterSpacing:"0.16em",color:t.textDim}}>TODAY — {TODAY_DAY} · DRAG TO REPRIORITIZE</div>
            {todayOverride[TODAY]&&<button onClick={()=>clearTodayOverride(TODAY)} style={{fontSize:9,color:t.textMid,background:"transparent",border:`1px solid ${t.inputBorder}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontFamily:"'Courier New',monospace"}}>RESET</button>}
          </div>
          <div style={{fontSize:10,color:t.textFaint,marginBottom:10}}>Changes here are today only</div>
          <DraggableList items={todayBlocks} onReorder={items=>saveTodayOverride(TODAY,items)} dayKey="TODAY" editingBlock={editingBlock} editText={editText} setEditText={setEditText} onEditTask={onEditTask} saveEdit={saveEdit} {...sl}/>
        </>}

        {/* WEEK */}
        {view==="week"&&<>
          <div style={{fontSize:10,letterSpacing:"0.16em",color:t.textDim,marginBottom:9}}>WEEK {weekId} — NON-NEGOTIABLES</div>
          <div style={{height:3,background:t.barBg,borderRadius:2,marginBottom:13,overflow:"hidden"}}><div style={{height:"100%",width:`${(nnDone/NON_NEGS.length)*100}%`,background:t.accent,transition:"width 0.4s",borderRadius:2}}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {NON_NEGS.map(nn=>{ const done=!!curWeek[nn.id],h=habits.find(x=>x.id===nn.habit); return (
              <div key={nn.id} onClick={()=>toggleWeekCheck(weekId,nn.id,done)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",background:done?t.accent+"0d":t.bgCard,border:`1px solid ${done?t.accent+"30":t.borderCard}`,borderRadius:7,cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{width:17,height:17,borderRadius:3,flexShrink:0,border:`2px solid ${done?t.accent:t.textFaint}`,background:done?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{done&&<span style={{color:t.accentText,fontSize:9,fontWeight:900}}>✓</span>}</div>
                <span style={{flex:1,fontSize:12,color:done?t.textDim:t.text,textDecoration:done?"line-through":"none"}}>{nn.text}</span>
                {h&&<Pill habitId={h.id} habits={habits} t={t}/>}
              </div>
            ); })}
          </div>
          <div style={{fontSize:10,letterSpacing:"0.16em",color:t.textDim,marginBottom:11}}>THIS WEEK</div>
          {DAYS.map(day=>(
            <div key={day} style={{marginBottom:15}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.13em",color:day===TODAY_DAY?t.accent:t.textDim,marginBottom:5,display:"flex",alignItems:"center",gap:7}}>
                {day}{day===TODAY_DAY&&<span style={{fontSize:8,background:t.accent,color:t.accentText,padding:"1px 6px",borderRadius:10}}>TODAY</span>}
              </div>
              <StaticList items={day===TODAY_DAY?todayBlocks:(schedule[day]||[])} {...sl}/>
            </div>
          ))}
        </>}

        {/* CALENDAR */}
        {view==="calendar"&&<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <button onClick={()=>setCalMonth(p=>{const d=new Date(p.year,p.month-1);return{year:d.getFullYear(),month:d.getMonth()};})} style={{background:"transparent",border:`1px solid ${t.inputBorder}`,color:t.textMid,borderRadius:4,padding:"5px 12px",cursor:"pointer",fontFamily:"'Courier New',monospace",fontSize:11}}>← PREV</button>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:"0.1em",color:t.accent}}>{monthName.toUpperCase()} {year}</div>
            <button onClick={()=>setCalMonth(p=>{const d=new Date(p.year,p.month+1);return{year:d.getFullYear(),month:d.getMonth()};})} style={{background:"transparent",border:`1px solid ${t.inputBorder}`,color:t.textMid,borderRadius:4,padding:"5px 12px",cursor:"pointer",fontFamily:"'Courier New',monospace",fontSize:11}}>NEXT →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
            {["M","T","W","T","F","S","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:t.textDim,padding:"3px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:20}}>
            {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:numDays}).map((_,i)=>{ const day=i+1,ds=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; const score=dayScore(ds),isToday=ds===TODAY,isFuture=ds>TODAY; return (
              <div key={day} style={{aspectRatio:"1",borderRadius:5,background:isFuture?t.calEmpty:scoreColor(score),border:isToday?`2px solid ${t.accent}`:`1px solid ${t.borderCard}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
                <div style={{fontSize:10,color:isToday?t.accent:isFuture?t.textFaint:score>0?t.scoreText:t.textDim,fontWeight:isToday?700:400}}>{day}</div>
                {!isFuture&&score>0&&<div style={{fontSize:7,color:t.scoreText+"aa",fontWeight:700}}>{score}/{habits.length}</div>}
              </div>
            ); })}
          </div>
          <div style={{display:"flex",gap:7,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            {[{l:"0",bg:t.calEmpty},{l:"1–2",bg:t.accent+"30"},{l:"3–4",bg:t.accent+"70"},{l:"5+",bg:t.accent+"bb"}].map(x=>(
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:12,height:12,borderRadius:3,background:x.bg,border:`1px solid ${t.borderCard}`}}/>
                <span style={{fontSize:9,color:t.textDim}}>{x.l}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,letterSpacing:"0.14em",color:t.textDim,marginBottom:9}}>MONTHLY STREAKS</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {habits.map(h=>{ const count=Array.from({length:numDays},(_,i)=>{ const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`; return (habitLog[ds]||{})[h.id]?1:0; }).reduce((a,b)=>a+b,0); return (
              <div key={h.id} style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:86,fontSize:10,color:h.color,flexShrink:0}}>{h.icon} {h.label}</div>
                <div style={{flex:1,height:5,background:t.barBg,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(count/numDays)*100}%`,background:h.color,borderRadius:3,transition:"width 0.5s"}}/></div>
                <div style={{width:26,fontSize:10,color:t.textDim,textAlign:"right"}}>{count}d</div>
              </div>
            ); })}
          </div>
        </>}

        {/* SCHEDULE */}
        {view==="schedule"&&<>
          <div style={{fontSize:10,letterSpacing:"0.16em",color:t.textDim,marginBottom:4}}>WEEKLY TEMPLATE</div>
          <div style={{fontSize:11,color:t.textMid,marginBottom:14,lineHeight:1.5}}>Changes here apply every future week.<br/>Drag to reorder · tap task to rename.</div>
          <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
            {DAYS.map(d=><button key={d} onClick={()=>setActiveDay(d)} style={navBtn(activeDay===d)}>{d}{d===TODAY_DAY?" ·":""}</button>)}
          </div>
          <DraggableList items={schedule[activeDay]||[]} onReorder={items=>saveScheduleDay(activeDay,items)} dayKey={activeDay} editingBlock={editingBlock} editText={editText} setEditText={setEditText} onEditTask={onEditTask} saveEdit={saveEdit} {...sl}/>
        </>}

      </div>
    </div>
  );
}
