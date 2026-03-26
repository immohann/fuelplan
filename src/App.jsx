import { useState, useEffect, useRef } from "react";

const SB_URL = "https://wgvtsockreytrjfhqlvy.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndnRzb2NrcmV5dHJqZmhxbHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODQxNTgsImV4cCI6MjA5MDA2MDE1OH0.PR4zOftwmw3Xohmz_FvaWxihsPq3U_mzPixivvl3LZQ";

const F = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
if (!document.querySelector('link[href*="DM+Serif"]')) { const l = document.createElement("link"); l.href = F; l.rel = "stylesheet"; document.head.appendChild(l); }

const st = document.createElement("style");
st.textContent = `
@keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sl{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes sr{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes si{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.8}}
.fu{animation:fu .7s ease-out both}.fi{animation:fi .5s ease-out both}
.sl{animation:sl .6s ease-out both}.sr{animation:sr .6s ease-out both}.si{animation:si .5s ease-out both}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}
.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}.d7{animation-delay:.7s}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#f6f4ef;overflow-x:hidden}
::selection{background:#3d5a3e;color:#f6f4ef}
@media(max-width:768px){
  .hero-h1{font-size:38px!important}
  .g2{grid-template-columns:1fr!important}
  .g3{grid-template-columns:1fr!important}
  .g4{grid-template-columns:1fr 1fr!important}
  .pg{grid-template-columns:1fr!important}
  .cr{flex-direction:column!important}
  .cr input,.cr button{width:100%!important;flex:none!important}
  .hiw{grid-template-columns:1fr!important}
  .hiw .cc{order:-1}
}
@media(max-width:480px){.g4{grid-template-columns:1fr!important}.hero-h1{font-size:30px!important}}
`;
document.head.appendChild(st);

// ── PALETTE ──
const C = {
  bg: "#f6f4ef", card: "#ffffff", cardAlt: "#f0ede6",
  border: "#e2ddd2", borderLight: "#ebe7de",
  accent: "#3d5a3e", accentLight: "#e8efe8", accentBorder: "#3d5a3e18",
  accentHover: "#2e452f",
  text: "#1c1b18", sub: "#4a4840", muted: "#8a8878", dim: "#c4bfb2",
  lime: "#c2d36a",
};

// ── HOOKS ──
function useV(t=.12){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const e=r.current;if(!e)return;const o=new IntersectionObserver(([x])=>{if(x.isIntersecting)s(true)},{threshold:t});o.observe(e);return()=>o.disconnect()},[t]);return[r,v]}

// ── ICONS (SVG) ──
const Ic=({d,s=20,c=C.accent})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={d}/></svg>;
const I={
  chat:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  cal:"M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  globe:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  list:"M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01",
  cart:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  sliders:"M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  dl:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  act:"M22 12h-4l-3 9L9 3l-3 9H2",
  ref:"M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
  coffee:"M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3",
  ck:"M20 6L9 17l-5-5",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  leaf:"M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75",
  target:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

// ── WAITLIST ──
async function joinWL(email){
  const r=await fetch(`${SB_URL}/rest/v1/waitlist`,{method:"POST",headers:{"Content-Type":"application/json",apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,Prefer:"return=minimal"},body:JSON.stringify({email})});
  if(r.status===409)return"dup";if(!r.ok){const t=await r.text();if(t.includes("duplicate"))return"dup";throw new Error("fail")}return"ok";
}
function WL({compact}){
  const[email,setE]=useState("");const[s,setS]=useState("idle");
  const go=async()=>{if(!email.includes("@")||!email.includes("."))return;setS("load");try{const r=await joinWL(email);setS(r==="dup"?"dup":"done")}catch{setS("err")}};
  if(s==="done"||s==="dup")return(
    <div className="si" style={{padding:"12px 20px",borderRadius:10,background:C.accentLight,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",gap:8}}>
      <Ic d={I.ck} s={16}/>
      <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:14,color:C.accent,fontWeight:500}}>{s==="dup"?"You're already on the list.":"You're in. We'll reach out soon."}</span>
    </div>
  );
  return(
    <div style={{display:"flex",gap:8,maxWidth:compact?380:420,width:"100%",flexWrap:"wrap",justifyContent:compact?"center":"flex-start"}} className="cr">
      <input type="email" placeholder="your@email.com" value={email} onChange={e=>setE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
        style={{flex:"1 1 200px",padding:"0 16px",height:46,borderRadius:10,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontFamily:"'Plus Jakarta Sans'",fontSize:14,outline:"none",transition:"border-color .2s"}}
        onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
      <button onClick={go} disabled={s==="load"} style={{padding:"0 24px",height:46,borderRadius:10,border:"none",background:s==="load"?C.accentLight:C.accent,color:s==="load"?C.accent:"#fff",fontFamily:"'Plus Jakarta Sans'",fontSize:14,fontWeight:600,cursor:s==="load"?"wait":"pointer",transition:"all .2s",flexShrink:0}}
        onMouseEnter={e=>{if(s!=="load")e.target.style.background=C.accentHover}} onMouseLeave={e=>{if(s!=="load")e.target.style.background=C.accent}}>
        {s==="load"?"Joining...":"Join Waitlist"}</button>
      {s==="err"&&<span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:12,color:"#c53030",width:"100%"}}>Something went wrong. Try again.</span>}
    </div>
  );
}

