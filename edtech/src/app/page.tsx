import { Sora } from "next/font/google";
import Link from "next/link";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function LandingPage() {
  return (
    <div className={sora.className}>
      {/* SECTION 1 - NAVBAR */}
      <nav style={{ background: "#F5A623", height: "72px", padding: "0 56px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: "1.5px solid rgba(0,0,0,0.07)" }}>
        <ul style={{ display: "flex", gap: "32px", listStyle: "none", margin: 0, padding: 0 }}>
          <li><Link href="#how-it-works" style={{ fontSize: "14px", fontWeight: 500, color: "#17140D", opacity: 0.72 }} className="hover:opacity-100 transition-opacity">How It Works</Link></li>
          <li><Link href="#subjects" style={{ fontSize: "14px", fontWeight: 500, color: "#17140D", opacity: 0.72 }} className="hover:opacity-100 transition-opacity">Subjects</Link></li>
          <li><Link href="#pricing" style={{ fontSize: "14px", fontWeight: 500, color: "#17140D", opacity: 0.72 }} className="hover:opacity-100 transition-opacity">Pricing</Link></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div style={{ width: "36px", height: "36px", border: "2.5px solid #17140D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h12M2 8h8M2 12h12" stroke="#17140D" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div>
            <span style={{ fontSize: "16px", fontWeight: 900, letterSpacing: ".09em", color: "#17140D", textTransform: "uppercase", display: "block" }}>BookandLab</span>
            <span style={{ fontSize: "8px", letterSpacing: ".32em", color: "#17140D", opacity: 0.38, display: "block", marginTop: "3px" }}>· · · · · · ·</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href="/login">
            <button style={{ background: "#17140D", color: "white", borderRadius: "99px", padding: "10px 28px", fontSize: "14px", fontWeight: 700 }} className="hover:bg-[#2A261A] hover:-translate-y-[1px] transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* SECTION 2 - HERO */}
      <section id="hero" style={{ background: "#F5A623", padding: "62px 56px 0", position: "relative", overflow: "hidden" }}>
        <div className="doodle" style={{ fontSize: "18px", top: "78px", left: "50px", transform: "rotate(-22deg)" }}>╲<br/>╱</div>
        <div className="doodle" style={{ fontSize: "15px", top: "68px", right: "56px", transform: "rotate(20deg)" }}>╲╱</div>
        <div className="doodle" style={{ fontSize: "26px", bottom: "260px", left: "28px", opacity: 0.18, fontFamily: "serif", fontStyle: "italic" }}>∫∫</div>
        <div className="doodle" style={{ fontSize: "22px", bottom: "120px", right: "38px", opacity: 0.16, fontFamily: "serif", fontStyle: "italic" }}>ʃ</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: "40px", alignItems: "flex-start", marginBottom: "48px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(52px, 6.8vw, 80px)", fontWeight: 900, lineHeight: 1.03, letterSpacing: "-3.5px", color: "#17140D", margin: 0 }}>
              Improve your<br/>
              <span className="oval-dark">Skills</span> Faster
            </h1>
          </div>
          <div>
            <p style={{ fontSize: "15.5px", color: "#17140D", opacity: 0.65, lineHeight: 1.76, maxWidth: "340px", marginBottom: "30px", paddingTop: "18px" }}>
              BookandLab gives every Class 6–12 student structured 6-step chapter learning, a personal mentor who reviews every project, and a dashboard that makes skill growth visible every week.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/login">
                <button style={{ background: "transparent", border: "2.5px solid #17140D", color: "#17140D", borderRadius: "99px", padding: "13px 32px", fontSize: "14.5px", fontWeight: 700 }} className="hover:bg-[#17140D] hover:text-white transition-colors">
                  Enroll Now ↗
                </button>
              </Link>
              <Link href="#how-it-works">
                <button style={{ background: "transparent", border: "none", color: "#17140D", opacity: 0.6, fontSize: "14px", fontWeight: 500 }} className="hover:opacity-100 transition-opacity">
                  See how it works →
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", background: "white", borderRadius: "16px", padding: "12px 18px", boxShadow: "0 10px 40px rgba(0,0,0,.13)", top: "88px", right: "6px", animation: "bob 3.2s ease-in-out infinite" }}>
          <div style={{ fontSize: "10px", color: "#7A7060", fontWeight: 500, marginBottom: "3px" }}>🔥 Daily streak</div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#17140D" }}>14 days</div>
          <div style={{ fontSize: "10.5px", color: "#7A7060", marginTop: "1px" }}>Personal best!</div>
        </div>

        <div style={{ position: "absolute", background: "white", borderRadius: "16px", padding: "12px 18px", boxShadow: "0 10px 40px rgba(0,0,0,.13)", bottom: "268px", left: "6px", animation: "bob 3.8s ease-in-out infinite 0.6s" }}>
          <div style={{ fontSize: "10px", color: "#7A7060", fontWeight: 500, marginBottom: "3px" }}>📈 Skill growth</div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: "#17140D" }}>+0.8 this week</div>
          <div style={{ fontSize: "10.5px", color: "#7A7060", marginTop: "1px" }}>Concept Clarity ↑</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 720 305" width="720" style={{ maxWidth: "100%" }} xmlns="http://www.w3.org/2000/svg">
            {/* Desk */}
            <rect x="148" y="234" width="424" height="13" rx="5" fill="#5C3D1E" opacity=".82"/>
            <rect x="192" y="247" width="14" height="46" rx="4" fill="#5C3D1E" opacity=".5"/>
            <rect x="514" y="247" width="14" height="46" rx="4" fill="#5C3D1E" opacity=".5"/>
            {/* Books */}
            <rect x="153" y="216" width="17" height="19" rx="3" fill="#E74C3C"/>
            <rect x="171" y="218" width="14" height="17" rx="2" fill="#3498DB"/>
            <rect x="186" y="220" width="15" height="15" rx="2" fill="#27AE60"/>
            {/* Monitor */}
            <rect x="282" y="113" width="196" height="123" rx="10" fill="#2C3E50"/>
            <rect x="292" y="123" width="176" height="105" rx="6" fill="#ECF0F1"/>
            <rect x="296" y="127" width="82" height="48" rx="4" fill="#AED6F1"/>
            <rect x="384" y="127" width="78" height="48" rx="4" fill="#A9DFBF"/>
            <rect x="296" y="180" width="82" height="44" rx="4" fill="#F9E79F"/>
            <rect x="384" y="180" width="78" height="44" rx="4" fill="#FADBD8"/>
            {/* People in cells */}
            <circle cx="337" cy="145" r="10" fill="#E59866"/>
            <ellipse cx="337" cy="161" rx="13" ry="8" fill="#8E44AD" opacity=".7"/>
            <circle cx="423" cy="143" r="9" fill="#85929E"/>
            <ellipse cx="423" cy="158" rx="12" ry="7" fill="#2980B9" opacity=".65"/>
            <circle cx="337" cy="196" r="9" fill="#F0B27A"/>
            <ellipse cx="337" cy="210" rx="12" ry="7" fill="#E74C3C" opacity=".6"/>
            <circle cx="423" cy="198" r="10" fill="#7FB3D3"/>
            <ellipse cx="423" cy="213" rx="13" ry="8" fill="#27AE60" opacity=".6"/>
            {/* Monitor stand */}
            <rect x="368" y="236" width="24" height="10" rx="3" fill="#2C3E50"/>
            <rect x="358" y="244" width="44" height="6" rx="3" fill="#2C3E50"/>
            {/* Lamp */}
            <rect x="492" y="134" width="7" height="84" rx="3" fill="#7F8C8D"/>
            <polygon points="470,134 522,134 506,98 486,98" fill="#F39C12"/>
            {/* Student */}
            <circle cx="248" cy="156" r="28" fill="#F0B27A"/>
            <ellipse cx="248" cy="144" rx="28" ry="16" fill="#6E2F00"/>
            <ellipse cx="248" cy="202" rx="34" ry="50" fill="#3498DB"/>
            <rect x="226" y="242" width="44" height="7" rx="3" fill="#ECF0F1"/>
            <path d="M227 196 Q190 178 172 168" stroke="#3498DB" strokeWidth="18" strokeLinecap="round" fill="none"/>
            <path d="M269 196 Q305 179 322 167" stroke="#3498DB" strokeWidth="18" strokeLinecap="round" fill="none"/>
            <rect x="150" y="156" width="40" height="30" rx="5" fill="white" transform="rotate(-13 150 156)"/>
            <line x1="155" y1="163" x2="185" y2="158" stroke="#CCC" strokeWidth="1.8"/>
            <line x1="155" y1="171" x2="185" y2="166" stroke="#CCC" strokeWidth="1.8"/>
            <circle cx="326" cy="163" r="10" fill="#F0B27A"/>
            {/* Plant */}
            <rect x="572" y="206" width="20" height="34" rx="4" fill="#8B4513"/>
            <ellipse cx="582" cy="206" rx="28" ry="21" fill="#27AE60"/>
            <ellipse cx="571" cy="195" rx="20" ry="16" fill="#2ECC71"/>
            <ellipse cx="596" cy="200" rx="18" ry="13" fill="#27AE60"/>
            {/* Desk items */}
            <rect x="514" y="222" width="24" height="16" rx="4" fill="#ECF0F1"/>
            <ellipse cx="526" cy="222" rx="12" ry="4" fill="#BDC3C7"/>
            <rect x="544" y="216" width="22" height="22" rx="4" fill="#ECF0F1"/>
            <line x1="548" y1="216" x2="546" y2="200" stroke="#E74C3C" strokeWidth="3" strokeLinecap="round"/>
            <line x1="554" y1="216" x2="555" y2="197" stroke="#F39C12" strokeWidth="3" strokeLinecap="round"/>
            <line x1="560" y1="216" x2="562" y2="201" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <style>{`
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </section>

      {/* SECTION 3 - STATS BAR */}
      <section style={{ background: "white", padding: "34px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E0D8C8" }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#17140D", marginBottom: "4px" }}>Class 6–12</div>
          <div style={{ fontSize: "12px", color: "#7A7060", lineHeight: 1.45 }}>All grades covered</div>
        </div>
        <div style={{ width: "1px", height: "48px", background: "#E0D8C8", flexShrink: 0 }}></div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#17140D", marginBottom: "4px" }}>6 Steps</div>
          <div style={{ fontSize: "12px", color: "#7A7060", lineHeight: 1.45 }}>Per chapter, every time</div>
        </div>
        <div style={{ width: "1px", height: "48px", background: "#E0D8C8", flexShrink: 0 }}></div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#17140D", marginBottom: "4px" }}>4 Skills</div>
          <div style={{ fontSize: "12px", color: "#7A7060", lineHeight: 1.45 }}>Mentor-scored rubric</div>
        </div>
        <div style={{ width: "1px", height: "48px", background: "#E0D8C8", flexShrink: 0 }}></div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#17140D", marginBottom: "4px" }}>Real Mentors</div>
          <div style={{ fontSize: "12px", color: "#7A7060", lineHeight: 1.45 }}>No AI grading, ever</div>
        </div>
      </section>
      {/* SECTION 4 - WE PROVIDE */}
      <section id="how-it-works" style={{ background: "#FDF8EF", padding: "84px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "70px", alignItems: "center" }}>
        <div style={{ background: "#FAF4E8", border: "1px solid #E0D8C8", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", minHeight: "290px" }}>
          <svg viewBox="0 0 320 255" width="320" xmlns="http://www.w3.org/2000/svg">
            <rect x="38" y="185" width="244" height="10" rx="4" fill="#5C3D1E" opacity=".75"/>
            <rect x="88" y="90" width="158" height="98" rx="8" fill="#2C3E50"/>
            <rect x="97" y="99" width="140" height="81" rx="5" fill="#D5E8F7"/>
            <rect x="101" y="103" width="62" height="36" rx="3" fill="#AED6F1"/>
            <rect x="167" y="103" width="64" height="36" rx="3" fill="#A9DFBF"/>
            <rect x="101" y="143" width="62" height="33" rx="3" fill="#F9E79F"/>
            <rect x="167" y="143" width="64" height="33" rx="3" fill="#FADBD8"/>
            <circle cx="132" cy="119" r="9" fill="#E59866"/>
            <ellipse cx="132" cy="131" rx="11" ry="6" fill="#8E44AD" opacity=".6"/>
            <circle cx="199" cy="117" r="8" fill="#85929E"/>
            <ellipse cx="199" cy="128" rx="10" ry="6" fill="#2980B9" opacity=".6"/>
            <circle cx="132" cy="158" r="8" fill="#F0B27A"/>
            <ellipse cx="132" cy="169" rx="10" ry="6" fill="#E74C3C" opacity=".6"/>
            <circle cx="199" cy="159" r="9" fill="#7FB3D3"/>
            <ellipse cx="199" cy="171" rx="11" ry="7" fill="#27AE60" opacity=".6"/>
            <rect x="156" y="188" width="22" height="9" rx="3" fill="#2C3E50"/>
            <rect x="148" y="195" width="38" height="6" rx="3" fill="#2C3E50"/>
            <rect x="238" y="112" width="6" height="74" rx="2" fill="#95A5A6"/>
            <polygon points="225,112 258,112 244,80 238,80" fill="#F39C12"/>
            <circle cx="72" cy="140" r="22" fill="#F0B27A"/>
            <ellipse cx="72" cy="129" rx="22" ry="13" fill="#6E2F00"/>
            <ellipse cx="72" cy="170" rx="26" ry="36" fill="#E67E22"/>
            <ellipse cx="64" cy="143" rx="8" ry="6" fill="none" stroke="#2C3E50" strokeWidth="1.5"/>
            <ellipse cx="79" cy="143" rx="8" ry="6" fill="none" stroke="#2C3E50" strokeWidth="1.5"/>
            <rect x="282" y="155" width="14" height="32" rx="3" fill="#8B4513"/>
            <ellipse cx="289" cy="155" rx="18" ry="14" fill="#27AE60"/>
            <ellipse cx="302" cy="163" rx="12" ry="10" fill="#2ECC71"/>
          </svg>
        </div>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(245,166,35,.14)", border: "1.5px solid rgba(245,166,35,.4)", borderRadius: "99px", padding: "5px 16px", fontSize: "11.5px", fontWeight: 600, color: "#B8780A", letterSpacing: ".04em", marginBottom: "18px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F5A623" }}></div>
            Our platform
          </div>
          <h2 style={{ fontSize: "clamp(30px,3.8vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: "22px", color: "#17140D" }}>
            We Provide<br/>
            <span className="oval-outline">Structured</span><br/>
            Deep Learning
          </h2>
          <p style={{ fontSize: "15px", color: "#7A7060", lineHeight: 1.8, maxWidth: "400px" }}>
            Every BookandLab chapter comes with an assigned mentor who personally reviews your project using a transparent 4-skill rubric — Concept Clarity, Critical Thinking, Application, and Communication — scored 1 to 5, every time.
          </p>
        </div>
      </section>

      {/* SECTION 5 - 6-STEP METHOD */}
      <section style={{ background: "#FAF4E8", borderTop: "1px solid #E0D8C8", borderBottom: "1px solid #E0D8C8", padding: "84px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(245,166,35,.14)", border: "1.5px solid rgba(245,166,35,.4)", borderRadius: "99px", padding: "5px 16px", fontSize: "11.5px", fontWeight: 600, color: "#B8780A", letterSpacing: ".04em", marginBottom: "18px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F5A623" }}></div>
            Our method
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "12px", color: "#17140D" }}>
            Every chapter. <span className="oval-outline">6 Steps.</span>
          </h2>
          <p style={{ maxWidth: "460px", margin: "0 auto", fontSize: "15px", color: "#7A7060", lineHeight: 1.75 }}>
            Our structured framework takes every student from a real-world hook to a mentor-reviewed project — in every chapter, across every subject.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
          {[
            { step: 1, title: "Context — Why it matters", text: "A real-life scenario connects the concept to the student world before any theory begins.", bg: "#17140D", color: "white" },
            { step: 2, title: "Concept — Clear explanation", text: "Plain-language theory with diagrams, key terms, and a short quiz that locks in memory.", bg: "#17140D", color: "white" },
            { step: 3, title: "Thinking — Open prompts", text: "3–5 guided questions push students beyond recall into real analysis and reasoning.", bg: "#17140D", color: "white" },
            { step: 4, title: "Deep Learning — Mastery", text: "Worked examples, common misconceptions, and inline tasks that confirm true understanding.", bg: "#F5A623", color: "#17140D" },
            { step: 5, title: "Project — Apply it", text: "A short real-world submission reviewed by your assigned mentor using a transparent rubric.", bg: "#16A34A", color: "white" },
            { step: 6, title: "Reflection — Lock it in", text: "Guided prompts help students articulate what they learned and plan what to practice next.", bg: "#C93A2A", color: "white" }
          ].map((s) => (
            <div key={s.step} className="step-card" style={{ background: "white", border: "1px solid #E0D8C8", borderRadius: "20px", padding: "28px 26px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 900, marginBottom: "16px", background: s.bg, color: s.color }}>
                {s.step}
              </div>
              <h4 style={{ fontSize: "14.5px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-.2px" }}>{s.title}</h4>
              <p style={{ fontSize: "13px", color: "#7A7060", lineHeight: 1.66 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 - FEATURES */}
      <section style={{ background: "#FDF8EF", padding: "84px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
          <div style={{ background: "#17140D", borderRadius: "22px", padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "230px" }}>
            <div>
              <div style={{ fontSize: "20px", opacity: 0.35, color: "white", marginBottom: "14px" }}>╲|</div>
              <h3 style={{ fontSize: "28px", fontWeight: 900, color: "white", lineHeight: 1.18, letterSpacing: "-.8px", margin: 0 }}>
                Our <em style={{ color: "#F5A623", fontStyle: "normal" }}>Features</em><br/>Special For you
              </h3>
            </div>
            <button style={{ background: "#F5A623", color: "#17140D", borderRadius: "99px", padding: "12px 24px", fontSize: "13.5px", fontWeight: 700, width: "fit-content", marginTop: "24px", display: "inline-flex", alignItems: "center", gap: "7px", border: "none" }} className="hover:opacity-90 transition-opacity">
              See All Features ↗
            </button>
          </div>

          <div className="feat-card" style={{ background: "white", border: "1px solid #E0D8C8", borderRadius: "22px", padding: "30px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(245,166,35,.13)", border: "1px solid rgba(245,166,35,.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
              📊
            </div>
            <h4 style={{ fontSize: "15.5px", fontWeight: 800, marginBottom: "9px" }}>Skill Growth Dashboard</h4>
            <p style={{ fontSize: "13.5px", color: "#7A7060", lineHeight: 1.7 }}>
              Every mentor review updates your 4 skill scores in real time. Trend arrows show growth direction so you always know where to focus next.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
          {[
            { emoji: "🔥", title: "Daily Streak Tracker", text: "Build a daily habit. Your streak grows every day you complete at least one step. Longest streak always visible." },
            { emoji: "🎯", title: "Weekly Goal System", text: "Set your own weekly chapter target. A live progress ring tracks your goal — resets every Monday." },
            { emoji: "👨‍🏫", title: "Personal Mentor Review", text: "Every project goes to your assigned subject-expert mentor. They score on all 4 skills and leave written feedback." }
          ].map((feat, i) => (
            <div key={i} className="feat-card" style={{ background: "white", border: "1px solid #E0D8C8", borderRadius: "22px", padding: "30px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(245,166,35,.13)", border: "1px solid rgba(245,166,35,.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
                {feat.emoji}
              </div>
              <h4 style={{ fontSize: "15.5px", fontWeight: 800, marginBottom: "9px" }}>{feat.title}</h4>
              <p style={{ fontSize: "13.5px", color: "#7A7060", lineHeight: 1.7 }}>{feat.text}</p>
            </div>
          ))}
        </div>
      </section>
      {/* SECTION 7 - PRICING PLANS */}
      <section id="pricing" style={{ background: "#17140D", padding: "84px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: "54px" }}>
          <h2 style={{ fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 900, color: "white", letterSpacing: "-2px", marginBottom: "12px" }}>
            Popular <span style={{ display: "inline-block", border: "2.5px solid #F5A623", borderRadius: "9999px", padding: "0 18px 3px", fontStyle: "italic", fontFamily: "'Lora',serif", fontWeight: 600, color: "white" }}>Plans</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#88806A", maxWidth: "420px", margin: "0 auto", lineHeight: 1.72 }}>
            Start with the basics and upgrade when you are ready. Every plan includes the full 6-step method.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {/* PLAN 1 - STARTER */}
          <div className="plan-card" style={{ background: "white", borderRadius: "22px", overflow: "hidden" }}>
            <div style={{ height: "172px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FFF3E0,#FFE0B2)" }}>
              <svg viewBox="0 0 180 145" width="180" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="62" r="42" fill="none" stroke="#F5A623" strokeWidth="2" strokeDasharray="7 4" opacity=".6"/>
                <circle cx="90" cy="50" r="18" fill="#F0B27A"/>
                <ellipse cx="90" cy="70" rx="23" ry="13" fill="#27AE60" opacity=".7"/>
                <rect x="64" y="84" width="52" height="40" rx="6" fill="#FFFDE7" stroke="#EEE" strokeWidth="1.2"/>
                <line x1="72" y1="95" x2="108" y2="95" stroke="#DDD" strokeWidth="1.5"/>
                <line x1="72" y1="104" x2="108" y2="104" stroke="#DDD" strokeWidth="1.5"/>
                <line x1="72" y1="113" x2="96" y2="113" stroke="#DDD" strokeWidth="1.5"/>
              </svg>
            </div>
            <div style={{ padding: "22px 24px 28px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#7A7060", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: "8px" }}>STARTER</div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 700, marginTop: "8px" }}>₹</span>
                <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px" }}>299</span>
              </div>
              <div style={{ fontSize: "13px", color: "#7A7060", marginBottom: "18px" }}>/month</div>
              <div style={{ borderBottom: "1px solid #E0D8C8", marginBottom: "18px" }}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "24px" }}>
                {[
                  { text: "All published chapters", active: true },
                  { text: "Full 6-step learning flow", active: true },
                  { text: "Progress & streak tracking", active: true },
                  { text: "Weekly goal tracker", active: true },
                  { text: "Mentor review", active: false },
                  { text: "Skill growth scoring", active: false }
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: f.active ? "#17140D" : "#B0A898" }}>
                    {f.active ? (
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F5A623", color: "#17140D", fontWeight: 800, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                    ) : (
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#E0D8C8", color: "#B0A898", display: "flex", alignItems: "center", justifyContent: "center" }}>–</div>
                    )}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", fontSize: "13px", padding: "13px", borderRadius: "99px", border: "2.5px solid #17140D", background: "transparent", color: "#17140D", fontWeight: 700 }} className="hover:bg-[#F5A623] hover:border-[#F5A623] transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* PLAN 2 - STANDARD (MOST POPULAR) */}
          <div className="plan-card" style={{ background: "white", borderRadius: "22px", overflow: "hidden", position: "relative", border: "2.5px solid #F5A623" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", background: "#F5A623", color: "#17140D", borderRadius: "0 0 12px 12px", padding: "4px 22px", fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>
              MOST POPULAR
            </div>
            <div style={{ marginTop: "10px", height: "172px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#E8F5E9,#C8E6C9)" }}>
              <svg viewBox="0 0 180 145" width="180" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="90" cy="70" rx="52" ry="50" fill="none" stroke="#27AE60" strokeWidth="1.8" strokeDasharray="6 4" opacity=".5"/>
                <circle cx="90" cy="52" r="19" fill="#F0B27A"/>
                <ellipse cx="90" cy="73" rx="25" ry="14" fill="#3498DB" opacity=".65"/>
                <rect x="62" y="87" width="56" height="44" rx="7" fill="#F5A623" opacity=".88"/>
                <rect x="69" y="94" width="42" height="30" rx="4" fill="#FDEBD0"/>
                <line x1="75" y1="103" x2="105" y2="103" stroke="#E59866" strokeWidth="1.8"/>
                <line x1="75" y1="112" x2="105" y2="112" stroke="#E59866" strokeWidth="1.8"/>
                <text x="90" y="136" fontFamily="Sora,sans-serif" fontSize="8.5" fill="#27AE60" textAnchor="middle" fontWeight="800">MENTOR REVIEWED ✓</text>
              </svg>
            </div>
            <div style={{ padding: "22px 24px 28px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#7A7060", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: "8px" }}>STANDARD</div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 700, marginTop: "8px" }}>₹</span>
                <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px" }}>599</span>
              </div>
              <div style={{ fontSize: "13px", color: "#7A7060", marginBottom: "18px" }}>
                /month · <span style={{ color: "#16A34A", fontWeight: 700 }}>Save 20% yearly</span>
              </div>
              <div style={{ borderBottom: "1px solid #E0D8C8", marginBottom: "18px" }}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "24px" }}>
                {[
                  "Everything in Starter",
                  "Assigned personal mentor",
                  "All 5 projects reviewed",
                  "4-skill rubric scoring (1–5)",
                  "Written mentor feedback",
                  "Detailed progress page"
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#17140D" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F5A623", color: "#17140D", fontWeight: 800, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login">
                <button style={{ width: "100%", fontSize: "13px", padding: "13px", borderRadius: "99px", background: "#F5A623", color: "#17140D", fontWeight: 700, border: "2.5px solid #F5A623" }} className="hover:opacity-90 transition-opacity">
                  Enroll Now
                </button>
              </Link>
            </div>
          </div>

          {/* PLAN 3 - PREMIUM */}
          <div className="plan-card" style={{ background: "white", borderRadius: "22px", overflow: "hidden" }}>
            <div style={{ height: "172px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#FCE4EC,#F8BBD0)" }}>
              <svg viewBox="0 0 180 145" width="180" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="66" r="46" fill="none" stroke="#E74C3C" strokeWidth="1.5" opacity=".4"/>
                <circle cx="90" cy="50" r="18" fill="#F5CBA7"/>
                <ellipse cx="90" cy="70" rx="23" ry="12" fill="#E74C3C" opacity=".5"/>
                <rect x="60" y="82" width="60" height="48" rx="7" fill="#FFFDE7" stroke="#EEE" strokeWidth="1"/>
                <circle cx="72" cy="94" r="6" fill="#F5A623" opacity=".65"/>
                <circle cx="72" cy="114" r="6" fill="#27AE60" opacity=".55"/>
                <line x1="83" y1="94" x2="112" y2="94" stroke="#DDD" strokeWidth="1.8"/>
                <line x1="83" y1="114" x2="112" y2="114" stroke="#DDD" strokeWidth="1.8"/>
                <text x="90" y="136" fontFamily="Sora,sans-serif" fontSize="8.5" fill="#E74C3C" textAnchor="middle" fontWeight="800">PRIORITY MENTOR ★</text>
              </svg>
            </div>
            <div style={{ padding: "22px 24px 28px" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#7A7060", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: "8px" }}>PREMIUM</div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 700, marginTop: "8px" }}>₹</span>
                <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px" }}>999</span>
              </div>
              <div style={{ fontSize: "13px", color: "#7A7060", marginBottom: "18px" }}>/month</div>
              <div style={{ borderBottom: "1px solid #E0D8C8", marginBottom: "18px" }}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "24px" }}>
                {[
                  "Everything in Standard",
                  "Priority mentor assignment",
                  "Faster review turnaround",
                  "Resubmission on any project",
                  "All classes & all subjects",
                  "Admin subscription control"
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#17140D" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F5A623", color: "#17140D", fontWeight: 800, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", fontSize: "13px", padding: "13px", borderRadius: "99px", border: "2.5px solid #17140D", background: "transparent", color: "#17140D", fontWeight: 700 }} className="hover:bg-[#F5A623] hover:border-[#F5A623] transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - EASY START */}
      <section style={{ background: "white", padding: "84px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(245,166,35,.14)", border: "1.5px solid rgba(245,166,35,.4)", borderRadius: "99px", padding: "5px 16px", fontSize: "11.5px", fontWeight: 600, color: "#B8780A", letterSpacing: ".04em", marginBottom: "18px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F5A623" }}></div>
            Get started
          </div>
          <h2 style={{ fontSize: "clamp(30px,3.8vw,46px)", fontWeight: 900, letterSpacing: "-1.8px", lineHeight: 1.12, marginBottom: "20px" }}>
            Its easy to start<br/>
            <span className="oval-outline">Learning</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#7A7060", lineHeight: 1.78, maxWidth: "360px", marginBottom: "30px" }}>
            Sign up, pick your class and subject, and your first chapter is ready in under 60 seconds. No complicated onboarding — just structured learning from the first click.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Create your student account",
              "Choose your class and subject",
              "Start Chapter 1 — Step 1 immediately"
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "15.5px", fontWeight: 600 }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>
                  ✓
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 290 265" width="290" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="145" cy="194" rx="88" ry="57" fill="#F0B27A" opacity=".86"/>
            <rect x="100" y="130" width="90" height="76" rx="48" fill="#F0B27A"/>
            <rect x="114" y="58" width="62" height="106" rx="12" fill="#2C3E50"/>
            <rect x="121" y="67" width="48" height="88" rx="7" fill="#D5E8F7"/>
            <rect x="125" y="72" width="40" height="9" rx="3" fill="#F5A623" opacity=".85"/>
            <rect x="125" y="85" width="34" height="5" rx="2" fill="#BDC3C7"/>
            <rect x="125" y="94" width="34" height="5" rx="2" fill="#BDC3C7"/>
            <rect x="125" y="106" width="40" height="16" rx="8" fill="#F5A623"/>
            <text x="145" y="118" fontFamily="Sora,sans-serif" fontSize="6.5" fill="white" textAnchor="middle" fontWeight="700">Start Step 1</text>
            <rect x="100" y="212" width="90" height="13" rx="5" fill="#E74C3C" opacity=".78"/>
            <rect x="108" y="223" width="78" height="12" rx="4" fill="#3498DB" opacity=".68"/>
            <rect x="18" y="82" width="72" height="22" rx="8" fill="#F5A623" opacity=".82"/>
            <text x="54" y="97" fontFamily="Sora,sans-serif" fontSize="8.5" fill="#17140D" textAnchor="middle" fontWeight="700">Step 1 of 6</text>
            <rect x="200" y="74" width="78" height="22" rx="8" fill="#27AE60" opacity=".82"/>
            <text x="239" y="89" fontFamily="Sora,sans-serif" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">Streak: 7 days</text>
            <path d="M32 198 Q12 166 48 150" fill="#27AE60" opacity=".42"/>
            <path d="M258 194 Q278 162 242 148" fill="#27AE60" opacity=".38"/>
          </svg>
        </div>
      </section>

      {/* SECTION 9 - CTA BANNER */}
      <div style={{ padding: "0 52px 84px", background: "white" }}>
        <div style={{ background: "#F5A623", borderRadius: "28px", padding: "58px 52px", display: "grid", gridTemplateColumns: "260px 1fr", gap: "44px", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", opacity: 0.22, fontSize: "20px", top: "22px", right: "78px", transform: "rotate(22deg)" }}>╲|</div>
          <div style={{ position: "absolute", opacity: 0.22, fontSize: "28px", bottom: "22px", right: "38px", transform: "rotate(-12deg)", fontFamily: "serif", fontStyle: "italic" }}>ʃ</div>

          <svg viewBox="0 0 240 196" width="240" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="42" width="158" height="112" rx="9" fill="#2C3E50" opacity=".92"/>
            <rect x="34" y="50" width="142" height="96" rx="5" fill="#34495E"/>
            <text x="42" y="72" fontFamily="Sora,sans-serif" fontSize="8.5" fill="#F5A623" fontWeight="800">BookandLab Method</text>
            <text x="42" y="89" fontFamily="Sora,sans-serif" fontSize="7.5" fill="rgba(255,255,255,.65)">① Context  ② Concept</text>
            <text x="42" y="103" fontFamily="Sora,sans-serif" fontSize="7.5" fill="rgba(255,255,255,.65)">③ Thinking  ④ Deep Dive</text>
            <text x="42" y="117" fontFamily="Sora,sans-serif" fontSize="7.5" fill="rgba(255,255,255,.65)">⑤ Project  ⑥ Reflection</text>
            <rect x="42" y="126" width="58" height="12" rx="6" fill="#F5A623"/>
            <text x="71" y="136" fontFamily="Sora,sans-serif" fontSize="7" fill="#17140D" textAnchor="middle" fontWeight="800">Mentor Reviewed ✓</text>
            <circle cx="194" cy="97" r="22" fill="#F0B27A"/>
            <ellipse cx="194" cy="86" rx="22" ry="13" fill="#6E2F00"/>
            <ellipse cx="194" cy="132" rx="26" ry="38" fill="#3498DB"/>
            <line x1="183" y1="122" x2="166" y2="138" stroke="#3498DB" strokeWidth="14" strokeLinecap="round"/>
            <rect x="6" y="142" width="14" height="38" rx="4" fill="#8B4513"/>
            <ellipse cx="13" cy="142" rx="18" ry="14" fill="#27AE60"/>
            <ellipse cx="28" cy="150" rx="12" ry="10" fill="#2ECC71"/>
          </svg>

          <div>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 900, letterSpacing: "-1.4px", lineHeight: 1.16, marginBottom: "14px" }}>
              Get <em style={{ fontStyle: "italic", fontFamily: "'Lora',serif" }}>Ready</em> to Start<br/>Your Journey
            </h2>
            <p style={{ fontSize: "14.5px", color: "#17140D", opacity: 0.66, lineHeight: 1.74, marginBottom: "26px", maxWidth: "420px" }}>
              Pick your class, open your first chapter, complete all 6 steps. Your assigned mentor reviews your project and scores your 4 skills.
            </p>
            <div style={{ display: "flex", gap: "22px", marginBottom: "28px", flexWrap: "wrap" }}>
              {["Sign up free", "Pick class & subject", "Submit your first project"].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", fontWeight: 600 }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#17140D", color: "white", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i + 1}
                  </div>
                  {text}
                </div>
              ))}
            </div>
            <Link href="/login">
              <button style={{ background: "#17140D", color: "white", borderRadius: "99px", padding: "14px 32px", fontSize: "14.5px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "9px" }} className="hover:bg-[#2A261A] hover:-translate-y-[1px] transition-all">
                Order Now ↗
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 10 - FOOTER */}
      <footer style={{ background: "#FDF8EF", padding: "0 44px 36px" }}>
        <div style={{ background: "#17140D", borderRadius: "26px", padding: "54px 56px", display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: "44px", marginBottom: "26px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4h12M2 8h8M2 12h12" stroke="#17140D" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 900, color: "white", letterSpacing: ".06em" }}>BOOKANDLAB</span>
            </div>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,.36)", lineHeight: 1.76, maxWidth: "240px", marginBottom: "24px" }}>
              Structured chapter learning with real mentor feedback — so every student grows every single week.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {["𝕏", "in", "ig", "yt"].map((label, i) => (
                <button key={i} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.36)", background: "transparent" }} className="hover:border-[#F5A623] hover:text-[#F5A623] transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "18px", letterSpacing: ".04em" }}>Platform</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["How It Works", "Subjects", "Pricing", "For Mentors", "For Schools"].map(l => (
                <Link key={l} href="#" style={{ fontSize: "13.5px", color: "rgba(255,255,255,.34)" }} className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "18px", letterSpacing: ".04em" }}>Company</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["About Us", "Blog", "Careers", "Press Kit"].map(l => (
                <Link key={l} href="#" style={{ fontSize: "13.5px", color: "rgba(255,255,255,.34)" }} className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "18px", letterSpacing: ".04em" }}>Support</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Use"].map(l => (
                <Link key={l} href="#" style={{ fontSize: "13.5px", color: "rgba(255,255,255,.34)" }} className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7060", padding: "0 12px" }}>
          <div>© BookandLab 2024. All rights reserved.</div>
          <div>Terms & Privacy Policy</div>
        </div>
      </footer>
    </div>
  );
}
