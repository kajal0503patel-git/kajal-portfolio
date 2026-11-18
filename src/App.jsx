import React, { useEffect, useRef, useState } from "react";
import { PROFILE, SKILL_GROUPS as SKILL_DATA, PROJECTS as PROJECT_DATA, ACHIEVEMENTS } from "./data";

const COLORS = {
  bg: "#12091A",
  bgAlt: "#0C0612",
  surface: "#1E1229",
  surfaceRaised: "#271835",
  border: "#3A2350",
  borderStrong: "#4F3068",
  text: "#F8EEF6",
  textSecondary: "#C9B5CD",
  textMuted: "#9C86A6",
  brass: "#EC4899",
  brassSoft: "#F472B6",
  terracotta: "#F59E0B",
  terracottaSoft: "#FBBF24",
  forest: "#22D3EE",
  forestSoft: "#67E8F9",
};

const SKILL_GROUPS = SKILL_DATA.map((g) => ({ ...g, color: COLORS[g.color] || COLORS.brass }));
const PROJECTS = PROJECT_DATA.map((p) => ({ ...p, accent: COLORS[p.accent] || COLORS.brass }));

const FONTS_LINK =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

/* ---------- utilities ---------- */

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "", style = {}, from = "up" }) {
  const [ref, visible] = useReveal();
  const offset =
    from === "left" ? "translateX(-24px)" : from === "right" ? "translateX(24px)" : "translateY(18px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0px,0px)" : offset,
        transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- typewriter ---------- */

function Typewriter({ text, speed = 85 }) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {display}
      <span
        style={{
          display: "inline-block",
          width: 8,
          color: COLORS.brass,
          animation: done ? "none" : "blinkCursor 0.9s step-end infinite",
        }}
      >
        |
      </span>
    </span>
  );
}

/* ---------- hero terminal card (reads everything from data.js) ---------- */