// ── SECTION TITLE ──
function ST({badge,title,sub,align="center"}){
  const[r,v]=useV();
  return(<div ref={r} style={{textAlign:align,maxWidth:620,margin:align==="center"?"0 auto 44px":"0 0 44px",opacity:v?1:0}}>
    {badge&&<div className={v?"fu":""} style={{marginBottom:10}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,border:`1px solid ${C.accentBorder}`,background:C.accentLight,color:C.accent,fontSize:11,fontFamily:"'Space Mono'",letterSpacing:".06em",textTransform:"uppercase"}}>{badge}</span>
    </div>}
    <h2 className={v?"fu d1":""} style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(26px,4.5vw,42px)",color:C.text,lineHeight:1.15,marginBottom:10,fontWeight:400}}>{title}</h2>
    {sub&&<p className={v?"fu d2":""} style={{fontFamily:"'Plus Jakarta Sans'",fontSize:15,color:C.muted,lineHeight:1.7,fontWeight:300}}>{sub}</p>}
  </div>);
}

// ── CHAT DEMO ──
const msgs=[
  {r:"ai",t:"What's your current weight and goal?"},
  {r:"user",t:"185 lbs, trying to get to 170."},
  {r:"ai",t:"Got it — 15 lb cut. What does a typical breakfast look like?"},
  {r:"user",t:"Usually eggs and toast, sometimes oatmeal with protein powder"},
  {r:"ai",t:"And your work schedule?"},
  {r:"user",t:"In office Tue-Thu, home Mon and Fri"},
  {r:"ai",t:"Office days get prepped meals you can take in containers. Home days, you cook fresh. Building your plan now."},
];
function Chat(){
  const[cnt,setCnt]=useState(0);const[ref,vis]=useV(.25);const cRef=useRef(null);
  useEffect(()=>{if(!vis)return;const t=setInterval(()=>{setCnt(p=>{if(p>=msgs.length){clearInterval(t);return p}return p+1})},900);return()=>clearInterval(t)},[vis]);
  useEffect(()=>{if(cRef.current)cRef.current.scrollTop=cRef.current.scrollHeight},[cnt]);
  return(
    <div ref={ref} style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",maxWidth:400,width:"100%",boxShadow:"0 4px 24px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,background:C.cardAlt}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.dim}}/>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.dim}}/>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.dim}}/>
        <span style={{marginLeft:8,fontFamily:"'Space Mono'",fontSize:10,color:C.dim}}>kaana.com</span>
      </div>
      <div ref={cRef} style={{padding:"14px 14px 18px",minHeight:260,maxHeight:300,overflowY:"auto"}}>
        {msgs.slice(0,cnt).map((m,i)=>(
          <div key={i} className="fu" style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start",marginBottom:8}}>
            <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.r==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.r==="user"?C.accent:C.cardAlt,color:m.r==="user"?"#fff":C.sub,fontFamily:"'Plus Jakarta Sans'",fontSize:13,lineHeight:1.5,fontWeight:m.r==="user"?500:400}}>{m.t}</div>
          </div>
        ))}
        {cnt<msgs.length&&vis&&(<div style={{display:"flex",gap:4,padding:"4px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.accent,animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}</div>)}
      </div>
    </div>
  );
}

// ── PLAN PREVIEW ──
function Plan(){
  const[r,v]=useV();
  return(
    <div ref={r} className={v?"fu d2":""} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"22px 20px",maxWidth:400,width:"100%",opacity:v?1:0,boxShadow:"0 4px 24px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontFamily:"'Space Mono'",fontSize:10,color:C.accent,letterSpacing:".06em",textTransform:"uppercase"}}>Tuesday</div>
          <div style={{fontFamily:"'DM Serif Display'",fontSize:20,color:C.text}}>Office Day</div>
        </div>
        <div style={{textAlign:"right"}}>
          <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:22,color:C.text,fontWeight:700}}>1,880</span>
          <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:10,color:C.muted}}> cal</span>
        </div>
      </div>
      {[["8 AM","BREAKFAST","Eggs, toast, avocado","480","35g"],["12:30","LUNCH","Chicken bowl + greens","620","52g"],["4 PM","SNACK","Greek yogurt + almonds","200","18g"],["7:30","DINNER","Salmon, quinoa, roast veg","580","48g"]].map(([time,label,name,cal,p],i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",padding:"9px 0",borderTop:i>0?`1px solid ${C.borderLight}`:"none"}}>
          <div style={{width:40,fontFamily:"'Space Mono'",fontSize:9,color:C.dim}}>{time}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Space Mono'",fontSize:8,color:C.accent,letterSpacing:".05em"}}>{label}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:12,color:C.sub,fontWeight:400}}>{name}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:11,color:C.muted}}>{cal}</div>
            <div style={{fontFamily:"'Space Mono'",fontSize:9,color:C.accent}}>{p}</div>
          </div>
        </div>
      ))}
      <div style={{display:"flex",justifyContent:"space-around",marginTop:12,padding:"12px 0 4px",borderTop:`1px solid ${C.borderLight}`,borderRadius:8}}>
        {[["Protein","153g",C.accent],["Carbs","164g","#b8860b"],["Fat","58g","#5a7d9a"]].map(([l,val,c])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:16,color:c,fontWeight:700}}>{val}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:9,color:C.dim}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FEATURE CARD ──
