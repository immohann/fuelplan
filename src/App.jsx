import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://wgvtsockreytrjfhqlvy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndnRzb2NrcmV5dHJqZmhxbHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODQxNTgsImV4cCI6MjA5MDA2MDE1OH0.PR4zOftwmw3Xohmz_FvaWxihsPq3U_mzPixivvl3LZQ";

const FONTS = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap";
if (!document.querySelector('link[href*="Space+Mono"]')) {
  const l = document.createElement("link"); l.href = FONTS; l.rel = "stylesheet"; document.head.appendChild(l);
}

const s = document.createElement("style");
s.textContent = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideL{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
  @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
  .fu{animation:fadeUp .7s ease-out both}.fi{animation:fadeIn .5s ease-out both}
  .sl{animation:slideL .6s ease-out both}.sr{animation:slideR .6s ease-out both}
  .si{animation:scaleIn .5s ease-out both}
  .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}
  .d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}
  .d7{animation-delay:.7s}.d8{animation-delay:.8s}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}body{background:#050505;overflow-x:hidden}
  ::selection{background:#22c55e;color:#050505}
  @media(max-width:768px){
    .hero-h1{font-size:38px!important}
    .grid-2{grid-template-columns:1fr!important}
    .grid-3{grid-template-columns:1fr!important}
    .grid-4{grid-template-columns:1fr 1fr!important}
    .pricing-grid{grid-template-columns:1fr!important}
    .cta-row{flex-direction:column!important}
    .cta-row input{min-height:44px!important;height:44px!important;padding-top:0!important;padding-bottom:0!important}
    .cta-row button{min-height:44px!important;height:44px!important;padding-top:0!important;padding-bottom:0!important}
    .stat-row{gap:28px!important}
    .hiw-grid{grid-template-columns:1fr!important}
    .hiw-grid .chat-col{order:-1}
    .wug-grid{grid-template-columns:1fr!important}
  }
  @media(max-width:480px){
    .grid-4{grid-template-columns:1fr!important}
    .hero-h1{font-size:32px!important}
  }
`;
document.head.appendChild(s);

// ═══ ICONS ═══
const I = ({ d, sz = 20, c = "#22c55e" }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={d} /></svg>
);
const Ic = {
  zap: <I d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  chat: <I d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  target: <I d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  cal: <I d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  user: <I d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  list: <I d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />,
  dl: <I d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  act: <I d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  ref: <I d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />,
  ck: <I d="M20 6L9 17l-5-5" sz={14} />,
  star: <I d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" sz={14} />,
  shield: <I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  layers: <I d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  heart: <I d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  globe: <I d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />,
  coffee: <I d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />,
  cart: <I d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />,
  sliders: <I d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
};

// ═══ HOOKS ═══
function useV(t = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el); return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

// ═══ WAITLIST ═══
async function joinWL(email) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "return=minimal" },
    body: JSON.stringify({ email }),
  });
  if (r.status === 409) return "dup";
  if (!r.ok) { const t = await r.text(); if (t.includes("duplicate")) return "dup"; throw new Error("fail"); }
  return "ok";
}

function WaitlistInput({ compact }) {
  const [email, setEmail] = useState("");
  const [st, setSt] = useState("idle");
  const go = async () => {
    if (!email.includes("@") || !email.includes(".")) return;
    setSt("load");
    try { const r = await joinWL(email); setSt(r === "dup" ? "dup" : "done"); } catch { setSt("err"); }
  };

  if (st === "done" || st === "dup") return (
    <div className="si" style={{ padding: "12px 20px", borderRadius: 10, background: "#22c55e0a", border: "1px solid #22c55e25", display: "flex", alignItems: "center", gap: 8 }}>
      {Ic.ck}
      <span style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#22c55e", fontWeight: 500 }}>
        {st === "dup" ? "You're already on the list." : "You're in. We'll reach out soon."}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 8, maxWidth: compact ? 400 : 440, width: "100%", flexWrap: "wrap", justifyContent: compact ? "center" : "flex-start" }} className="cta-row">
      <input
        type="email" placeholder="you@email.com" value={email}
        onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && go()}
        style={{
          flex: "1 1 200px", padding: "0 16px", height: 46, borderRadius: 10,
          border: "1px solid #1a1a1a", background: "#0a0a0a",
          color: "#f5f5f0", fontFamily: "'Outfit'", fontSize: 14, outline: "none", transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "#22c55e30"}
        onBlur={e => e.target.style.borderColor = "#1a1a1a"}
      />
      <button onClick={go} disabled={st === "load"} style={{
        padding: "0 24px", height: 46, borderRadius: 10, border: "none",
        background: st === "load" ? "#1a3a1a" : "#22c55e", color: st === "load" ? "#22c55e" : "#050505",
        fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600, cursor: st === "load" ? "wait" : "pointer", transition: "all .2s", flexShrink: 0,
      }}
        onMouseEnter={e => { if (st !== "load") { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(34,197,94,.2)"; } }}
        onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
      >{st === "load" ? "Joining..." : "Join Waitlist"}</button>
      {st === "err" && <span style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#ef4444", width: "100%" }}>Something went wrong. Try again.</span>}
    </div>
  );
}

// ═══ SECTION TITLE ═══
function ST({ badge, title, sub, align = "center" }) {
  const [ref, v] = useV();
  return (
    <div ref={ref} style={{ textAlign: align, maxWidth: 660, margin: align === "center" ? "0 auto 48px" : "0 0 48px", opacity: v ? 1 : 0 }}>
      {badge && <div className={v ? "fu" : ""} style={{ marginBottom: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, border: "1px solid #22c55e20", background: "#22c55e06", color: "#22c55e", fontSize: 11, fontFamily: "'Space Mono'", letterSpacing: ".08em", textTransform: "uppercase" }}>{badge}</span>
      </div>}
      <h2 className={v ? "fu d1" : ""} style={{ fontFamily: "'Outfit'", fontSize: "clamp(26px, 4.5vw, 44px)", color: "#f5f5f0", lineHeight: 1.15, marginBottom: 12, fontWeight: 600 }}>{title}</h2>
      {sub && <p className={v ? "fu d2" : ""} style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#606060", lineHeight: 1.7, fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}

// ═══ CHAT DEMO ═══
const chatMsgs = [
  { r: "ai", t: "What's your current weight and goal?" },
  { r: "user", t: "185 lbs, trying to get to 170." },
  { r: "ai", t: "Got it — 15 lb cut. How fast do you want to go?" },
  { r: "user", t: "Moderate. About 1 lb per week." },
  { r: "ai", t: "What does a typical breakfast look like for you?" },
  { r: "user", t: "Usually eggs and toast, sometimes oatmeal with protein powder" },
  { r: "ai", t: "And your work schedule? This affects how we plan meals." },
  { r: "user", t: "In office Tue-Thu, home Mon and Fri" },
  { r: "ai", t: "Perfect. Office days get prepped meals you can take in containers. Home days, you cook fresh. Plan incoming." },
];

function ChatDemo() {
  const [cnt, setCnt] = useState(0);
  const [ref, vis] = useV(0.25);
  const cRef = useRef(null);
  useEffect(() => {
    if (!vis) return;
    const t = setInterval(() => { setCnt(p => { if (p >= chatMsgs.length) { clearInterval(t); return p; } return p + 1; }); }, 800);
    return () => clearInterval(t);
  }, [vis]);
  useEffect(() => { if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [cnt]);

  return (
    <div ref={ref} style={{ background: "#0a0a0a", borderRadius: 14, border: "1px solid #161616", overflow: "hidden", maxWidth: 440, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.5)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderBottom: "1px solid #111" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#282828" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#282828" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#282828" }} />
        <span style={{ marginLeft: 8, fontFamily: "'Space Mono'", fontSize: 10, color: "#2a2a2a" }}>cutkova.com</span>
      </div>
      <div ref={cRef} style={{ padding: "16px 16px 20px", minHeight: 300, maxHeight: 340, overflowY: "auto" }}>
        {chatMsgs.slice(0, cnt).map((m, i) => (
          <div key={i} className="fu" style={{ display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            <div style={{
              maxWidth: "80%", padding: "9px 13px",
              borderRadius: m.r === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: m.r === "user" ? "#22c55e" : "#131313",
              color: m.r === "user" ? "#050505" : "#b0b0b0",
              fontFamily: "'Outfit'", fontSize: 13, lineHeight: 1.5, fontWeight: m.r === "user" ? 500 : 300,
            }}>{m.t}</div>
          </div>
        ))}
        {cnt < chatMsgs.length && vis && (
          <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
            {[0, 1, 2].map(i => (<div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: `pulse 1.2s ease-in-out ${i * .2}s infinite` }} />))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ PLAN PREVIEW ═══
function PlanPreview() {
  const [ref, v] = useV();
  const meals = [
    { time: "8 AM", label: "BREAKFAST", name: "Eggs, toast, avocado", cal: 480, p: 35 },
    { time: "12:30", label: "LUNCH", name: "Chicken rice bowl + greens", cal: 620, p: 52 },
    { time: "4 PM", label: "SNACK", name: "Greek yogurt + almonds", cal: 200, p: 18 },
    { time: "7:30", label: "DINNER", name: "Salmon, quinoa, roast veg", cal: 580, p: 48 },
  ];
  return (
    <div ref={ref} className={v ? "fu d2" : ""} style={{ background: "#0a0a0a", border: "1px solid #161616", borderRadius: 14, padding: "24px 20px", maxWidth: 440, width: "100%", opacity: v ? 1 : 0, boxShadow: "0 16px 48px rgba(0,0,0,.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase" }}>Tuesday</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 20, color: "#f5f5f0", fontWeight: 600, marginTop: 2 }}>Office Day</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 24, color: "#f5f5f0", fontWeight: 700 }}>1,880</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: "#3a3a3a" }}>calories</div>
        </div>
      </div>
      {meals.map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: i > 0 ? "1px solid #111" : "none" }}>
          <div style={{ width: 44, fontFamily: "'Space Mono'", fontSize: 10, color: "#2a2a2a", flexShrink: 0 }}>{m.time}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: "#22c55e", letterSpacing: ".06em" }}>{m.label}</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#c0c0c0", marginTop: 1, fontWeight: 300 }}>{m.name}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#505050" }}>{m.cal}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#22c55e" }}>{m.p}g</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: "#0e0e0e", border: "1px solid #161616", display: "flex", justifyContent: "space-around" }}>
        {[["Protein", "153g", "#22c55e"], ["Carbs", "164g", "#eab308"], ["Fat", "58g", "#3b82f6"]].map(([l, val, c]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 16, color: c, fontWeight: 700 }}>{val}</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: "#3a3a3a", marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ FEATURE CARD ═══
function FC({ icon, title, desc, delay = 0 }) {
  const [ref, v] = useV();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{ background: "#0a0a0a", border: "1px solid #161616", borderRadius: 12, padding: "26px 22px", opacity: v ? 1 : 0, transition: "border-color .3s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e18"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#161616"}>
      <div style={{ marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, color: "#f5f5f0", marginBottom: 6, fontWeight: 600 }}>{title}</h3>
      <p style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#606060", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
    </div>
  );
}

// ═══ TESTIMONIAL ═══
function TC({ quote, name, detail, delay }) {
  const [ref, v] = useV();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{ background: "#0a0a0a", border: "1px solid #161616", borderRadius: 12, padding: "24px 22px", opacity: v ? 1 : 0 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>{[...Array(5)].map((_, i) => <span key={i}>{Ic.star}</span>)}</div>
      <p style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#b0b0b0", lineHeight: 1.65, marginBottom: 16, fontWeight: 300, fontStyle: "italic" }}>"{quote}"</p>
      <div>
        <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#e0e0e0", fontWeight: 500 }}>{name}</div>
        <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#3a3a3a", marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

// ═══ HOW IT WORKS STEP ═══
function Step({ num, title, desc, delay }) {
  const [ref, v] = useV();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{ display: "flex", gap: 18, opacity: v ? 1 : 0, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #22c55e25", background: "#22c55e06", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono'", fontSize: 12, color: "#22c55e", flexShrink: 0 }}>{num}</div>
      <div>
        <h4 style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#f5f5f0", fontWeight: 600, marginBottom: 4 }}>{title}</h4>
        <p style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#606060", lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

// ═══ PRICING CARD ═══
function PC({ tier, price, period, desc, features, cta, hl, onCta }) {
  const [ref, v] = useV();
  return (
    <div ref={ref} className={v ? "si d2" : ""} style={{ background: hl ? "#070d07" : "#0a0a0a", border: `1px solid ${hl ? "#22c55e25" : "#161616"}`, borderRadius: 14, padding: "32px 26px", opacity: v ? 1 : 0, position: "relative", overflow: "hidden" }}>
      {hl && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg, transparent, #22c55e, transparent)" }} />}
      <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: hl ? "#22c55e" : "#3a3a3a", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>{tier}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Outfit'", fontSize: 38, color: "#f5f5f0", fontWeight: 700 }}>{price}</span>
        {period && <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#3a3a3a" }}>/{period}</span>}
      </div>
      <p style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#606060", marginBottom: 22, fontWeight: 300 }}>{desc}</p>
      <div style={{ marginBottom: 24 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            {Ic.ck}
            <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#b0b0b0", fontWeight: 300 }}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={onCta} style={{
        width: "100%", padding: "12px", borderRadius: 8, border: hl ? "none" : "1px solid #1a1a1a",
        background: hl ? "#22c55e" : "transparent", color: hl ? "#050505" : "#b0b0b0",
        fontFamily: "'Outfit'", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s",
      }}
        onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; if (hl) e.target.style.boxShadow = "0 4px 16px rgba(34,197,94,.2)"; }}
        onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
      >{cta}</button>
    </div>
  );
}

// ═══ COMPARISON ═══
function Comp() {
  const [ref, v] = useV();
  return (
    <div ref={ref} className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 820, margin: "0 auto" }}>
      <div className={v ? "sl d2" : ""} style={{ background: "#0a0808", border: "1px solid #221515", borderRadius: 14, padding: "28px 22px", opacity: v ? 1 : 0 }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#ef4444", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>Typical meal plan apps</div>
        {["Pick from a recipe database", "Same plan for everyone", "Doesn't know your schedule", "Ignores what you already eat", "No room for real life"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginTop: 3, flexShrink: 0 }}><path d="M18 6L6 18M6 6l12 12" /></svg>
            <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#707070", lineHeight: 1.5, fontWeight: 300 }}>{t}</span>
          </div>
        ))}
      </div>
      <div className={v ? "sr d3" : ""} style={{ background: "#070a07", border: "1px solid #22c55e18", borderRadius: 14, padding: "28px 22px", opacity: v ? 1 : 0 }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>CutKova</div>
        {["Plans built from a conversation with you", "Learns your go-to meals and preferences", "Adapts to your work schedule", "Grocery list minus what you already own", "Budgets for snacks, social meals, real life"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ marginTop: 3, flexShrink: 0 }}><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#c0c0c0", lineHeight: 1.5, fontWeight: 300 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ APP ═══
export default function CutKova() {
  const [sY, setSY] = useState(0);
  useEffect(() => {
    const h = () => setSY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollWL = () => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#050505", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: sY > 40 ? "rgba(5,5,5,.9)" : "transparent",
        backdropFilter: sY > 40 ? "blur(14px)" : "none",
        borderBottom: sY > 40 ? "1px solid #111" : "1px solid transparent",
        transition: "all .3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #22c55e35", background: "#22c55e0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <span style={{ fontFamily: "'Outfit'", fontSize: 18, color: "#f5f5f0", fontWeight: 600, letterSpacing: "-.02em" }}>
            Cut<span style={{ color: "#22c55e" }}>Kova</span>
          </span>
        </div>
        <button onClick={scrollWL} style={{
          padding: "8px 18px", borderRadius: 7, border: "1px solid #22c55e35", background: "transparent",
          color: "#22c55e", fontFamily: "'Outfit'", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .2s",
        }}
          onMouseEnter={e => { e.target.style.background = "#22c55e"; e.target.style.color = "#050505"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#22c55e"; }}
        >Join Waitlist</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: .03,
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 55% 45% at 50% 40%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 45% at 50% 40%, black, transparent)",
        }} />

        <div className="fu" style={{ marginBottom: 18 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", borderRadius: 100, border: "1px solid #22c55e18", background: "#22c55e05", color: "#22c55e", fontSize: 11, fontFamily: "'Space Mono'", letterSpacing: ".08em", textTransform: "uppercase" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#22c55e"><circle cx="12" cy="12" r="5" /></svg>
            AI meal planning
          </span>
        </div>

        <h1 className="fu d1 hero-h1" style={{
          fontFamily: "'Outfit'", fontSize: "clamp(38px, 7vw, 68px)",
          color: "#f5f5f0", textAlign: "center", lineHeight: 1.05,
          maxWidth: 680, marginBottom: 18, fontWeight: 700, letterSpacing: "-.03em",
        }}>
          Your meals should<br />fit <span style={{ color: "#22c55e" }}>your life</span>
        </h1>

        <p className="fu d2" style={{
          fontFamily: "'Outfit'", fontSize: "clamp(14px, 1.8vw, 17px)",
          color: "#606060", textAlign: "center", maxWidth: 460, lineHeight: 1.7, marginBottom: 36, fontWeight: 300,
        }}>
          CutKova talks to you like a nutritionist — learns your routine, your food, your goals — and builds a plan around how you actually live.
        </p>

        <div className="fu d3" style={{ marginBottom: 52 }}>
          <WaitlistInput />
        </div>

        <div className="fu d4 stat-row" style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            ["Conversational", "AI onboarding"],
            ["Macro-optimized", "Personalized plans"],
            ["Schedule-aware", "Office, home, hybrid"],
          ].map(([big, sm]) => (
            <div key={big} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 16, color: "#e0e0e0", fontWeight: 600 }}>{big}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#2a2a2a", marginTop: 2, fontWeight: 300 }}>{sm}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 24px", maxWidth: 1020, margin: "0 auto" }}>
        <ST badge="How it works" title={<>It starts with a <span style={{ color: "#22c55e" }}>conversation</span></>} sub="No forms. No quizzes. Just tell CutKova what you eat, how you work, and what you're aiming for." />
        <div className="hiw-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Step num="01" title="Share your goals" desc="Weight, timeline, activity level. CutKova asks the right follow-ups so nothing gets missed." delay={2} />
            <Step num="02" title="Tell us what you eat" desc="Your actual meals — not what a diet app thinks you should eat. We plan around your food, your way." delay={3} />
            <Step num="03" title="Describe your week" desc="Office days, home days, gym days. Each gets a different meal structure that fits naturally." delay={4} />
            <Step num="04" title="Get your full plan" desc="Meals, macros, grocery list, prep schedule — all from one conversation. Adjust anytime." delay={5} />
          </div>
          <div className="chat-col" style={{ display: "flex", justifyContent: "center" }}>
            <ChatDemo />
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section style={{ padding: "100px 24px", maxWidth: 1020, margin: "0 auto" }}>
        <ST badge="What you get" title="Everything from one conversation" />
        <div className="wug-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
          <PlanPreview />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              [Ic.list, "Weekly meal plan", "Day-by-day meals with per-meal macros and timing"],
              [Ic.cart, "Smart grocery list", "Only what you need to buy — skips what's already in your kitchen"],
              [Ic.cal, "Prep schedule", "Know exactly what to cook Sunday vs. mid-week"],
              [Ic.sliders, "Easy adjustments", "Swap meals, change portions, regenerate anything"],
              [Ic.dl, "Export anywhere", "Download as PDF or spreadsheet"],
            ].map(([icon, title, desc], i) => {
              const [ref, v] = useV();
              return (
                <div ref={ref} key={i} className={v ? `sr d${i + 1}` : ""} style={{ display: "flex", gap: 12, opacity: v ? 1 : 0 }}>
                  <div style={{ marginTop: 1 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#e0e0e0", fontWeight: 600, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#3a3a3a", fontWeight: 300 }}>{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CUTKOVA */}
      <section style={{ padding: "100px 24px", maxWidth: 1020, margin: "0 auto" }}>
        <ST badge="Why CutKova" title="Plans built from your life, not a recipe database" sub="Your meals should reflect how you actually cook, eat, and live — not someone else's idea of healthy." />
        <Comp />
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px", maxWidth: 1020, margin: "0 auto" }}>
        <ST badge="Features" title="What makes CutKova different" />
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <FC icon={Ic.chat} title="Conversational onboarding" desc="Tell CutKova about yourself in a natural conversation. No 20-field forms, no rigid questionnaires." delay={2} />
          <FC icon={Ic.cal} title="Schedule-aware meal plans" desc="Office days get packable prepped meals. Home days get fresh cooking. Weekends stay flexible." delay={3} />
          <FC icon={Ic.globe} title="Works with any cuisine" desc="Whether you cook Japanese, Indian, Mexican, or anything in between — your food stays on the plan." delay={4} />
          <FC icon={Ic.coffee} title="Real-life budgeting" desc="Room for snacks, social dinners, weekend drinks. Sustainable plans that don't pretend life is a lab." delay={5} />
          <FC icon={Ic.act} title="Activity-adjusted targets" desc="Your calorie and macro targets adapt to training days, rest days, and everything in between." delay={6} />
          <FC icon={Ic.ref} title="Iterate every week" desc="Plans evolve with you. Swap meals, adjust goals, add new preferences — it gets smarter over time." delay={7} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px", maxWidth: 1020, margin: "0 auto" }}>
        <ST badge="Early feedback" title="What early users are saying" />
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <TC quote="I told it what I actually eat and it built around that instead of giving me a generic plan. First time I've stuck with a meal plan past week 2." name="Priya S." detail="Software Engineer" delay={2} />
          <TC quote="The schedule-aware feature is clutch. My office days and home days are completely different — CutKova gets that." name="Marcus T." detail="Data Analyst" delay={3} />
          <TC quote="Having a grocery list that skips what I already have saves me so much time and money. Small thing, huge difference." name="Sarah K." detail="Product Manager" delay={4} />
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 24px", maxWidth: 780, margin: "0 auto" }}>
        <ST badge="Pricing" title="Start free. Upgrade when you're ready." />
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <PC tier="Free" price="$0" period="" desc="Everything you need to get started."
            features={["1 meal plan per week", "Basic macro targets", "Standard grocery list", "3 meal swaps per plan"]}
            cta="Get Started" onCta={scrollWL} />
          <PC tier="Pro" price="$19" period="mo" desc="For people who are serious about results." hl
            features={["Unlimited plan generations", "Unlimited meal swaps", "PDF + spreadsheet export", "Prep schedule builder", "Advanced macro customization", "Priority AI conversations"]}
            cta="Join Waitlist" onCta={scrollWL} />
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" style={{ padding: "100px 24px 120px", background: "linear-gradient(180deg, #050505, #070a07)" }}>
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: "clamp(28px, 5vw, 44px)", color: "#f5f5f0", lineHeight: 1.1, marginBottom: 12, fontWeight: 700, letterSpacing: "-.02em" }}>
            Forge your <span style={{ color: "#22c55e" }}>cut</span>
          </h2>
          <p style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#606060", marginBottom: 32, lineHeight: 1.7, fontWeight: 300 }}>
            Join the waitlist. First 500 users get early-bird pricing for life.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}><WaitlistInput compact /></div>
          <p style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#1a1a1a", marginTop: 28 }}>No spam. No ads. Your data stays yours.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #0e0e0e", padding: "32px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#1a1a1a" }}>CutKova © 2026</span>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#1a1a1a", cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = "#606060"}
              onMouseLeave={e => e.target.style.color = "#1a1a1a"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