function TerminalCard() {
  const cls = PROFILE.name.split(" ")[0];
  const tone = { kw: COLORS.terracottaSoft, type: COLORS.forestSoft, str: COLORS.brassSoft, plain: COLORS.textSecondary };
  const list = (a) => a.flatMap((x, i) => [...(i ? [[", ", "plain"]] : []), [`"${x}"`, "str"]]);
  const lines = [
    [["public class ", "kw"], [cls, "type"], [" {", "plain"]],
    [["  ", "plain"], ["String", "type"], [" role = ", "plain"], [`"${PROFILE.role}"`, "str"], [";", "plain"]],
    [["  ", "plain"], ["String[]", "type"], [" stack = {", "plain"], ...list(PROFILE.stack), ["};", "plain"]],
    [["  ", "plain"], ["String", "type"], [" learning = ", "plain"], [`"${PROFILE.learning.join(", ")}"`, "str"], [";", "plain"]],
    [["}", "plain"]],
  ];
  const lineLen = (ln) => ln.reduce((n, [t]) => n + t.length, 0);
  const total = lines.reduce((n, ln) => n + lineLen(ln) + 1, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      return;
    }
    if (typed >= total) return;
    const t = setTimeout(() => setTyped(typed + 1), typed === 0 ? 900 : 34);
    return () => clearTimeout(t);
  }, [typed, total]);

  // turn the typed-character count into the visible part of each line
  let left = typed;
  const visible = [];
  for (const ln of lines) {
    if (left <= 0) break;
    let n = Math.min(left, lineLen(ln));
    const segs = [];
    for (const [t, c] of ln) {
      if (n <= 0) break;
      segs.push([t.slice(0, n), c]);
      n -= t.length;
    }
    visible.push(segs);
    left -= lineLen(ln) + 1;
  }

  return (
    <div style={{ background: `${COLORS.surface}F2`, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", boxShadow: `0 0 44px ${COLORS.brass}44` }}>
      <div className="flex items-center gap-2" style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.terracotta }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.brassSoft }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.forest }} />
        <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted }}>~/portfolio/{cls}.java</span>
      </div>
      <div style={{ padding: "18px 20px 22px", fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(11px, 3.3vw, 12.5px)", lineHeight: 1.95, minHeight: lines.length * 22 + 40, overflowX: "auto" }}>
        {visible.map((segs, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap", minHeight: "1.95em" }}>
            {segs.map(([t, c], j) => (
              <span key={j} style={{ color: tone[c] }}>{t}</span>
            ))}
            {i === visible.length - 1 && <span style={{ color: COLORS.brassSoft, animation: "blinkCursor 1s step-end infinite" }}>▍</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- falling stars background ---------- */

function FallingStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TINTS = ["244,114,182", "244,114,182", "103,232,249", "251,191,36"];
    let w, h, stars = [], meteors = [], rafId, last = performance.now(), nextSpawn = 0.4;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(140, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      }));
      if (reduce) paint(performance.now());
    }

    function spawn() {
      const angle = ((110 + Math.random() * 22) * Math.PI) / 180;
      meteors.push({
        x: w * (0.25 + Math.random() * 0.85),
        y: -30,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed: 380 + Math.random() * 320,
        len: 90 + Math.random() * 100,
        tint: TINTS[Math.floor(Math.random() * TINTS.length)],
      });
    }

    function paint(now) {
      const t = now / 1000;
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, COLORS.bg);
      bg.addColorStop(1, COLORS.bgAlt);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const st of stars) {
        const a = 0.25 + 0.4 * (0.5 + 0.5 * Math.sin(t * st.speed + st.phase));
        ctx.fillStyle = `rgba(248,238,246,${a})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const m of meteors) {
        const tx = m.x - m.dx * m.len;
        const ty = m.y - m.dy * m.len;
        const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
        g.addColorStop(0, `rgba(${m.tint},0)`);
        g.addColorStop(1, "rgba(255,255,255,0.95)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      nextSpawn -= dt;
      if (nextSpawn <= 0 && meteors.length < 5) {
        spawn();
        nextSpawn = 0.7 + Math.random() * 1.6;
      }
      meteors = meteors.filter((m) => {
        m.x += m.dx * m.speed * dt;
        m.y += m.dy * m.speed * dt;
        return m.y < h + m.len && m.x > -m.len;
      });
      paint(now);
      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ---------- ask-me-anything faq bot ---------- */

function buildKnowledgeBase() {
  return [
    {
      keys: ["name", "who are you", "who is kajal", "about you"],
      answer: "I'm Kajal Patel, a Computer Science undergraduate (B.Tech, expected 2028) based in Bhopal, Madhya Pradesh, India, focused on building software with Java and Spring Boot.",
    },
    {
      keys: ["skill", "tech stack", "technologies", "what do you know", "languages", "programming"],
      answer: "Core Java, OOP and design, Spring Boot, Spring Data JPA, REST API design, microservices, MySQL, MongoDB, Redis, Docker, JUnit 5 and Maven. I also work with the MERN stack and integrate LLM APIs with prompt engineering.",
    },
    {
      keys: ["experience", "internship", "worked", "job", "work history", "leadership", "sih", "hackathon"],
      answer: "I'm looking for a Software Engineer role. My hands-on experience comes from the projects below and from leading a student team to 1st place in the institutional rounds of Smart India Hackathon 2026.",
    },
    {
      keys: ["project", "built", "made", "portfolio work"],
      answer: `I've built ${PROJECTS.length} main projects: ${PROJECTS.map((p) => p.title).join(", ")}. Ask me about any one of them by name for more detail.`,
    },
    {
      keys: ["url", "shortener", "redis", "cache", "rate limit"],
      answer: "The URL shortener is a Spring Boot service that encodes MySQL sequential keys into Base62 short links with HTTP 302 redirects. It has a Redis cache-aside layer (1-hour TTL) that falls back to MySQL if the cache fails, IP-based rate limiting (5 requests/min, HTTP 429), JUnit 5 tests and a Docker Compose setup.",
    },
    {
      keys: ["hireflow", "ai interviewer", "interview", "llm", "ai"],
      answer: "HireFlow is an AI-powered candidate evaluation system. Node.js/Express microservices call third-party LLM APIs using structured prompts and a multi-step flow (question generation, response evaluation, scorecard generation) to produce real-time scorecards, with a React front end.",
    },
    {
      keys: ["erp"],
      answer: "The ERP system is a MERN app with modular backend APIs for inventory, employee directory and departmental workflows, MVC structure, custom authentication middleware and MongoDB schemas with indexing.",
    },
    {
      keys: ["library", "inventory", "book management"],
      answer: "The Library and Inventory Management System is a full-stack catalog app (React, Node.js, Express, MongoDB) with real-time search, cataloging and status auditing, plus payload validation to prevent runtime failures.",
    },
    {
      keys: ["education", "college", "degree", "cgpa", "study", "university"],
      answer: "I'm pursuing a B.Tech in Computer Science and Engineering at NRI Institute of Research and Technology, Bhopal, with a CGPA of 7.5/10 and expected graduation in 2028.",
    },
    {
      keys: ["achievement", "leetcode", "rank", "contest", "coding challenge", "rating"],
      answer: "I've solved 279+ LeetCode problems (101 Easy, 142 Medium, 36 Hard), hold the Knight badge with a contest rating of 1,903 (top 4.56% globally), and placed 4th in a college-wide algorithmic competition.",
    },
    {
      keys: ["contact", "email", "reach", "hire", "linkedin", "github"],
      answer: `You can reach me at ${PROFILE.email}, or find me on LinkedIn (${PROFILE.linkedin.replace("https://", "")}) and GitHub (${PROFILE.github.replace("https://", "")}).`,
    },
    {
      keys: ["location", "based", "live", "city", "where are you"],
      answer: `I'm based in ${PROFILE.location}.`,
    },
    {
      keys: ["looking for", "role", "opportunity", "internship search", "goal"],
      answer: "I'm looking for a Software Engineer role, where I can own backend modules and keep learning system design.",
    },
    {
      keys: ["resume", "cv"],
      answer: "You can download my resume as a PDF using the \"Resume\" button in the navigation bar or the hero section.",
    },
    {
      keys: ["hobby", "curious", "free time", "interest", "fun fact"],
      answer: "I like picking up new tools and ideas just to see how they work, which is part of why this portfolio has a chatbot and a falling-stars background.",
    },
  ];
}

