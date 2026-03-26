import { useState, useEffect, useRef } from "react";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";

// Inject font
if (!document.querySelector('link[href*="Instrument+Serif"]')) {
  const link = document.createElement("link");
  link.href = FONT_LINK;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes blink {
    0%, 100% { border-color: transparent; }
    50% { border-color: #22c55e; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-fade-up { animation: fadeUp 0.8s ease-out both; }
  .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
  .animate-slide-left { animation: slideInLeft 0.7s ease-out both; }
  .animate-slide-right { animation: slideInRight 0.7s ease-out both; }
  .animate-scale-in { animation: scaleIn 0.6s ease-out both; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
  .delay-6 { animation-delay: 0.6s; }
  .delay-7 { animation-delay: 0.7s; }
  .delay-8 { animation-delay: 0.8s; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #0a0a0a; }

  ::selection {
    background: #22c55e;
    color: #0a0a0a;
  }
`;
document.head.appendChild(style);

// ─── Reusable Components ───

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Badge({ children, color = "#22c55e" }) {
  return (
    <span style={{
      display: "inline-block", padding: "6px 16px", borderRadius: 100,
      border: `1px solid ${color}40`, background: `${color}10`,
      color, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase",
    }}>{children}</span>
  );
}

function SectionTitle({ badge, title, subtitle, align = "center" }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ textAlign: align, maxWidth: 720, margin: align === "center" ? "0 auto 56px" : "0 0 56px", opacity: vis ? 1 : 0 }}>
      {badge && <div className={vis ? "animate-fade-up" : ""} style={{ marginBottom: 16 }}><Badge>{badge}</Badge></div>}
      <h2 className={vis ? "animate-fade-up delay-1" : ""} style={{
        fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 5vw, 52px)",
        color: "#f5f5f0", lineHeight: 1.15, marginBottom: 16, fontWeight: 400,
      }}>{title}</h2>
      {subtitle && <p className={vis ? "animate-fade-up delay-2" : ""} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#a3a3a3", lineHeight: 1.7,
      }}>{subtitle}</p>}
    </div>
  );
}

// ─── Chat Simulation ───

const chatMessages = [
  { role: "ai", text: "Hey! Let's build your meal plan. What's your current weight and goal?" },
  { role: "user", text: "201 lbs, trying to cut to 175. I'm 5'11\"" },
  { role: "ai", text: "Got it — that's a 26 lb cut. How aggressive do you want to go?" },
  { role: "user", text: "Aggressive. 1.5-2 lbs per week" },
  { role: "ai", text: "Perfect. I'll target ~1,800 cal/day. What do you usually eat for breakfast?" },
  { role: "user", text: "I rotate between eggs+cheese+sriracha, shakshuka, and cottage cheese with peas and Indian masala" },
  { role: "ai", text: "Love it. I'll build around YOUR meals, not generic ones. Work schedule?" },
  { role: "user", text: "Hybrid — MWF home, T/Th office. Need meal prep for office days" },
  { role: "ai", text: "Done. Office days = clean & prepped. Home days = fresh cooking + snacks. I'll even budget for Friday cocktails 🥃" },
];

function ChatDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [sectionRef, sectionVis] = useInView(0.3);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!sectionVis) return;
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= chatMessages.length) { clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [sectionVis]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  return (
    <div ref={sectionRef} style={{
      background: "#141414", borderRadius: 20, border: "1px solid #262626",
      overflow: "hidden", maxWidth: 520, width: "100%",
      boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
    }}>
      {/* Window bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        <span style={{ marginLeft: 12, fontFamily: "'DM Sans'", fontSize: 13, color: "#525252" }}>fuelplan.ai</span>
      </div>
      {/* Chat */}
      <div ref={containerRef} style={{ padding: "20px 20px 24px", minHeight: 380, maxHeight: 420, overflowY: "auto" }}>
        {chatMessages.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className="animate-fade-up" style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
          }}>
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "#22c55e" : "#1f1f1f",
              color: msg.role === "user" ? "#0a0a0a" : "#e5e5e5",
              fontFamily: "'DM Sans'", fontSize: 14, lineHeight: 1.55, fontWeight: msg.role === "user" ? 500 : 400,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {visibleCount < chatMessages.length && sectionVis && (
          <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comparison Cards ───

function ComparisonSection() {
  const [ref, vis] = useInView();
  const others = [
    "Generates plans from generic recipe databases",
    "Doesn't know your work schedule",
    "Ignores your cultural food preferences",
    "Same bland meals for everyone",
    "No lifestyle context — treats everyone identically",
  ];
  const us = [
    "Interviews you like a nutritionist would",
    "Builds around YOUR actual meals & recipes",
    "Understands hybrid/remote/office schedules",
    "Budgets for cocktails, snacks, & real life",
    "Generates grocery lists minus what you own",
  ];

  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24, maxWidth: 900, margin: "0 auto",
    }}>
      {/* Others */}
      <div className={vis ? "animate-slide-left delay-2" : ""} style={{
        background: "#1a1111", border: "1px solid #3b1515", borderRadius: 20,
        padding: "36px 28px", opacity: vis ? 1 : 0,
      }}>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#ef4444", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          Every other app
        </div>
        {others.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ color: "#ef4444", fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>✕</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#a3a3a3", lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>
      {/* Us */}
      <div className={vis ? "animate-slide-right delay-3" : ""} style={{
        background: "#0f1a11", border: "1px solid #22c55e30", borderRadius: 20,
        padding: "36px 28px", opacity: vis ? 1 : 0,
        boxShadow: "0 0 60px rgba(34,197,94,0.06)",
      }}>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#22c55e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          FuelPlan
        </div>
        {us.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ color: "#22c55e", fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#e5e5e5", lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Cards ───

function FeatureCard({ icon, title, desc, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={vis ? `animate-fade-up delay-${delay}` : ""} style={{
      background: "#141414", border: "1px solid #262626", borderRadius: 20,
      padding: "36px 28px", opacity: vis ? 1 : 0,
      transition: "border-color 0.3s, box-shadow 0.3s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e40"; e.currentTarget.style.boxShadow = "0 0 40px rgba(34,197,94,0.06)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#262626"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: 36, marginBottom: 20 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Instrument Serif'", fontSize: 22, color: "#f5f5f0", marginBottom: 10, fontWeight: 400 }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#a3a3a3", lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ─── Persona Cards ───

function PersonaCard({ emoji, title, schedule, pain, delay }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={vis ? `animate-scale-in delay-${delay}` : ""} style={{
      background: "#141414", border: "1px solid #262626", borderRadius: 20,
      padding: "32px 24px", opacity: vis ? 1 : 0, textAlign: "center",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
      <h4 style={{ fontFamily: "'Instrument Serif'", fontSize: 20, color: "#f5f5f0", marginBottom: 8, fontWeight: 400 }}>{title}</h4>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#22c55e", marginBottom: 12, fontWeight: 500 }}>{schedule}</div>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#737373", lineHeight: 1.6 }}>{pain}</p>
    </div>
  );
}

// ─── Plan Output Preview ───

function PlanPreview() {
  const [ref, vis] = useInView();
  const meals = [
    { time: "11 AM", label: "Brunch", name: "Shakshuka + Cottage Cheese", cal: 520, p: 42 },
    { time: "4 PM", label: "Snack", name: "Cucumber + Hummus + Chips", cal: 180, p: 5 },
    { time: "7:30 PM", label: "Dinner", name: "Yogurt Chicken Curry + Rice", cal: 930, p: 88 },
    { time: "9 PM", label: "Shake", name: "Fairlife + 2 Scoops Whey", cal: 350, p: 60 },
  ];

  return (
    <div ref={ref} className={vis ? "animate-fade-up delay-2" : ""} style={{
      background: "#141414", border: "1px solid #262626", borderRadius: 20,
      padding: "32px 28px", maxWidth: 520, width: "100%", opacity: vis ? 1 : 0,
      boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#22c55e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Monday</div>
          <div style={{ fontFamily: "'Instrument Serif'", fontSize: 24, color: "#f5f5f0" }}>Home Day</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 28, color: "#f5f5f0", fontWeight: 700 }}>1,980</div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#737373" }}>calories</div>
        </div>
      </div>
      {meals.map((m, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", padding: "14px 0",
          borderTop: i > 0 ? "1px solid #1f1f1f" : "none",
        }}>
          <div style={{ width: 56, fontFamily: "'DM Sans'", fontSize: 12, color: "#525252", flexShrink: 0 }}>{m.time}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#22c55e", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#e5e5e5", marginTop: 2 }}>{m.name}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#a3a3a3" }}>{m.cal}</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#22c55e" }}>{m.p}g P</div>
          </div>
        </div>
      ))}
      <div style={{
        marginTop: 20, padding: "16px 20px", borderRadius: 12,
        background: "linear-gradient(135deg, #0f1a11, #141414)",
        border: "1px solid #22c55e20", display: "flex", justifyContent: "space-around",
      }}>
        {[["Protein", "195g", "#22c55e"], ["Carbs", "126g", "#eab308"], ["Fat", "54g", "#3b82f6"]].map(([l, v, c]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 20, color: c, fontWeight: 700 }}>{v}</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#737373", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA Section ───

function CTASection() {
  const [ref, vis] = useInView();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div ref={ref} className={vis ? "animate-fade-up" : ""} style={{
      textAlign: "center", maxWidth: 600, margin: "0 auto",
      padding: "80px 24px", opacity: vis ? 1 : 0,
    }}>
      <h2 style={{
        fontFamily: "'Instrument Serif'", fontSize: "clamp(36px, 6vw, 56px)",
        color: "#f5f5f0", lineHeight: 1.1, marginBottom: 16, fontWeight: 400,
      }}>
        Stop eating like<br />you don't have <span style={{ color: "#22c55e", fontStyle: "italic" }}>goals</span>
      </h2>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 17, color: "#a3a3a3", marginBottom: 36, lineHeight: 1.7 }}>
        Join the waitlist. First 500 users get lifetime early-bird pricing.
      </p>
      {!submitted ? (
        <div style={{ display: "flex", gap: 12, maxWidth: 440, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              flex: "1 1 240px", padding: "16px 20px", borderRadius: 14,
              border: "1px solid #262626", background: "#141414",
              color: "#f5f5f0", fontFamily: "'DM Sans'", fontSize: 15,
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#22c55e40"}
            onBlur={e => e.target.style.borderColor = "#262626"}
          />
          <button
            onClick={() => { if (email.includes("@")) setSubmitted(true); }}
            style={{
              padding: "16px 32px", borderRadius: 14, border: "none",
              background: "#22c55e", color: "#0a0a0a", fontFamily: "'DM Sans'",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              transition: "transform 0.2s, background 0.2s",
            }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.03)"; e.target.style.background = "#16a34a"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.background = "#22c55e"; }}
          >
            Get Early Access
          </button>
        </div>
      ) : (
        <div className="animate-scale-in" style={{
          padding: "20px 32px", borderRadius: 16, background: "#0f1a11",
          border: "1px solid #22c55e30", display: "inline-block",
        }}>
          <span style={{ fontSize: 24, marginRight: 8 }}>🎉</span>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#22c55e", fontWeight: 500 }}>
            You're in! We'll be in touch soon.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main App ───

export default function FuelPlan() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 50 ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid #1f1f1f" : "1px solid transparent",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#0a0a0a",
          }}>F</div>
          <span style={{ fontFamily: "'Instrument Serif'", fontSize: 22, color: "#f5f5f0" }}>FuelPlan</span>
        </div>
        <button style={{
          padding: "10px 24px", borderRadius: 10, border: "1px solid #22c55e",
          background: "transparent", color: "#22c55e", fontFamily: "'DM Sans'",
          fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.target.style.background = "#22c55e"; e.target.style.color = "#0a0a0a"; }}
        onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#22c55e"; }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "120px 24px 80px",
        position: "relative",
      }}>
        {/* Gradient orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "20%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%", width: 300, height: 300,
          background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <Badge>AI-Powered Meal Planning</Badge>
        </div>

        <h1 className="animate-fade-up delay-1" style={{
          fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 7vw, 80px)",
          color: "#f5f5f0", textAlign: "center", lineHeight: 1.08,
          maxWidth: 800, marginBottom: 24, fontWeight: 400,
        }}>
          Your meals should<br />fit <span style={{ fontStyle: "italic", color: "#22c55e" }}>your life</span>
        </h1>

        <p className="animate-fade-up delay-2" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 19px)",
          color: "#a3a3a3", textAlign: "center", maxWidth: 540,
          lineHeight: 1.7, marginBottom: 48,
        }}>
          FuelPlan talks to you like a nutritionist — learns your schedule, your go-to meals, your cultural preferences — then builds a plan that actually works.
        </p>

        <div className="animate-fade-up delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
          <button style={{
            padding: "18px 40px", borderRadius: 14, border: "none",
            background: "#22c55e", color: "#0a0a0a", fontFamily: "'DM Sans'",
            fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 8px 32px rgba(34,197,94,0.3)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
          >
            Start Your Plan →
          </button>
          <button style={{
            padding: "18px 40px", borderRadius: 14,
            border: "1px solid #333", background: "transparent",
            color: "#e5e5e5", fontFamily: "'DM Sans'", fontSize: 16, fontWeight: 500,
            cursor: "pointer", transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.target.style.borderColor = "#555"}
          onMouseLeave={e => e.target.style.borderColor = "#333"}
          >
            See How It Works
          </button>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-up delay-4" style={{
          display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center",
        }}>
          {[["5 min", "to your plan"], ["200g+", "protein daily"], ["$95-130", "weekly groceries"]].map(([big, small]) => (
            <div key={big} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Instrument Serif'", fontSize: 32, color: "#f5f5f0" }}>{big}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#525252", marginTop: 4 }}>{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          badge="Built for real schedules"
          title="Whether you're in the office, at home, or somewhere in between"
          subtitle="FuelPlan adapts to your actual work week — not a fantasy one."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          <PersonaCard emoji="🏢" title="Office Worker" schedule="Mon–Fri, 9 to 5" pain="Needs quick breakfast, packable lunch, easy dinner after a long day" delay={2} />
          <PersonaCard emoji="🔀" title="Hybrid Worker" schedule="2-3 days in, rest home" pain="Different meals for different days — office needs prep, home days are flexible" delay={3} />
          <PersonaCard emoji="🏠" title="Remote Worker" schedule="Fully home" pain="Temptation to snack all day, but freedom to cook fresh every meal" delay={4} />
          <PersonaCard emoji="🏋️" title="Active Professional" schedule="Gym / sports + work" pain="Needs precise macros AND meals that taste good enough to sustain" delay={5} />
        </div>
      </section>

      {/* ─── HOW IT WORKS (CHAT) ─── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          badge="How it works"
          title={<>It starts with a<br /><span style={{ fontStyle: "italic", color: "#22c55e" }}>conversation</span></>}
          subtitle="Not a form. Not a quiz. A real conversation that understands context, asks smart follow-ups, and learns what you actually eat."
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ChatDemo />
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          badge="Why FuelPlan"
          title={<>Not another generic<br />meal plan app</>}
          subtitle="We researched every competitor. They all generate plans from recipe databases. We generate plans from YOUR life."
        />
        <ComparisonSection />
      </section>

      {/* ─── WHAT YOU GET ─── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          badge="What you get"
          title="Everything from one conversation"
        />
        <div style={{
          display: "flex", gap: 40, alignItems: "center", justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <PlanPreview />
          <div style={{ maxWidth: 380 }}>
            {[
              ["📋", "Full weekly meal plan", "Day-by-day with macros, timing, and your actual recipes"],
              ["🛒", "Smart grocery list", "Only what you need — excludes what you already have"],
              ["🍳", "Prep schedule", "Sunday batch cooking guide + mid-week quick preps"],
              ["🍸", "Lifestyle budget", "Room for snacks, drinks, and social eating"],
              ["📊", "Macro tracking", "Per-meal and daily breakdowns — protein-forward"],
            ].map(([icon, title, desc], i) => {
              const [ref, vis] = useInView();
              return (
                <div ref={ref} key={i} className={vis ? `animate-slide-right delay-${i+1}` : ""} style={{
                  display: "flex", gap: 16, marginBottom: 24, opacity: vis ? 1 : 0,
                }}>
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#f5f5f0", fontWeight: 600, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#737373", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle
          badge="Features"
          title="Built for people who have a life outside the gym"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <FeatureCard icon="🧠" title="AI that interviews you" desc="Not a form with dropdowns. A real conversation that understands 'I usually do shakshuka or eggs with cheese'." delay={2} />
          <FeatureCard icon="🗓️" title="Schedule-aware plans" desc="Office days get prepped meals in tupperware. Home days get fresh cooking with snacks. It knows the difference." delay={3} />
          <FeatureCard icon="🌍" title="Cultural food intelligence" desc="Indian masala cottage cheese. Japanese curry. Shakshuka. Your food, not Americanized 'grilled chicken and broccoli'." delay={4} />
          <FeatureCard icon="🍹" title="Lifestyle budgeting" desc="Friday cocktails? Saturday brunch? FuelPlan trims dinner by 150 cal and makes room — because sustainability > restriction." delay={5} />
          <FeatureCard icon="🏐" title="Activity-aware adjustments" desc="Play volleyball 3x/week? It factors in your TDEE and suggests extra carbs on game days." delay={6} />
          <FeatureCard icon="♻️" title="Iterative refinement" desc="Swap meals. Say 'I don't like tilapia'. The plan evolves with you — not the other way around." delay={7} />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        padding: "40px 24px 120px",
        background: "linear-gradient(180deg, #0a0a0a 0%, #0f1a11 100%)",
      }}>
        <CTASection />
        <div style={{
          textAlign: "center", marginTop: 48,
          fontFamily: "'DM Sans'", fontSize: 13, color: "#333",
        }}>
          Built with care. No ads. No selling your data.
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: "1px solid #1a1a1a", padding: "40px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#0a0a0a",
          }}>F</div>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#525252" }}>FuelPlan © 2026</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#525252", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#a3a3a3"}
              onMouseLeave={e => e.target.style.color = "#525252"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
