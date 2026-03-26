import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL = "https://wgvtsockreytrjfhqlvy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndnRzb2NrcmV5dHJqZmhxbHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODQxNTgsImV4cCI6MjA5MDA2MDE1OH0.PR4zOftwmw3Xohmz_FvaWxihsPq3U_mzPixivvl3LZQ";

const FONTS = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap";

if (!document.querySelector('link[href*="Space+Mono"]')) {
  const l = document.createElement("link");
  l.href = FONTS; l.rel = "stylesheet";
  document.head.appendChild(l);
}

const s = document.createElement("style");
s.textContent = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideL { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideR { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes gridPulse { 0%,100%{opacity:.03} 50%{opacity:.06} }
  .fu{animation:fadeUp .7s ease-out both} .fi{animation:fadeIn .5s ease-out both}
  .sl{animation:slideL .6s ease-out both} .sr{animation:slideR .6s ease-out both}
  .si{animation:scaleIn .5s ease-out both}
  .d1{animation-delay:.1s} .d2{animation-delay:.2s} .d3{animation-delay:.3s}
  .d4{animation-delay:.4s} .d5{animation-delay:.5s} .d6{animation-delay:.6s}
  .d7{animation-delay:.7s} .d8{animation-delay:.8s}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#050505;overflow-x:hidden}
  ::selection{background:#22c55e;color:#050505}
  @media(max-width:768px){
    .hero-h1{font-size:42px!important}
    .grid-2{grid-template-columns:1fr!important}
    .grid-3{grid-template-columns:1fr!important}
    .grid-4{grid-template-columns:1fr 1fr!important}
    .flex-hero{flex-direction:column!important}
    .pricing-grid{grid-template-columns:1fr!important}
    .cta-row{flex-direction:column!important}
  }
  @media(max-width:480px){
    .grid-4{grid-template-columns:1fr!important}
    .hero-h1{font-size:34px!important}
  }
`;
document.head.appendChild(s);

// ═══════════════════════════════════════════════════════════
// ICONS (SVG, no emojis)
// ═══════════════════════════════════════════════════════════
const Icon = ({ d, size = 20, color = "#22c55e", stroke = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke ? color : "none"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {typeof d === "string" ? <path d={d} fill={stroke ? "none" : color} /> : d}
  </svg>
);

const Icons = {
  brain: <Icon d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zM9 22h6M12 17v5" size={22} />,
  calendar: <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={22} />,
  globe: <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" size={22} />,
  glass: <Icon d="M8 2h8l-1 9a4 4 0 0 1-3 3.46V19h2a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2h2v-4.54A4 4 0 0 1 9 11L8 2z" size={22} />,
  activity: <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" size={22} />,
  refresh: <Icon d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={22} />,
  check: <Icon d="M20 6L9 17l-5-5" size={18} />,
  arrow: <Icon d="M5 12h14M12 5l7 7-7 7" size={18} />,
  chat: <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={22} />,
  target: <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" size={22} />,
  list: <Icon d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" size={22} />,
  download: <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={22} />,
  star: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={16} />,
  lock: <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" size={22} />,
  zap: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" size={22} />,
  mail: <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={18} />,
};

// ═══════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════
function useInView(t = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

// ═══════════════════════════════════════════════════════════
// WAITLIST (Supabase)
// ═══════════════════════════════════════════════════════════
async function joinWaitlist(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ email }),
  });
  if (res.status === 409 || res.status === 23505) return "duplicate";
  if (!res.ok) throw new Error("Failed");
  return "success";
}

function WaitlistInput({ dark = false, compact = false }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error | duplicate

  const submit = async () => {
    if (!email.includes("@") || !email.includes(".")) return;
    setState("loading");
    try {
      const r = await joinWaitlist(email);
      setState(r === "duplicate" ? "duplicate" : "done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") return (
    <div className="si" style={{
      padding: "14px 24px", borderRadius: 12,
      background: "#22c55e10", border: "1px solid #22c55e30",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {Icons.check}
      <span style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#22c55e", fontWeight: 500 }}>
        You're on the list. We'll be in touch.
      </span>
    </div>
  );

  if (state === "duplicate") return (
    <div className="si" style={{
      padding: "14px 24px", borderRadius: 12,
      background: "#22c55e10", border: "1px solid #22c55e30",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {Icons.check}
      <span style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#22c55e", fontWeight: 500 }}>
        You're already on the list.
      </span>
    </div>
  );

  return (
    <div style={{
      display: "flex", gap: 10, maxWidth: compact ? 400 : 460,
      width: "100%", flexWrap: "wrap", justifyContent: compact ? "center" : "flex-start",
    }} className="cta-row">
      <input
        type="email" placeholder="you@email.com" value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        style={{
          flex: "1 1 220px", padding: "14px 18px", borderRadius: 10,
          border: "1px solid #1f1f1f", background: dark ? "#0a0a0a" : "#111",
          color: "#f5f5f0", fontFamily: "'Outfit'", fontSize: 15,
          outline: "none", transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "#22c55e40"}
        onBlur={e => e.target.style.borderColor = "#1f1f1f"}
      />
      <button
        onClick={submit} disabled={state === "loading"}
        style={{
          padding: "14px 28px", borderRadius: 10, border: "none",
          background: state === "loading" ? "#1a3a1a" : "#22c55e",
          color: state === "loading" ? "#22c55e" : "#050505",
          fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600,
          cursor: state === "loading" ? "wait" : "pointer",
          transition: "all .2s", flexShrink: 0,
        }}
        onMouseEnter={e => { if (state !== "loading") { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 24px rgba(34,197,94,.25)"; }}}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
      >
        {state === "loading" ? "Joining..." : "Join Waitlist"}
      </button>
      {state === "error" && (
        <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#ef4444", width: "100%" }}>
          Something went wrong. Try again.
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════

function SectionTitle({ badge, title, sub, align = "center" }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ textAlign: align, maxWidth: 680, margin: align === "center" ? "0 auto 52px" : "0 0 52px", opacity: v ? 1 : 0 }}>
      {badge && <div className={v ? "fu" : ""} style={{ marginBottom: 14 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
          borderRadius: 100, border: "1px solid #22c55e25", background: "#22c55e08",
          color: "#22c55e", fontSize: 12, fontFamily: "'Space Mono'",
          fontWeight: 400, letterSpacing: ".08em", textTransform: "uppercase",
        }}>{badge}</span>
      </div>}
      <h2 className={v ? "fu d1" : ""} style={{
        fontFamily: "'Outfit'", fontSize: "clamp(28px, 4.5vw, 46px)",
        color: "#f5f5f0", lineHeight: 1.15, marginBottom: 14, fontWeight: 600,
      }}>{title}</h2>
      {sub && <p className={v ? "fu d2" : ""} style={{
        fontFamily: "'Outfit'", fontSize: 16, color: "#737373", lineHeight: 1.7, fontWeight: 300,
      }}>{sub}</p>}
    </div>
  );
}

// ─── Chat Demo ───
const chatMsgs = [
  { r: "ai", t: "What's your current weight and goal?" },
  { r: "user", t: "201 lbs → 175. I'm 5'11\"" },
  { r: "ai", t: "26 lb cut. How aggressive?" },
  { r: "user", t: "Aggressive — 1.5-2 lbs/week" },
  { r: "ai", t: "1,800 cal/day. What do you usually eat?" },
  { r: "user", t: "Shakshuka, eggs+cheese+sriracha, cottage cheese with Indian masala" },
  { r: "ai", t: "Building around YOUR meals. Work schedule?" },
  { r: "user", t: "Hybrid — MWF home, T/Th office" },
  { r: "ai", t: "Office days = prepped. Home days = fresh + snacks. Friday cocktails budgeted." },
];

function ChatDemo() {
  const [cnt, setCnt] = useState(0);
  const [ref, vis] = useInView(0.25);
  const cRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const t = setInterval(() => {
      setCnt(p => { if (p >= chatMsgs.length) { clearInterval(t); return p; } return p + 1; });
    }, 800);
    return () => clearInterval(t);
  }, [vis]);

  useEffect(() => { if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [cnt]);

  return (
    <div ref={ref} style={{
      background: "#0c0c0c", borderRadius: 16, border: "1px solid #1a1a1a",
      overflow: "hidden", maxWidth: 480, width: "100%",
      boxShadow: "0 20px 60px rgba(0,0,0,.6)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 18px", borderBottom: "1px solid #141414" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#333" }} />
        <span style={{ marginLeft: 10, fontFamily: "'Space Mono'", fontSize: 11, color: "#3a3a3a" }}>cutkova.com</span>
      </div>
      <div ref={cRef} style={{ padding: "18px 18px 22px", minHeight: 340, maxHeight: 380, overflowY: "auto" }}>
        {chatMsgs.slice(0, cnt).map((m, i) => (
          <div key={i} className="fu" style={{
            display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start", marginBottom: 10,
          }}>
            <div style={{
              maxWidth: "80%", padding: "10px 14px",
              borderRadius: m.r === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              background: m.r === "user" ? "#22c55e" : "#161616",
              color: m.r === "user" ? "#050505" : "#d4d4d4",
              fontFamily: "'Outfit'", fontSize: 13, lineHeight: 1.5,
              fontWeight: m.r === "user" ? 500 : 400,
            }}>{m.t}</div>
          </div>
        ))}
        {cnt < chatMsgs.length && vis && (
          <div style={{ display: "flex", gap: 4, padding: "6px 0" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: `pulse 1.2s ease-in-out ${i*.2}s infinite` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Plan Preview Card ───
function PlanPreview() {
  const [ref, v] = useInView();
  const meals = [
    { time: "11 AM", label: "BRUNCH", name: "Shakshuka + Cottage Cheese", cal: 520, p: 42 },
    { time: "4 PM", label: "SNACK", name: "Cucumber + Hummus + Chips", cal: 180, p: 5 },
    { time: "7:30", label: "DINNER", name: "Yogurt Chicken Curry + Rice", cal: 930, p: 88 },
    { time: "9 PM", label: "SHAKE", name: "Fairlife + 2 Scoops Whey", cal: 350, p: 60 },
  ];
  return (
    <div ref={ref} className={v ? "fu d2" : ""} style={{
      background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16,
      padding: "28px 24px", maxWidth: 480, width: "100%", opacity: v ? 1 : 0,
      boxShadow: "0 20px 60px rgba(0,0,0,.5)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase" }}>Monday</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 22, color: "#f5f5f0", fontWeight: 600, marginTop: 2 }}>Home Day</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 26, color: "#f5f5f0", fontWeight: 700 }}>1,980</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#525252" }}>calories</div>
        </div>
      </div>
      {meals.map((m, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", padding: "12px 0",
          borderTop: i > 0 ? "1px solid #141414" : "none",
        }}>
          <div style={{ width: 50, fontFamily: "'Space Mono'", fontSize: 11, color: "#3a3a3a", flexShrink: 0 }}>{m.time}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#22c55e", letterSpacing: ".06em" }}>{m.label}</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#d4d4d4", marginTop: 1 }}>{m.name}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#737373" }}>{m.cal}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#22c55e" }}>{m.p}g</div>
          </div>
        </div>
      ))}
      <div style={{
        marginTop: 18, padding: "14px 18px", borderRadius: 10,
        background: "#111", border: "1px solid #1a1a1a",
        display: "flex", justifyContent: "space-around",
      }}>
        {[["Protein", "195g", "#22c55e"], ["Carbs", "126g", "#eab308"], ["Fat", "54g", "#3b82f6"]].map(([l, val, c]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 18, color: c, fontWeight: 700 }}>{val}</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: "#525252", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Card ───
function FeatureCard({ icon, title, desc, delay = 0 }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{
      background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14,
      padding: "30px 24px", opacity: v ? 1 : 0, transition: "border-color .3s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e20"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
    >
      <div style={{ marginBottom: 16, opacity: .9 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Outfit'", fontSize: 18, color: "#f5f5f0", marginBottom: 8, fontWeight: 600 }}>{title}</h3>
      <p style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#737373", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
    </div>
  );
}

// ─── Comparison ───
function ComparisonSection() {
  const [ref, v] = useInView();
  const others = [
    "Generic plans from recipe databases",
    "Ignores your work schedule",
    "No cultural food intelligence",
    "Same meals for everyone",
    "No lifestyle context",
  ];
  const us = [
    "Interviews you like a nutritionist",
    "Builds around your actual meals",
    "Understands hybrid/remote/office",
    "Budgets for cocktails and real life",
    "Grocery list minus what you own",
  ];
  return (
    <div ref={ref} className="grid-2" style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 860, margin: "0 auto",
    }}>
      <div className={v ? "sl d2" : ""} style={{
        background: "#0c0808", border: "1px solid #2a1515", borderRadius: 16,
        padding: "32px 24px", opacity: v ? 1 : 0,
      }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#ef4444", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 18 }}>
          Every other app
        </div>
        {others.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginTop: 3, flexShrink: 0 }}><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#8a8a8a", lineHeight: 1.5, fontWeight: 300 }}>{t}</span>
          </div>
        ))}
      </div>
      <div className={v ? "sr d3" : ""} style={{
        background: "#080c08", border: "1px solid #22c55e20", borderRadius: 16,
        padding: "32px 24px", opacity: v ? 1 : 0,
      }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#22c55e", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 18 }}>
          CutKova
        </div>
        {us.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ marginTop: 3, flexShrink: 0 }}><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#d4d4d4", lineHeight: 1.5, fontWeight: 400 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonial ───
function TestimonialCard({ quote, name, detail, delay }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{
      background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14,
      padding: "28px 24px", opacity: v ? 1 : 0,
    }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, i) => <span key={i}>{Icons.star}</span>)}
      </div>
      <p style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#d4d4d4", lineHeight: 1.65, marginBottom: 18, fontWeight: 300, fontStyle: "italic" }}>
        "{quote}"
      </p>
      <div>
        <div style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#f5f5f0", fontWeight: 500 }}>{name}</div>
        <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#525252", marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

// ─── Pricing Card ───
function PricingCard({ tier, price, period, desc, features, cta, highlighted }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={v ? "si d2" : ""} style={{
      background: highlighted ? "#0a140a" : "#0c0c0c",
      border: `1px solid ${highlighted ? "#22c55e30" : "#1a1a1a"}`,
      borderRadius: 16, padding: "36px 28px", opacity: v ? 1 : 0,
      position: "relative", overflow: "hidden",
    }}>
      {highlighted && <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
      }} />}
      <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: highlighted ? "#22c55e" : "#525252", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>{tier}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Outfit'", fontSize: 42, color: "#f5f5f0", fontWeight: 700 }}>{price}</span>
        {period && <span style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#525252" }}>/{period}</span>}
      </div>
      <p style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#737373", marginBottom: 24, fontWeight: 300 }}>{desc}</p>
      <div style={{ marginBottom: 28 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#d4d4d4", fontWeight: 300 }}>{f}</span>
          </div>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "14px", borderRadius: 10, border: highlighted ? "none" : "1px solid #1f1f1f",
        background: highlighted ? "#22c55e" : "transparent",
        color: highlighted ? "#050505" : "#d4d4d4",
        fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all .2s",
      }}
      onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; if (highlighted) e.target.style.boxShadow = "0 6px 24px rgba(34,197,94,.25)"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
      >{cta}</button>
    </div>
  );
}

// ─── How It Works Step ───
function Step({ num, title, desc, delay }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} className={v ? `fu d${delay}` : ""} style={{
      display: "flex", gap: 20, opacity: v ? 1 : 0, alignItems: "flex-start",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, border: "1px solid #22c55e30",
        background: "#22c55e08", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Mono'", fontSize: 14, color: "#22c55e", flexShrink: 0,
      }}>{num}</div>
      <div>
        <h4 style={{ fontFamily: "'Outfit'", fontSize: 17, color: "#f5f5f0", fontWeight: 600, marginBottom: 6 }}>{title}</h4>
        <p style={{ fontFamily: "'Outfit'", fontSize: 14, color: "#737373", lineHeight: 1.6, fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function CutKova() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: "#050505", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 40 ? "rgba(5,5,5,.88)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(16px)" : "none",
        borderBottom: scrollY > 40 ? "1px solid #141414" : "1px solid transparent",
        transition: "all .3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, border: "1px solid #22c55e40",
            background: "#22c55e10", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontFamily: "'Outfit'", fontSize: 20, color: "#f5f5f0", fontWeight: 600, letterSpacing: "-.02em" }}>
            Cut<span style={{ color: "#22c55e" }}>Kova</span>
          </span>
        </div>
        <button
          onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            padding: "9px 20px", borderRadius: 8, border: "1px solid #22c55e40",
            background: "transparent", color: "#22c55e", fontFamily: "'Outfit'",
            fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s",
          }}
          onMouseEnter={e => { e.target.style.background = "#22c55e"; e.target.style.color = "#050505"; e.target.style.borderColor = "#22c55e"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#22c55e"; e.target.style.borderColor = "#22c55e40"; }}
        >Join Waitlist</button>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "120px 24px 80px",
        position: "relative",
      }}>
        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: .04,
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black, transparent)",
        }} />

        <div className="fu" style={{ marginBottom: 20 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
            borderRadius: 100, border: "1px solid #22c55e20", background: "#22c55e06",
            color: "#22c55e", fontSize: 12, fontFamily: "'Space Mono'",
            letterSpacing: ".08em", textTransform: "uppercase",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#22c55e"><circle cx="12" cy="12" r="5"/></svg>
            AI-powered meal planning
          </span>
        </div>

        <h1 className="fu d1 hero-h1" style={{
          fontFamily: "'Outfit'", fontSize: "clamp(40px, 7vw, 72px)",
          color: "#f5f5f0", textAlign: "center", lineHeight: 1.05,
          maxWidth: 720, marginBottom: 22, fontWeight: 700, letterSpacing: "-.03em",
        }}>
          Forged around<br /><span style={{ color: "#22c55e" }}>your life</span>
        </h1>

        <p className="fu d2" style={{
          fontFamily: "'Outfit'", fontSize: "clamp(15px, 2vw, 18px)",
          color: "#737373", textAlign: "center", maxWidth: 500,
          lineHeight: 1.7, marginBottom: 40, fontWeight: 300,
        }}>
          CutKova interviews you like a nutritionist — learns your schedule, your go-to meals, your preferences — then builds a plan that actually works.
        </p>

        <div className="fu d3" style={{ marginBottom: 56 }}>
          <WaitlistInput />
        </div>

        <div className="fu d4" style={{ display: "flex", gap: 44, flexWrap: "wrap", justifyContent: "center" }}>
          {[["5 min", "to your plan"], ["200g+", "protein daily"], ["$95–130", "weekly groceries"]].map(([big, sm]) => (
            <div key={big} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 28, color: "#f5f5f0", fontWeight: 700 }}>{big}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#3a3a3a", marginTop: 3, fontWeight: 300 }}>{sm}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="Built for real schedules"
          title="Whether you're in the office, at home, or somewhere in between"
          sub="CutKova adapts to your actual work week — not a fantasy one."
        />
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            [Icons.target, "Office Worker", "9-to-5 schedule", 2],
            [Icons.calendar, "Hybrid Worker", "2-3 days in office", 3],
            [Icons.chat, "Remote Worker", "Fully home-based", 4],
            [Icons.activity, "Active Professional", "Gym + sports + work", 5],
          ].map(([icon, title, sub, d]) => {
            const [ref, v] = useInView();
            return (
              <div ref={ref} key={title} className={v ? `si d${d}` : ""} style={{
                background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14,
                padding: "24px 20px", textAlign: "center", opacity: v ? 1 : 0,
              }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>{icon}</div>
                <h4 style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#f5f5f0", fontWeight: 600, marginBottom: 4 }}>{title}</h4>
                <p style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#525252", fontWeight: 300 }}>{sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="How it works"
          title={<>It starts with a <span style={{ color: "#22c55e" }}>conversation</span></>}
          sub="Not a form. Not a quiz. A real conversation that understands context and builds around what you actually eat."
        />
        <div className="grid-2" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Step num="01" title="Tell us about yourself" desc="Weight, height, goals, schedule, activity level. CutKova asks smart follow-up questions — not a 20-field form." delay={2} />
            <Step num="02" title="Share what you actually eat" desc="Shakshuka? Cottage cheese with masala? Chicken tacos? We build around your real meals, not generic recipes." delay={3} />
            <Step num="03" title="Get your plan in minutes" desc="Full weekly plan with macros, grocery list (minus what you already have), prep schedule, and lifestyle budgeting." delay={4} />
            <Step num="04" title="Refine and iterate" desc="Swap meals, adjust portions, add snacks. Your plan evolves with you every week." delay={5} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ChatDemo />
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU GET ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="What you get"
          title="Everything from one conversation"
        />
        <div className="grid-2" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center",
        }}>
          <PlanPreview />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              [Icons.list, "Full weekly meal plan", "Day-by-day with per-meal macros and timing"],
              [Icons.download, "Smart grocery list", "Auto-generated, excludes what you already have"],
              [Icons.calendar, "Prep schedule", "Sunday batch cooking + mid-week quick preps"],
              [Icons.glass, "Lifestyle budget", "Room for snacks, cocktails, and social eating"],
              [Icons.activity, "Macro tracking", "Per-meal and daily breakdowns, protein-forward"],
            ].map(([icon, title, desc], i) => {
              const [ref, v] = useInView();
              return (
                <div ref={ref} key={i} className={v ? `sr d${i+1}` : ""} style={{
                  display: "flex", gap: 14, opacity: v ? 1 : 0,
                }}>
                  <div style={{ marginTop: 2 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 15, color: "#f5f5f0", fontWeight: 600, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#525252", fontWeight: 300 }}>{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="Why CutKova"
          title="Not another generic meal plan app"
          sub="We researched every competitor. They generate plans from recipe databases. We generate plans from your life."
        />
        <ComparisonSection />
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="Features"
          title="Built for people who have a life outside the gym"
        />
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <FeatureCard icon={Icons.brain} title="AI that interviews you" desc="A real conversation that understands 'I usually do shakshuka or eggs with cheese' — not a form with dropdowns." delay={2} />
          <FeatureCard icon={Icons.calendar} title="Schedule-aware plans" desc="Office days get prepped meals in tupperware. Home days get fresh cooking with snacks. It knows the difference." delay={3} />
          <FeatureCard icon={Icons.globe} title="Cultural food intelligence" desc="Indian masala cottage cheese. Japanese curry. Shakshuka. Your food, not Americanized grilled chicken." delay={4} />
          <FeatureCard icon={Icons.glass} title="Lifestyle budgeting" desc="Friday cocktails? Saturday brunch? CutKova trims dinner and makes room — sustainability over restriction." delay={5} />
          <FeatureCard icon={Icons.activity} title="Activity-aware adjustments" desc="Play volleyball 3x/week? It factors in your TDEE and suggests extra carbs on game days." delay={6} />
          <FeatureCard icon={Icons.refresh} title="Iterative refinement" desc="Swap meals. Say 'I don't like tilapia'. The plan evolves with you — not the other way around." delay={7} />
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 1060, margin: "0 auto" }}>
        <SectionTitle
          badge="Early feedback"
          title="What beta testers are saying"
        />
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <TestimonialCard quote="Finally something that understands I eat Indian food, not just chicken and broccoli. The grocery list alone saves me 30 minutes every week." name="Priya S." detail="Software Engineer, Hybrid" delay={2} />
          <TestimonialCard quote="I told it I play volleyball 4x a week and want old fashioneds on Friday. It adjusted everything. No other app does that." name="Marcus T." detail="Data Analyst, Remote" delay={3} />
          <TestimonialCard quote="The meal prep schedule is a game changer. Sunday prep + office-ready containers. I haven't skipped lunch in 6 weeks." name="Sarah K." detail="Product Manager, Office" delay={4} />
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section style={{ padding: "100px 24px", maxWidth: 860, margin: "0 auto" }}>
        <SectionTitle
          badge="Pricing"
          title="Start free. Upgrade when you're ready."
        />
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <PricingCard
            tier="Free"
            price="$0"
            period=""
            desc="Get started with the basics."
            features={[
              "1 meal plan per week",
              "Basic macro calculations",
              "Standard grocery list",
              "3 meal swaps per plan",
            ]}
            cta="Get Started"
          />
          <PricingCard
            tier="Pro"
            price="$9"
            period="mo"
            desc="For serious results."
            features={[
              "Unlimited plan generations",
              "Unlimited meal swaps",
              "PDF + spreadsheet export",
              "Prep schedule builder",
              "Cocktail + snack budgeting",
              "Priority AI conversations",
            ]}
            cta="Join Waitlist — Pro"
            highlighted
          />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="waitlist" style={{
        padding: "100px 24px 120px",
        background: "linear-gradient(180deg, #050505 0%, #080c08 100%)",
      }}>
        <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Outfit'", fontSize: "clamp(32px, 5vw, 48px)",
            color: "#f5f5f0", lineHeight: 1.1, marginBottom: 14, fontWeight: 700,
            letterSpacing: "-.02em",
          }}>
            Stop eating like you<br />don't have <span style={{ color: "#22c55e" }}>goals</span>
          </h2>
          <p style={{ fontFamily: "'Outfit'", fontSize: 16, color: "#737373", marginBottom: 36, lineHeight: 1.7, fontWeight: 300 }}>
            Join the waitlist. First 500 users get lifetime early-bird pricing.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistInput compact />
          </div>
          <p style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#2a2a2a", marginTop: 32 }}>
            No spam. No ads. No selling your data.
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        borderTop: "1px solid #111", padding: "36px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span style={{ fontFamily: "'Outfit'", fontSize: 13, color: "#2a2a2a" }}>CutKova © 2026</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontFamily: "'Outfit'", fontSize: 12, color: "#2a2a2a", cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = "#737373"}
              onMouseLeave={e => e.target.style.color = "#2a2a2a"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