function matchAnswer(kb, question) {
  const q = question.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of kb) {
    for (const key of entry.keys) {
      if (q.includes(key)) {
        const score = key.length;
        if (score > bestScore) {
          bestScore = score;
          best = entry.answer;
        }
      }
    }
  }
  return best || "I don't have a ready answer for that — try asking about my skills, projects, experience, education, achievements, or how to contact me.";
}

function AskMeBot() {
  const kb = useRef(buildKnowledgeBase()).current;
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, ask me anything about Kajal — skills, projects, experience, education, or how to get in touch." },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function send(text) {
    const q = text.trim();
    if (!q) return;
    const answer = matchAnswer(kb, q);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "bot", text: answer }]);
    setInput("");
  }

  const suggestions = ["What are your skills?", "Tell me about your projects", "How can I contact you?", "What's your education?"];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div ref={listRef} style={{ height: 320, overflowY: "auto", padding: "18px 18px 8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "9px 13px",
                borderRadius: 10,
                fontSize: 13.5,
                lineHeight: 1.55,
                background: m.role === "user" ? COLORS.brass : COLORS.surfaceRaised,
                color: m.role === "user" ? COLORS.bg : COLORS.textSecondary,
                border: m.role === "user" ? "none" : `1px solid ${COLORS.border}`,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" style={{ padding: "0 18px 12px" }}>
        {suggestions.map((s) => (
          <button
            key={s}
            className="btn-outline"
            onClick={() => send(s)}
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 16, background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, cursor: "pointer" }}
          >
            {s}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        style={{ display: "flex", gap: 8, padding: 14, borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgAlt }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my skills, projects, experience..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 13.5, outline: "none" }}
        />
        <button type="submit" className="btn-fill" style={{ padding: "10px 18px", borderRadius: 6, background: COLORS.brass, color: COLORS.bg, border: "none", fontWeight: 500, fontSize: 13.5, cursor: "pointer" }}>
          Ask
        </button>
      </form>
    </div>
  );
}