function FC({icon,title,desc,delay=0}){
  const[r,v]=useV();
  return(
    <div ref={r} className={v?`fu d${delay}`:""} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"26px 22px",opacity:v?1:0,transition:"border-color .3s,box-shadow .3s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent+"30";e.currentTarget.style.boxShadow="0 4px 20px rgba(61,90,62,.06)"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none"}}>
      <div style={{width:40,height:40,borderRadius:10,background:C.accentLight,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
        <Ic d={icon} s={18}/>
      </div>
      <h3 style={{fontFamily:"'Plus Jakarta Sans'",fontSize:15,color:C.text,marginBottom:6,fontWeight:700}}>{title}</h3>
      <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.muted,lineHeight:1.65,fontWeight:300}}>{desc}</p>
    </div>
  );
}

// ── TESTIMONIAL ──
function TC({quote,name,detail,delay}){
  const[r,v]=useV();
  return(
    <div ref={r} className={v?`fu d${delay}`:""} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"24px 22px",opacity:v?1:0}}>
      <div style={{display:"flex",gap:2,marginBottom:12}}>{[...Array(5)].map((_,i)=><Ic key={i} d={I.star} s={14} c="#b8860b"/>)}</div>
      <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:14,color:C.sub,lineHeight:1.65,marginBottom:16,fontWeight:300,fontStyle:"italic"}}>"{quote}"</p>
      <div>
        <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.text,fontWeight:600}}>{name}</div>
        <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:11,color:C.dim,marginTop:2}}>{detail}</div>
      </div>
    </div>
  );
}

// ── STEP ──
function Step({num,title,desc,delay}){
  const[r,v]=useV();
  return(
    <div ref={r} className={v?`fu d${delay}`:""} style={{display:"flex",gap:16,opacity:v?1:0,alignItems:"flex-start"}}>
      <div style={{width:36,height:36,borderRadius:10,background:C.accentLight,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Mono'",fontSize:12,color:C.accent,flexShrink:0}}>{num}</div>
      <div>
        <h4 style={{fontFamily:"'Plus Jakarta Sans'",fontSize:15,color:C.text,fontWeight:700,marginBottom:4}}>{title}</h4>
        <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.muted,lineHeight:1.6,fontWeight:300}}>{desc}</p>
      </div>
    </div>
  );
}

// ── PRICING ──
function PC({tier,price,period,desc,features,cta,hl,onCta}){
  const[r,v]=useV();
  return(
    <div ref={r} className={v?"si d2":""} style={{background:hl?C.accentLight:C.card,border:`1px solid ${hl?C.accent+"30":C.border}`,borderRadius:16,padding:"32px 26px",opacity:v?1:0,position:"relative",overflow:"hidden"}}>
      {hl&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.accent},transparent)`}}/>}
      <div style={{fontFamily:"'Space Mono'",fontSize:10,color:hl?C.accent:C.muted,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>{tier}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:6}}>
        <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:38,color:C.text,fontWeight:800}}>{price}</span>
        {period&&<span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.muted}}>/{period}</span>}
      </div>
      <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.muted,marginBottom:22,fontWeight:300}}>{desc}</p>
      <div style={{marginBottom:24}}>
        {features.map((f,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
          <Ic d={I.ck} s={14}/><span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.sub,fontWeight:400}}>{f}</span>
        </div>))}
      </div>
      <button onClick={onCta} style={{width:"100%",padding:"12px",borderRadius:10,border:hl?"none":`1px solid ${C.border}`,background:hl?C.accent:C.card,color:hl?"#fff":C.sub,fontFamily:"'Plus Jakarta Sans'",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all .2s"}}
        onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";if(hl)e.target.style.background=C.accentHover}}
        onMouseLeave={e=>{e.target.style.transform="none";if(hl)e.target.style.background=C.accent}}>{cta}</button>
    </div>
  );
}

// ── COMPARISON ──
function Comp(){
  const[r,v]=useV();
  return(
    <div ref={r} className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,maxWidth:780,margin:"0 auto"}}>
      <div className={v?"sl d2":""} style={{background:"#faf5f0",border:"1px solid #e8ddd0",borderRadius:14,padding:"28px 22px",opacity:v?1:0}}>
        <div style={{fontFamily:"'Space Mono'",fontSize:10,color:"#c53030",letterSpacing:".06em",textTransform:"uppercase",marginBottom:16}}>Typical meal plan apps</div>
        {["Pick from a recipe database","Same plan for everyone","Doesn't know your schedule","Ignores what you already eat","No room for real life"].map((t,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c53030" strokeWidth="2" style={{marginTop:3,flexShrink:0}}><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:"#8a7a6a",lineHeight:1.5,fontWeight:300}}>{t}</span>
          </div>
        ))}
      </div>
      <div className={v?"sr d3":""} style={{background:C.accentLight,border:`1px solid ${C.accent}20`,borderRadius:14,padding:"28px 22px",opacity:v?1:0}}>
        <div style={{fontFamily:"'Space Mono'",fontSize:10,color:C.accent,letterSpacing:".06em",textTransform:"uppercase",marginBottom:16}}>kaana</div>
        {["Plans built from a conversation with you","Learns your go-to meals and preferences","Adapts to your work schedule","Grocery list minus what you already own","Budgets for snacks, social meals, real life"].map((t,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
            <Ic d={I.ck} s={12}/><span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:13,color:C.text,lineHeight:1.5,fontWeight:400}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════
export default function kaana(){
  const[sY,setSY]=useState(0);
  useEffect(()=>{const h=()=>setSY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  const toWL=()=>document.getElementById("waitlist")?.scrollIntoView({behavior:"smooth"});

  return(
    <div style={{background:C.bg,minHeight:"100vh"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:sY>40?"rgba(246,244,239,.92)":"transparent",backdropFilter:sY>40?"blur(12px)":"none",borderBottom:sY>40?`1px solid ${C.borderLight}`:"1px solid transparent",transition:"all .3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:C.accentLight,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic d={I.leaf} s={14}/>
          </div>
          <span style={{fontFamily:"'DM Serif Display'",fontSize:20,color:C.text}}>kaana</span>
        </div>
        <button onClick={toWL} style={{padding:"8px 18px",borderRadius:8,border:"none",background:C.accent,color:"#fff",fontFamily:"'Plus Jakarta Sans'",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>e.target.style.background=C.accentHover} onMouseLeave={e=>e.target.style.background=C.accent}>Join Waitlist</button>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",position:"relative"}}>
        {/* Subtle pattern */}
        <div style={{position:"absolute",inset:0,opacity:.025,backgroundImage:`radial-gradient(${C.accent} 1px, transparent 1px)`,backgroundSize:"32px 32px",maskImage:"radial-gradient(ellipse 50% 40% at 50% 40%, black, transparent)",WebkitMaskImage:"radial-gradient(ellipse 50% 40% at 50% 40%, black, transparent)"}}/>

        <div className="fu" style={{marginBottom:16}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 14px",borderRadius:100,border:`1px solid ${C.accentBorder}`,background:C.accentLight,color:C.accent,fontSize:10,fontFamily:"'Space Mono'",letterSpacing:".06em",textTransform:"uppercase"}}>
            Smart meal prep platform
          </span>
        </div>

        <h1 className="fu d1 hero-h1" style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(38px,7vw,64px)",color:C.text,textAlign:"center",lineHeight:1.08,maxWidth:620,marginBottom:16,fontWeight:400}}>
          Your meals should<br/>fit <span style={{color:C.accent}}>your life</span>
        </h1>

        <p className="fu d2" style={{fontFamily:"'Plus Jakarta Sans'",fontSize:"clamp(14px,1.8vw,17px)",color:C.muted,textAlign:"center",maxWidth:440,lineHeight:1.7,marginBottom:36,fontWeight:300}}>
          kaana learns how you eat, adapts to your schedule, connects to your grocery stores, and keeps you on track — week after week.
        </p>

        <div className="fu d3" style={{marginBottom:48}}><WL/></div>

        <div className="fu d4" style={{display:"flex",gap:36,flexWrap:"wrap",justifyContent:"center"}}>
          {[["Conversational","AI onboarding"],["Schedule-aware","Meal planning"],["Grocery-connected","Store integration"]].map(([big,sm])=>(
            <div key={big} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:14,color:C.text,fontWeight:600}}>{big}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:11,color:C.dim,marginTop:2,fontWeight:300}}>{sm}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"100px 24px",maxWidth:960,margin:"0 auto"}}>
        <ST badge="How it works" title={<>It starts with a <span style={{color:C.accent}}>conversation</span></>} sub="Tell kaana what you eat, how you work, and what you're aiming for. It builds everything from there."/>
        <div className="hiw" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36,alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",gap:22}}>
            <Step num="01" title="Share your goals" desc="Weight, timeline, activity level. kaana asks the right follow-ups so nothing gets missed." delay={2}/>
            <Step num="02" title="Tell us what you eat" desc="Your actual meals — the food you already cook and love. We plan around your kitchen, not a recipe database." delay={3}/>
            <Step num="03" title="Describe your week" desc="Office days, home days, gym days. Each gets a meal structure that fits naturally." delay={4}/>
            <Step num="04" title="Get your full plan" desc="Meals, macros, grocery list, prep schedule — ready in minutes. Adjust anytime." delay={5}/>
          </div>
          <div className="cc" style={{display:"flex",justifyContent:"center"}}><Chat/></div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section style={{padding:"100px 24px",maxWidth:960,margin:"0 auto"}}>
        <ST badge="What you get" title="Everything from one conversation"/>
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,alignItems:"center"}}>
          <Plan/>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {[[I.list,"Weekly meal plan","Day-by-day meals with per-meal macros and timing"],[I.cart,"Smart grocery list","Only what you need — skips what's already in your kitchen"],[I.cal,"Prep schedule","Know exactly what to cook Sunday vs. mid-week"],[I.sliders,"Easy adjustments","Swap meals, change portions, regenerate anything"],[I.dl,"Export anywhere","Download as PDF or spreadsheet"]].map(([icon,title,desc],i)=>{
              const[r,v]=useV();
              return(<div ref={r} key={i} className={v?`sr d${i+1}`:""} style={{display:"flex",gap:12,opacity:v?1:0}}>
                <div style={{width:36,height:36,borderRadius:8,background:C.accentLight,border:`1px solid ${C.accentBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic d={icon} s={16}/></div>
                <div>
                  <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:14,color:C.text,fontWeight:600,marginBottom:2}}>{title}</div>
                  <div style={{fontFamily:"'Plus Jakarta Sans'",fontSize:12,color:C.muted,fontWeight:300}}>{desc}</div>
                </div>
              </div>);
            })}
          </div>
        </div>
      </section>

      {/* WHY kaana */}
      <section style={{padding:"100px 24px",maxWidth:960,margin:"0 auto"}}>
        <ST badge="Why kaana" title="Plans built from your life, not a recipe database" sub="Your meals should reflect how you actually cook, eat, and live — not someone else's idea of healthy."/>
        <Comp/>
      </section>

      {/* FEATURES */}
      <section style={{padding:"100px 24px",maxWidth:960,margin:"0 auto"}}>
        <ST badge="Features" title="What makes kaana different"/>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          <FC icon={I.chat} title="Conversational onboarding" desc="Tell kaana about yourself naturally. No 20-field forms, no rigid questionnaires." delay={2}/>
          <FC icon={I.cal} title="Schedule-aware plans" desc="Office days get packable prepped meals. Home days get fresh cooking. Weekends stay flexible." delay={3}/>
          <FC icon={I.globe} title="Works with any cuisine" desc="Cook Japanese, Indian, Mexican, or anything in between — your food stays on the plan." delay={4}/>
          <FC icon={I.coffee} title="Real-life budgeting" desc="Room for snacks, social dinners, weekend drinks. Plans that don't pretend life is a lab." delay={5}/>
          <FC icon={I.act} title="Activity-adjusted targets" desc="Calorie and macro targets adapt to training days, rest days, and everything in between." delay={6}/>
          <FC icon={I.ref} title="Iterate every week" desc="Plans evolve with you. Swap meals, adjust goals, add new preferences — it gets smarter over time." delay={7}/>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"100px 24px",maxWidth:960,margin:"0 auto"}}>
        <ST badge="Early feedback" title="What early users are saying"/>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          <TC quote="I told it what I actually eat and it built around that. First time I've stuck with a meal plan past week two." name="Priya S." detail="Software Engineer" delay={2}/>
          <TC quote="The schedule-aware feature is clutch. My office days and home days are completely different — kaana gets that." name="Marcus T." detail="Data Analyst" delay={3}/>
          <TC quote="Having a grocery list that skips what I already have saves me so much time and money every week." name="Sarah K." detail="Product Manager" delay={4}/>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"100px 24px",maxWidth:740,margin:"0 auto"}}>
        <ST badge="Pricing" title="Start free. Upgrade when you're ready."/>
        <div className="pg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <PC tier="Free" price="$0" period="" desc="Everything you need to get started."
            features={["1 meal plan per week","Basic macro targets","Standard grocery list","3 meal swaps per plan"]}
            cta="Get Started" onCta={toWL}/>
          <PC tier="Pro" price="$19" period="mo" desc="For people who are serious about results." hl
            features={["Unlimited plan generations","Unlimited meal swaps","PDF + spreadsheet export","Prep schedule builder","Advanced macro customization","Priority AI conversations"]}
            cta="Join Waitlist" onCta={toWL}/>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" style={{padding:"100px 24px 120px",background:"linear-gradient(180deg,#f6f4ef,#edeae2)"}}>
        <div style={{textAlign:"center",maxWidth:480,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(28px,5vw,42px)",color:C.text,lineHeight:1.1,marginBottom:12,fontWeight:400}}>
            Eat well, <span style={{color:C.accent}}>live well</span>
          </h2>
          <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:15,color:C.muted,marginBottom:32,lineHeight:1.7,fontWeight:300}}>
            Join the waitlist. First 500 users get early-bird pricing for life.
          </p>
          <div style={{display:"flex",justifyContent:"center"}}><WL compact/></div>
          <p style={{fontFamily:"'Plus Jakarta Sans'",fontSize:11,color:C.dim,marginTop:28}}>No spam. No ads. Your data stays yours.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"32px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,background:C.cardAlt}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Ic d={I.leaf} s={14}/>
          <span style={{fontFamily:"'Plus Jakarta Sans'",fontSize:12,color:C.dim}}>kaana © 2026</span>
        </div>
        <div style={{display:"flex",gap:18}}>
          {["Privacy","Terms","Contact"].map(l=>(
            <span key={l} style={{fontFamily:"'Plus Jakarta Sans'",fontSize:11,color:C.dim,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color=C.muted} onMouseLeave={e=>e.target.style.color=C.dim}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