/* ---------- tilt card + proximity rgb glow ---------- */

const TiltCard = React.forwardRef(function TiltCard(
  { children, style = {}, className = "", _near = false, ...rest },
  outerRef
) {
  const localRef = useRef(null);
  const [tf, setTf] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");

  function setRefs(el) {
    localRef.current = el;
    if (typeof outerRef === "function") outerRef(el);
    else if (outerRef) outerRef.current = el;
  }

  function onMove(e) {
    const el = localRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rotateY = px * 16;
    const rotateX = -py * 16;
    setTf(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.03)`);
  }

  function onLeave() {
    setTf("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");
  }

  return (
    <div
      ref={setRefs}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card${_near ? " tilt-card-near" : ""} ${className}`}
      style={{
        transform: tf,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

function ProximityGlowGrid({ children, className = "", style = {} }) {
  const itemRefs = useRef([]);
  const [nearSet, setNearSet] = useState(() => new Set());
  const rafRef = useRef(null);
  const lastEvent = useRef(null);

  function compute() {
    const e = lastEvent.current;
    if (!e) return;
    const margin = 55;
    const next = new Set();
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientX >= r.left - margin &&
        e.clientX <= r.right + margin &&
        e.clientY >= r.top - margin &&
        e.clientY <= r.bottom + margin
      ) {
        next.add(i);
      }
    });
    setNearSet(next);
  }

  function onMove(e) {
    lastEvent.current = e;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      compute();
    });
  }

  function onLeave() {
    lastEvent.current = null;
    setNearSet(new Set());
  }

  const items = React.Children.map(children, (child, i) =>
    React.cloneElement(child, {
      ref: (el) => (itemRefs.current[i] = el),
      _near: nearSet.has(i),
    })
  );

  return (
    <div className={className} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {items}
    </div>
  );
}

/* ---------- resume PDF generation ---------- */

async function downloadResumePDF() {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  function ensureSpace(lines) {
    if (y + lines * 14 > pageHeight - 40) {
      doc.addPage();
      y = 56;
    }
  }

  function heading(text) {
    ensureSpace(2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(30, 30, 28);
    doc.text(text.toUpperCase(), marginX, y);
    y += 6;
    doc.setDrawColor(200, 162, 77);
    doc.setLineWidth(1);
    doc.line(marginX, y, marginX + maxWidth, y);
    y += 16;
  }

  function bullet(text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 56);
    const lines = doc.splitTextToSize("- " + text, maxWidth - 10);
    ensureSpace(lines.length);
    doc.text(lines, marginX + 6, y);
    y += lines.length * 13 + 4;
  }

  function paragraph(text) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 56);
    const lines = doc.splitTextToSize(text, maxWidth);
    ensureSpace(lines.length);
    doc.text(lines, marginX, y);
    y += lines.length * 13 + 6;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 18);
  doc.text("Kajal Patel", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(90, 90, 85);
  doc.text("Software Engineer | Java | Spring Boot | RESTful Services | Design & Architecture", marginX, y);
  y += 16;
  doc.text(`${PROFILE.location} | ${PROFILE.phone} | ${PROFILE.email}`, marginX, y);
  y += 14;
  doc.text(`${PROFILE.linkedin.replace("https://", "")} | ${PROFILE.github.replace("https://", "")}`, marginX, y);
  y += 24;

  heading("Professional Summary");
  paragraph(
    "Computer Science undergraduate (B.Tech, expected 2028) seeking a Software Engineering role. Strong foundation in Core Java, Object Oriented Design, Spring Boot, RESTful web services and backend architecture, with hands-on experience building modular microservices, caching layers (Redis), relational databases (MySQL) and unit-tested code (JUnit 5). Solved 279+ LeetCode problems (contest rating 1,903, top 4.56% globally). Experience integrating LLM APIs with prompt engineering, and leading a student team to 1st place in institutional rounds of Smart India Hackathon 2026."
  );

  heading("Technical Skills");
  SKILL_GROUPS.forEach((g) => bullet(g.title + ": " + g.items.join(", ")));

  heading("Projects");
  PROJECTS.forEach((pr) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 28);
    ensureSpace(1);
    doc.text(pr.title + " | " + pr.stack.join(", "), marginX, y);
    y += 16;
    pr.points.forEach((pt) => bullet(pt));
  });

  heading("Achievements and Leadership");
  ACHIEVEMENTS.forEach((a) => bullet(a.label + ": " + a.number + " (" + a.sub + ")"));

  heading("Education");
  bullet("B.Tech, Computer Science and Engineering - NRI Institute of Research and Technology, Bhopal | Expected 2028 | CGPA 7.5/10");
  bullet("Coursework: OOP and Design, DSA, DBMS, Operating Systems, Distributed Systems, Software Engineering Principles, Concurrency");

  doc.save("Kajal_Patel_Resume.pdf");
}

/* ---------- static content ---------- */

function Eyebrow({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.brass }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(28px, 4vw, 40px)", color: COLORS.text, letterSpacing: "-0.01em", marginBottom: 8 }}>
      {children}
    </h2>
  );
}

function Tag({ children, color = COLORS.brass }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "5px 11px", borderRadius: 4, background: `${color}22`, color, border: `1px solid ${color}33`, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "ask", label: "Ask me" },
  { id: "contact", label: "Contact" },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadResumePDF();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ position: "relative", color: COLORS.text, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <link rel="stylesheet" href={FONTS_LINK} />
      <style>{`
        @keyframes blinkCursor { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }

        .brand-btn { transition: color 0.2s ease, opacity 0.2s ease; }
        .brand-btn:hover { color: ${COLORS.brassSoft} !important; }

        .nav-link { transition: color 0.2s ease, background 0.2s ease; }
        .nav-link:hover { color: ${COLORS.brass} !important; background: ${COLORS.brass}14; }

        .icon-btn { transition: color 0.2s ease, transform 0.15s ease; }
        .icon-btn:hover { color: ${COLORS.brass} !important; transform: scale(1.1); }

        .btn-fill { transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
        .btn-fill:hover:not(:disabled) { background: ${COLORS.brassSoft} !important; transform: translateY(-2px); box-shadow: 0 8px 18px ${COLORS.brass}33; }

        .btn-outline { transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease, transform 0.15s ease; }
        .btn-outline:hover:not(:disabled) { border-color: ${COLORS.brass} !important; color: ${COLORS.brass} !important; background: ${COLORS.brass}12; transform: translateY(-2px); }

        .footer-link { transition: color 0.2s ease; }
        .footer-link:hover { color: ${COLORS.brassSoft} !important; }

        .link-accent { transition: opacity 0.2s ease; }
        .link-accent:hover { opacity: 0.7; }

        .tilt-card { position: relative; box-shadow: 0 0 0 1px ${COLORS.brass}22, 0 0 26px ${COLORS.brass}26; transition: box-shadow 0.3s ease; }
        .tilt-card:hover { box-shadow: 0 0 0 1px ${COLORS.brass}66, 0 0 40px ${COLORS.brass}55; }
        .glow-box { box-shadow: 0 0 0 1px ${COLORS.brass}22, 0 0 26px ${COLORS.brass}26; }
        h1, h2 { text-shadow: 0 0 22px ${COLORS.brass}73, 0 0 52px ${COLORS.brass}33; }
        h3 { text-shadow: 0 0 14px ${COLORS.brass}40; }
        .btn-fill { box-shadow: 0 0 22px ${COLORS.brass}66; }
        .tilt-card::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(115deg, #ff5f7e, #ffcb57, #4ade80, #4facfe, #a78bfa, #ff5f7e);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.25s ease;
          animation: rgbFlow 3.5s linear infinite;
          pointer-events: none;
        }
        .tilt-card-near::before { opacity: 1; }
        @keyframes rgbFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>

      <FallingStars />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: `${COLORS.bg}E6`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
            <button className="brand-btn" onClick={() => scrollTo("about")} style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 19, color: COLORS.text, background: "none", border: "none", cursor: "pointer" }}>
              Kajal Patel
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)} style={{ fontSize: 13, padding: "8px 14px", borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: activeSection === item.id ? COLORS.brass : COLORS.textSecondary, transition: "color 0.2s ease" }}>
                  {item.label}
                </button>
              ))}
              <button
                className="btn-fill"
                onClick={handleDownload}
                disabled={downloading}
                style={{ marginLeft: 8, fontSize: 13, padding: "8px 16px", borderRadius: 6, background: COLORS.brass, color: COLORS.bg, fontWeight: 500, border: "none", cursor: downloading ? "default" : "pointer", opacity: downloading ? 0.7 : 1 }}
              >
                {downloading ? "Preparing…" : "Resume"}
              </button>
            </div>

            <button className="md:hidden icon-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: COLORS.text, fontSize: 22, cursor: "pointer" }} aria-label="Toggle menu">
              {menuOpen ? "\u2715" : "\u2630"}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden flex flex-col px-6 pb-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              {NAV_ITEMS.map((item) => (
                <button key={item.id} className="nav-link" onClick={() => scrollTo(item.id)} style={{ textAlign: "left", padding: "12px 0", background: "none", border: "none", color: COLORS.textSecondary, fontSize: 15, cursor: "pointer" }}>
                  {item.label}
                </button>
              ))}
              <button className="link-accent" onClick={handleDownload} style={{ textAlign: "left", padding: "12px 0", background: "none", border: "none", color: COLORS.brass, fontSize: 15, cursor: "pointer" }}>
                {downloading ? "Preparing…" : "Download resume"}
              </button>
            </div>
          )}
        </nav>

        {/* HERO */}
        <header className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
          <div style={{ marginBottom: 22, fontSize: 15, color: COLORS.brassSoft, minHeight: 22, display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px", borderRadius: 20, background: `${COLORS.brass}18`, border: `1px solid ${COLORS.brass}44` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.brassSoft, flexShrink: 0 }} />
            <Typewriter text="Welcome to my portfolio" />
          </div>

          <Reveal delay={80}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 820, color: COLORS.text }}>
              Turning problems into{" "}
              <span style={{ color: COLORS.brass, fontStyle: "italic" }}>software</span> that actually works.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: 620 }}>
              I'm Kajal, a software engineering student from Bhopal. I enjoy working out how things run under the hood and then building them properly, from the APIs and databases to the screens people actually use. Right now I'm sharpening my Java, Spring Boot and system design, and I'm looking for a team where I can build real things.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 mt-9">
              <button className="btn-fill" onClick={() => scrollTo("projects")} style={{ padding: "13px 24px", borderRadius: 6, background: COLORS.brass, color: COLORS.bg, border: "none", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
                View projects
              </button>
              <button className="btn-outline" onClick={handleDownload} disabled={downloading} style={{ padding: "13px 24px", borderRadius: 6, background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.borderStrong}`, fontWeight: 500, fontSize: 14, cursor: downloading ? "default" : "pointer" }}>
                {downloading ? "Preparing…" : "Download resume"}
              </button>
              <a className="btn-outline" href={`mailto:${PROFILE.email}`} style={{ padding: "13px 24px", borderRadius: 6, background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.borderStrong}`, fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
                Contact me
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10" style={{ paddingTop: 20, borderTop: `1px solid ${COLORS.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.textMuted }}>
              <span>{PROFILE.location}</span>
              <a className="footer-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={{ color: COLORS.textMuted }}>linkedin.com/in/kajal-patel</a>
              <a className="footer-link" href={PROFILE.github} target="_blank" rel="noreferrer" style={{ color: COLORS.textMuted }}>{PROFILE.github.replace("https://", "")}</a>
            </div>
          </Reveal>
          </div>
          <Reveal className="lg:col-span-2 min-w-0" delay={300}>
            <TerminalCard />
            <div className="flex flex-wrap gap-x-6 gap-y-2" style={{ marginTop: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              <button className="link-accent" onClick={() => scrollTo("ask")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: COLORS.brassSoft }}>Curious? Ask me anything →</button>
              <button className="link-accent" onClick={() => scrollTo("contact")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: COLORS.forestSoft }}>Let's build together →</button>
            </div>
          </Reveal>
        </header>

        {/* ABOUT */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-20">
          <Reveal>
            <Eyebrow label="About" />
            <SectionHeading>A software engineer in the making.</SectionHeading>
          </Reveal>
          <div className="grid md:grid-cols-5 gap-10 mt-8">
            <Reveal className="md:col-span-3" delay={80} from="left">
              <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.textSecondary }}>
                I'm a B.Tech Computer Science student who enjoys the whole journey of building software: planning the design, writing clean code, testing it and watching it run. Java and Spring Boot are my home base, and I'm comfortable on the front end with React too.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.textSecondary, marginTop: 16 }}>
                I care about the unglamorous parts that keep software reliable, like tests, error handling and caching. I've built a URL shortener, an AI interviewer and full-stack MERN apps, and I'm always picking up something new. Right now, that's system design.
              </p>
            </Reveal>
            <Reveal className="md:col-span-2" delay={160} from="right">
              <div className="glow-box" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "22px 24px" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" }}>
                  How I work
                </p>
                {["Understand the problem", "Design it", "Build and test it", "Ship and improve"].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-3" style={{ marginBottom: i < 3 ? 14 : 0 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.brass, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: COLORS.text }}>{stage}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ background: `${COLORS.bgAlt}8C`, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <Reveal>
              <Eyebrow label="Skills" />
              <SectionHeading>What I work with.</SectionHeading>
            </Reveal>
            <ProximityGlowGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {SKILL_GROUPS.map((group, i) => (
                <TiltCard key={group.title} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "20px 20px", height: "100%" }}>
                  <Reveal delay={i * 150} from={i % 2 === 0 ? "left" : "right"}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: group.color, marginBottom: 12 }}>{group.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} style={{ fontSize: 12, color: COLORS.textSecondary, background: COLORS.surfaceRaised, border: `1px solid ${COLORS.border}`, padding: "5px 10px", borderRadius: 5 }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </TiltCard>
              ))}
            </ProximityGlowGrid>
          </div>
        </section>

        {/* PROJECTS — timeline path */}
        <section id="projects" style={{ background: `${COLORS.bgAlt}8C`, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <Reveal>
              <Eyebrow label="Projects" />
              <SectionHeading>Things I've built.</SectionHeading>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>Open Highlights on a card for the details.</p>
            </Reveal>

            <ProximityGlowGrid className="grid md:grid-cols-2 gap-5 mt-10">
              {PROJECTS.map((p) => (
                <TiltCard key={p.title} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${p.accent}`, borderRadius: 12, padding: "26px 26px", height: "100%" }}>
                  <Reveal>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, color: COLORS.text, marginBottom: 10 }}>{p.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: 16 }}>{p.desc}</p>
                    <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
                      {p.stack.map((t) => (
                        <Tag key={t} color={p.accent}>{t}</Tag>
                      ))}
                    </div>
                    <details>
                      <summary style={{ cursor: "pointer", fontSize: 13, color: p.accent }}>Highlights</summary>
                      <ul style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                        {p.points.map((pt) => (
                          <li key={pt} style={{ display: "flex", gap: 8, fontSize: 13.5, lineHeight: 1.6, color: COLORS.textMuted }}>
                            <span style={{ color: p.accent }}>·</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </details>
                    {(p.repo || p.demo) && (
                      <div className="flex gap-5 mt-5" style={{ fontSize: 13 }}>
                        {p.repo && <a className="link-accent" href={p.repo} target="_blank" rel="noreferrer" style={{ color: p.accent }}>Code on GitHub</a>}
                        {p.demo && <a className="link-accent" href={p.demo} target="_blank" rel="noreferrer" style={{ color: p.accent }}>Live demo</a>}
                      </div>
                    )}
                  </Reveal>
                </TiltCard>
              ))}
            </ProximityGlowGrid>
          </div>
        </section>

        {/* EDUCATION + ACHIEVEMENTS */}
        <section id="achievements" className="max-w-6xl mx-auto px-6 py-20">
          <Reveal>
            <Eyebrow label="Education & achievements" />
            <SectionHeading>Foundations and proof of work.</SectionHeading>
          </Reveal>

          <Reveal delay={80}>
            <div className="glow-box" style={{ marginTop: 28, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "22px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 19, color: COLORS.text }}>B.Tech in Computer Science and Engineering</h3>
                <p style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>NRI Institute of Research and Technology, Bhopal</p>
              </div>
              <div className="flex gap-2">
                <Tag color={COLORS.forest}>CGPA 7.5 / 10</Tag>
                <Tag color={COLORS.brass}>Expected 2028</Tag>
              </div>
            </div>
          </Reveal>

          <ProximityGlowGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {ACHIEVEMENTS.map((a, i) => (
              <TiltCard key={a.label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "22px 18px", height: "100%" }}>
                <Reveal delay={i * 150} from={i % 2 === 0 ? "left" : "right"}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 30, color: COLORS.brass, marginBottom: 8 }}>{a.number}</p>
                  <p style={{ fontSize: 14, color: COLORS.text, marginBottom: 4 }}>{a.label}</p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>{a.sub}</p>
                </Reveal>
              </TiltCard>
            ))}
          </ProximityGlowGrid>
        </section>

        {/* ASK ME */}
        <section id="ask" style={{ background: `${COLORS.bgAlt}8C`, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <Reveal>
              <Eyebrow label="Ask me anything" />
              <SectionHeading>Curious about me? Ask.</SectionHeading>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4, maxWidth: 520 }}>
                A little FAQ bot trained on my own resume — ask about my skills, projects, experience, or how to reach me.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ marginTop: 32 }}>
                <AskMeBot />
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: `${COLORS.bgAlt}8C`, borderTop: `1px solid ${COLORS.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <Reveal>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.brass, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
                Contact
              </p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(28px, 5vw, 44px)", color: COLORS.text, maxWidth: 560, margin: "0 auto", lineHeight: 1.2 }}>
                Let's build something together.
              </h2>
              <p style={{ fontSize: 15, color: COLORS.textSecondary, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
                I'm a software engineer in the making who enjoys solving real problems. Reach out if you'd like to work together.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                <a className="btn-fill" href={`mailto:${PROFILE.email}`} style={{ padding: "13px 26px", borderRadius: 6, background: COLORS.brass, color: COLORS.bg, fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
                  {PROFILE.email}
                </a>
                <a className="btn-outline" href={PROFILE.linkedin} target="_blank" rel="noreferrer" style={{ padding: "13px 26px", borderRadius: 6, border: `1px solid ${COLORS.borderStrong}`, color: COLORS.text, fontSize: 14, textDecoration: "none" }}>
                  LinkedIn
                </a>
                <a className="btn-outline" href={PROFILE.github} target="_blank" rel="noreferrer" style={{ padding: "13px 26px", borderRadius: 6, border: `1px solid ${COLORS.borderStrong}`, color: COLORS.text, fontSize: 14, textDecoration: "none" }}>
                  GitHub
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${COLORS.border}`, background: `${COLORS.bg}D9` }}>
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap justify-between items-center gap-4">
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>© 2026 Kajal Patel. Built with React.</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted }}>{PROFILE.location}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
