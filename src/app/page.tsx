"use client";

import { Sora } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={sora.className}>
      {/* SECTION 1 - NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-[#F5A623] border-b border-black/[.07]">
        <div className="h-[72px] px-5 md:px-10 lg:px-14 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Left links — hidden on mobile */}
          <ul className="hidden md:flex gap-6 lg:gap-8 list-none m-0 p-0">
            <li><Link href="#how-it-works" className="text-sm font-medium text-[#17140D] opacity-70 hover:opacity-100 transition-opacity">How It Works</Link></li>
            <li><Link href="#subjects" className="text-sm font-medium text-[#17140D] opacity-70 hover:opacity-100 transition-opacity">Subjects</Link></li>
            <li><Link href="#pricing" className="text-sm font-medium text-[#17140D] opacity-70 hover:opacity-100 transition-opacity">Pricing</Link></li>
          </ul>

          {/* Mobile hamburger — visible only on mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5L15 15M15 5L5 15" stroke="#17140D" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5h14M3 10h10M3 15h14" stroke="#17140D" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* Center logo */}
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 border-[2.5px] border-[#17140D] rounded-full flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4h12M2 8h8M2 12h12" stroke="#17140D" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div>
              <span className="text-base font-black tracking-[.09em] text-[#17140D] uppercase block">BookandLab</span>
              <span className="text-[8px] tracking-[.32em] text-[#17140D] opacity-40 block mt-0.5">· · · · · · ·</span>
            </div>
          </div>

          {/* Right CTA */}
          <div className="flex justify-end">
            <Link href="/login">
              <button className="bg-[#17140D] text-white rounded-full px-5 py-2.5 md:px-7 md:py-2.5 text-sm font-bold hover:bg-[#2A261A] hover:-translate-y-px transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-60 border-t border-black/10" : "max-h-0"
          }`}
          style={{ background: "rgba(245,166,35,0.95)", backdropFilter: "blur(10px)" }}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {[
              { label: "How It Works", href: "#how-it-works" },
              { label: "Subjects", href: "#subjects" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-[15px] font-semibold text-[#17140D] hover:bg-black/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* SECTION 2 - HERO */}
      <section id="hero" className="bg-[#F5A623] px-5 md:px-10 lg:px-14 pt-10 md:pt-16 pb-0 relative overflow-hidden">
        <div className="doodle hidden md:block" style={{ fontSize: "18px", top: "78px", left: "50px", transform: "rotate(-22deg)" }}>╲<br/>╱</div>
        <div className="doodle hidden md:block" style={{ fontSize: "15px", top: "68px", right: "56px", transform: "rotate(20deg)" }}>╲╱</div>
        <div className="doodle hidden lg:block" style={{ fontSize: "26px", bottom: "260px", left: "28px", opacity: 0.18, fontFamily: "serif", fontStyle: "italic" }}>∫∫</div>
        <div className="doodle hidden lg:block" style={{ fontSize: "22px", bottom: "120px", right: "38px", opacity: 0.16, fontFamily: "serif", fontStyle: "italic" }}>ʃ</div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_370px] gap-6 lg:gap-10 items-start mb-10 lg:mb-12">
          <div>
            <h1 className="text-[clamp(36px,6.8vw,80px)] font-black leading-[1.03] tracking-[-2px] lg:tracking-[-3.5px] text-[#17140D] m-0">
              Improve your<br/>
              <span className="oval-dark">Skills</span> Faster
            </h1>
          </div>
          <div>
            <p className="text-[15px] text-[#17140D] opacity-65 leading-[1.76] max-w-[340px] mb-6 md:mb-8 pt-2 lg:pt-[18px]">
              BookandLab gives every Class 6–12 student structured 6-step chapter learning, a personal mentor who reviews every project, and a dashboard that makes skill growth visible every week.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/login">
                <button className="bg-transparent border-[2.5px] border-[#17140D] text-[#17140D] rounded-full px-6 md:px-8 py-3 text-sm font-bold hover:bg-[#17140D] hover:text-white transition-colors">
                  Enroll Now ↗
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="bg-transparent border-none text-[#17140D] opacity-60 text-sm font-medium hover:opacity-100 transition-opacity">
                  See how it works →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating cards — hidden on small mobile */}
        <div className="hidden sm:block absolute bg-white rounded-2xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,.13)] top-20 right-1.5 lg:right-2 z-10 animate-[bob_3.2s_ease-in-out_infinite]">
          <div className="text-[10px] text-[#7A7060] font-medium mb-0.5">🔥 Daily streak</div>
          <div className="text-sm font-extrabold text-[#17140D]">14 days</div>
          <div className="text-[10.5px] text-[#7A7060] mt-px">Personal best!</div>
        </div>

        <div className="hidden sm:block absolute bg-white rounded-2xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,.13)] bottom-[268px] left-1.5 lg:left-2 z-10 animate-[bob_3.8s_ease-in-out_infinite_0.6s]">
          <div className="text-[10px] text-[#7A7060] font-medium mb-0.5">📈 Skill growth</div>
          <div className="text-sm font-extrabold text-[#17140D]">+0.8 this week</div>
          <div className="text-[10.5px] text-[#7A7060] mt-px">Concept Clarity ↑</div>
        </div>

        <div className="flex justify-center">
          <svg viewBox="0 0 720 305" className="w-full max-w-[720px]" xmlns="http://www.w3.org/2000/svg">
            <rect x="148" y="234" width="424" height="13" rx="5" fill="#5C3D1E" opacity=".82"/>
            <rect x="192" y="247" width="14" height="46" rx="4" fill="#5C3D1E" opacity=".5"/>
            <rect x="514" y="247" width="14" height="46" rx="4" fill="#5C3D1E" opacity=".5"/>
            <rect x="153" y="216" width="17" height="19" rx="3" fill="#E74C3C"/>
            <rect x="171" y="218" width="14" height="17" rx="2" fill="#3498DB"/>
            <rect x="186" y="220" width="15" height="15" rx="2" fill="#27AE60"/>
            <rect x="282" y="113" width="196" height="123" rx="10" fill="#2C3E50"/>
            <rect x="292" y="123" width="176" height="105" rx="6" fill="#ECF0F1"/>
            <rect x="296" y="127" width="82" height="48" rx="4" fill="#AED6F1"/>
            <rect x="384" y="127" width="78" height="48" rx="4" fill="#A9DFBF"/>
            <rect x="296" y="180" width="82" height="44" rx="4" fill="#F9E79F"/>
            <rect x="384" y="180" width="78" height="44" rx="4" fill="#FADBD8"/>
            <circle cx="337" cy="145" r="10" fill="#E59866"/>
            <ellipse cx="337" cy="161" rx="13" ry="8" fill="#8E44AD" opacity=".7"/>
            <circle cx="423" cy="143" r="9" fill="#85929E"/>
            <ellipse cx="423" cy="158" rx="12" ry="7" fill="#2980B9" opacity=".65"/>
            <circle cx="337" cy="196" r="9" fill="#F0B27A"/>
            <ellipse cx="337" cy="210" rx="12" ry="7" fill="#E74C3C" opacity=".6"/>
            <circle cx="423" cy="198" r="10" fill="#7FB3D3"/>
            <ellipse cx="423" cy="213" rx="13" ry="8" fill="#27AE60" opacity=".6"/>
            <rect x="368" y="236" width="24" height="10" rx="3" fill="#2C3E50"/>
            <rect x="358" y="244" width="44" height="6" rx="3" fill="#2C3E50"/>
            <rect x="492" y="134" width="7" height="84" rx="3" fill="#7F8C8D"/>
            <polygon points="470,134 522,134 506,98 486,98" fill="#F39C12"/>
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
            <rect x="572" y="206" width="20" height="34" rx="4" fill="#8B4513"/>
            <ellipse cx="582" cy="206" rx="28" ry="21" fill="#27AE60"/>
            <ellipse cx="571" cy="195" rx="20" ry="16" fill="#2ECC71"/>
            <ellipse cx="596" cy="200" rx="18" ry="13" fill="#27AE60"/>
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
      <section className="bg-white px-5 md:px-10 lg:px-14 py-6 md:py-8 border-b border-[#E0D8C8]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 items-center">
          <div className="text-center">
            <div className="text-2xl md:text-[32px] font-black tracking-tight text-[#17140D] mb-1">Class 6–12</div>
            <div className="text-xs text-[#7A7060] leading-snug">All grades covered</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-[#E0D8C8] mx-auto" />
          <div className="text-center">
            <div className="text-2xl md:text-[32px] font-black tracking-tight text-[#17140D] mb-1">6 Steps</div>
            <div className="text-xs text-[#7A7060] leading-snug">Per chapter, every time</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-[#E0D8C8] mx-auto" />
          <div className="text-center">
            <div className="text-2xl md:text-[32px] font-black tracking-tight text-[#17140D] mb-1">4 Skills</div>
            <div className="text-xs text-[#7A7060] leading-snug">Mentor-scored rubric</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-[#E0D8C8] mx-auto" />
          <div className="text-center">
            <div className="text-2xl md:text-[32px] font-black tracking-tight text-[#17140D] mb-1">Real Mentors</div>
            <div className="text-xs text-[#7A7060] leading-snug">No AI grading, ever</div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - WE PROVIDE */}
      <section id="how-it-works" className="bg-[#FDF8EF] px-5 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-[70px] items-center">
          <div className="bg-[#FAF4E8] border border-[#E0D8C8] rounded-3xl flex items-center justify-center p-6 md:p-8 min-h-[240px] md:min-h-[290px] order-2 lg:order-1">
            <svg viewBox="0 0 320 255" className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
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
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[rgba(245,166,35,.14)] border-[1.5px] border-[rgba(245,166,35,.4)] rounded-full px-4 py-1 text-[11.5px] font-semibold text-[#B8780A] tracking-wider mb-4 md:mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              Our platform
            </div>
            <h2 className="text-[clamp(28px,3.8vw,48px)] font-black leading-[1.1] tracking-[-1.5px] lg:tracking-[-2px] mb-5 text-[#17140D]">
              We Provide<br/>
              <span className="oval-outline">Structured</span><br/>
              Deep Learning
            </h2>
            <p className="text-[15px] text-[#7A7060] leading-[1.8] max-w-[400px]">
              Every BookandLab chapter comes with an assigned mentor who personally reviews your project using a transparent 4-skill rubric — Concept Clarity, Critical Thinking, Application, and Communication — scored 1 to 5, every time.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - 6-STEP METHOD */}
      <section className="bg-[#FAF4E8] border-t border-b border-[#E0D8C8] px-5 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="text-center mb-10 md:mb-13">
          <div className="inline-flex items-center gap-2 bg-[rgba(245,166,35,.14)] border-[1.5px] border-[rgba(245,166,35,.4)] rounded-full px-4 py-1 text-[11.5px] font-semibold text-[#B8780A] tracking-wider mb-4 md:mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            Our method
          </div>
          <h2 className="text-[clamp(26px,3.5vw,44px)] font-black tracking-[-1.5px] lg:tracking-[-2px] mb-3 text-[#17140D]">
            Every chapter. <span className="oval-outline">6 Steps.</span>
          </h2>
          <p className="max-w-[460px] mx-auto text-[15px] text-[#7A7060] leading-[1.75]">
            Our structured framework takes every student from a real-world hook to a mentor-reviewed project — in every chapter, across every subject.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[
            { step: 1, title: "Context — Why it matters", text: "A real-life scenario connects the concept to the student world before any theory begins.", bg: "#17140D", color: "white" },
            { step: 2, title: "Concept — Clear explanation", text: "Plain-language theory with diagrams, key terms, and a short quiz that locks in memory.", bg: "#17140D", color: "white" },
            { step: 3, title: "Thinking — Open prompts", text: "3–5 guided questions push students beyond recall into real analysis and reasoning.", bg: "#17140D", color: "white" },
            { step: 4, title: "Deep Learning — Mastery", text: "Worked examples, common misconceptions, and inline tasks that confirm true understanding.", bg: "#F5A623", color: "#17140D" },
            { step: 5, title: "Project — Apply it", text: "A short real-world submission reviewed by your assigned mentor using a transparent rubric.", bg: "#16A34A", color: "white" },
            { step: 6, title: "Reflection — Lock it in", text: "Guided prompts help students articulate what they learned and plan what to practice next.", bg: "#C93A2A", color: "white" }
          ].map((s) => (
            <div key={s.step} className="step-card bg-white border border-[#E0D8C8] rounded-[20px] p-6 md:p-7">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black mb-4" style={{ background: s.bg, color: s.color }}>
                {s.step}
              </div>
              <h4 className="text-[14.5px] font-extrabold mb-2 tracking-tight">{s.title}</h4>
              <p className="text-[13px] text-[#7A7060] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 - FEATURES */}
      <section className="bg-[#FDF8EF] px-5 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
          <div className="bg-[#17140D] rounded-[22px] p-8 md:p-10 flex flex-col justify-between min-h-[200px] md:min-h-[230px]">
            <div>
              <div className="text-xl opacity-35 text-white mb-3">╲|</div>
              <h3 className="text-2xl md:text-[28px] font-black text-white leading-[1.18] tracking-tight m-0">
                Our <em className="text-[#F5A623] not-italic">Features</em><br/>Special For you
              </h3>
            </div>
            <button className="bg-[#F5A623] text-[#17140D] rounded-full px-6 py-3 text-[13.5px] font-bold w-fit mt-5 md:mt-6 inline-flex items-center gap-2 border-none hover:opacity-90 transition-opacity">
              See All Features ↗
            </button>
          </div>

          <div className="feat-card bg-white border border-[#E0D8C8] rounded-[22px] p-6 md:p-8">
            <div className="w-13 h-13 rounded-[14px] bg-[rgba(245,166,35,.13)] border border-[rgba(245,166,35,.28)] flex items-center justify-center text-[22px] mb-4">
              📊
            </div>
            <h4 className="text-[15.5px] font-extrabold mb-2">Skill Growth Dashboard</h4>
            <p className="text-[13.5px] text-[#7A7060] leading-relaxed">
              Every mentor review updates your 4 skill scores in real time. Trend arrows show growth direction so you always know where to focus next.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[
            { emoji: "🔥", title: "Daily Streak Tracker", text: "Build a daily habit. Your streak grows every day you complete at least one step. Longest streak always visible." },
            { emoji: "🎯", title: "Weekly Goal System", text: "Set your own weekly chapter target. A live progress ring tracks your goal — resets every Monday." },
            { emoji: "👨‍🏫", title: "Personal Mentor Review", text: "Every project goes to your assigned subject-expert mentor. They score on all 4 skills and leave written feedback." }
          ].map((feat, i) => (
            <div key={i} className="feat-card bg-white border border-[#E0D8C8] rounded-[22px] p-6 md:p-8">
              <div className="w-13 h-13 rounded-[14px] bg-[rgba(245,166,35,.13)] border border-[rgba(245,166,35,.28)] flex items-center justify-center text-[22px] mb-4">
                {feat.emoji}
              </div>
              <h4 className="text-[15.5px] font-extrabold mb-2">{feat.title}</h4>
              <p className="text-[13.5px] text-[#7A7060] leading-relaxed">{feat.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 - PRICING PLANS */}
      <section id="pricing" className="bg-[#17140D] px-5 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[clamp(28px,3.5vw,46px)] font-black text-white tracking-[-1.5px] lg:tracking-[-2px] mb-3">
            Popular <span className="inline-block border-[2.5px] border-[#F5A623] rounded-full px-4 pb-0.5 italic font-semibold" style={{ fontFamily: "'Lora',serif" }}>Plans</span>
          </h2>
          <p className="text-[15px] text-[#88806A] max-w-[420px] mx-auto leading-relaxed">
            Start with the basics and upgrade when you are ready. Every plan includes the full 6-step method.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* PLAN 1 - STARTER */}
          <div className="plan-card bg-white rounded-[22px] overflow-hidden">
            <div className="h-36 md:h-[172px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FFF3E0,#FFE0B2)" }}>
              <svg viewBox="0 0 180 145" width="140" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="62" r="42" fill="none" stroke="#F5A623" strokeWidth="2" strokeDasharray="7 4" opacity=".6"/>
                <circle cx="90" cy="50" r="18" fill="#F0B27A"/>
                <ellipse cx="90" cy="70" rx="23" ry="13" fill="#27AE60" opacity=".7"/>
                <rect x="64" y="84" width="52" height="40" rx="6" fill="#FFFDE7" stroke="#EEE" strokeWidth="1.2"/>
                <line x1="72" y1="95" x2="108" y2="95" stroke="#DDD" strokeWidth="1.5"/>
                <line x1="72" y1="104" x2="108" y2="104" stroke="#DDD" strokeWidth="1.5"/>
                <line x1="72" y1="113" x2="96" y2="113" stroke="#DDD" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="p-5 md:p-6 pb-6 md:pb-7">
              <div className="text-[10.5px] font-bold text-[#7A7060] uppercase tracking-[.14em] mb-2">STARTER</div>
              <div>
                <span className="text-base font-bold mt-2">₹</span>
                <span className="text-4xl font-black tracking-tight">299</span>
              </div>
              <div className="text-[13px] text-[#7A7060] mb-4">/month</div>
              <div className="border-b border-[#E0D8C8] mb-4" />
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { text: "All published chapters", active: true },
                  { text: "Full 6-step learning flow", active: true },
                  { text: "Progress & streak tracking", active: true },
                  { text: "Weekly goal tracker", active: true },
                  { text: "Mentor review", active: false },
                  { text: "Skill growth scoring", active: false }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13.5px]" style={{ color: f.active ? "#17140D" : "#B0A898" }}>
                    {f.active ? (
                      <div className="w-5 h-5 rounded-full bg-[#F5A623] text-[#17140D] font-extrabold text-[10px] flex items-center justify-center shrink-0">✓</div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#E0D8C8] text-[#B0A898] flex items-center justify-center shrink-0">–</div>
                    )}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <button className="w-full text-[13px] py-3 rounded-full border-[2.5px] border-[#17140D] bg-transparent text-[#17140D] font-bold hover:bg-[#F5A623] hover:border-[#F5A623] transition-colors min-h-[44px]">
                Get Started
              </button>
            </div>
          </div>

          {/* PLAN 2 - STANDARD (MOST POPULAR) */}
          <div className="plan-card bg-white rounded-[22px] overflow-hidden relative border-[2.5px] border-[#F5A623]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#F5A623] text-[#17140D] rounded-b-xl px-5 py-1 text-[10px] font-extrabold tracking-[.1em] uppercase z-10">
              MOST POPULAR
            </div>
            <div className="mt-2.5 h-36 md:h-[172px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#E8F5E9,#C8E6C9)" }}>
              <svg viewBox="0 0 180 145" width="140" xmlns="http://www.w3.org/2000/svg">
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
            <div className="p-5 md:p-6 pb-6 md:pb-7">
              <div className="text-[10.5px] font-bold text-[#7A7060] uppercase tracking-[.14em] mb-2">STANDARD</div>
              <div>
                <span className="text-base font-bold mt-2">₹</span>
                <span className="text-4xl font-black tracking-tight">599</span>
              </div>
              <div className="text-[13px] text-[#7A7060] mb-4">
                /month · <span className="text-[#16A34A] font-bold">Save 20% yearly</span>
              </div>
              <div className="border-b border-[#E0D8C8] mb-4" />
              <div className="flex flex-col gap-3 mb-6">
                {[
                  "Everything in Starter",
                  "Assigned personal mentor",
                  "All 5 projects reviewed",
                  "4-skill rubric scoring (1–5)",
                  "Written mentor feedback",
                  "Detailed progress page"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13.5px] text-[#17140D]">
                    <div className="w-5 h-5 rounded-full bg-[#F5A623] text-[#17140D] font-extrabold text-[10px] flex items-center justify-center shrink-0">✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/login">
                <button className="w-full text-[13px] py-3 rounded-full bg-[#F5A623] text-[#17140D] font-bold border-[2.5px] border-[#F5A623] hover:opacity-90 transition-opacity min-h-[44px]">
                  Enroll Now
                </button>
              </Link>
            </div>
          </div>

          {/* PLAN 3 - PREMIUM */}
          <div className="plan-card bg-white rounded-[22px] overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="h-36 md:h-[172px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FCE4EC,#F8BBD0)" }}>
              <svg viewBox="0 0 180 145" width="140" xmlns="http://www.w3.org/2000/svg">
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
            <div className="p-5 md:p-6 pb-6 md:pb-7">
              <div className="text-[10.5px] font-bold text-[#7A7060] uppercase tracking-[.14em] mb-2">PREMIUM</div>
              <div>
                <span className="text-base font-bold mt-2">₹</span>
                <span className="text-4xl font-black tracking-tight">999</span>
              </div>
              <div className="text-[13px] text-[#7A7060] mb-4">/month</div>
              <div className="border-b border-[#E0D8C8] mb-4" />
              <div className="flex flex-col gap-3 mb-6">
                {[
                  "Everything in Standard",
                  "Priority mentor assignment",
                  "Faster review turnaround",
                  "Resubmission on any project",
                  "All classes & all subjects",
                  "Admin subscription control"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13.5px] text-[#17140D]">
                    <div className="w-5 h-5 rounded-full bg-[#F5A623] text-[#17140D] font-extrabold text-[10px] flex items-center justify-center shrink-0">✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full text-[13px] py-3 rounded-full border-[2.5px] border-[#17140D] bg-transparent text-[#17140D] font-bold hover:bg-[#F5A623] hover:border-[#F5A623] transition-colors min-h-[44px]">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 - EASY START */}
      <section className="bg-white px-5 md:px-10 lg:px-14 py-16 md:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-[72px] items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[rgba(245,166,35,.14)] border-[1.5px] border-[rgba(245,166,35,.4)] rounded-full px-4 py-1 text-[11.5px] font-semibold text-[#B8780A] tracking-wider mb-4 md:mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              Get started
            </div>
            <h2 className="text-[clamp(28px,3.8vw,46px)] font-black tracking-[-1.5px] leading-[1.12] mb-5">
              Its easy to start<br/>
              <span className="oval-outline">Learning</span>
            </h2>
            <p className="text-[15px] text-[#7A7060] leading-[1.78] max-w-[360px] mb-6 md:mb-8">
              Sign up, pick your class and subject, and your first chapter is ready in under 60 seconds. No complicated onboarding — just structured learning from the first click.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Create your student account",
                "Choose your class and subject",
                "Start Chapter 1 — Step 1 immediately"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#F5A623] flex items-center justify-center text-xs font-black shrink-0">
                    ✓
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 290 265" className="w-full max-w-[290px]" xmlns="http://www.w3.org/2000/svg">
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
        </div>
      </section>

      {/* SECTION 9 - CTA BANNER */}
      <div className="px-4 md:px-10 lg:px-13 pb-16 md:pb-20 bg-white">
        <div className="bg-[#F5A623] rounded-[22px] md:rounded-[28px] px-5 py-10 md:p-12 lg:p-13 relative overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-11 items-center">
            <div className="hidden md:block absolute opacity-[.22] text-xl top-5 right-20 rotate-[22deg]">╲|</div>
            <div className="hidden md:block absolute opacity-[.22] text-[28px] bottom-5 right-10 -rotate-12 italic" style={{ fontFamily: "serif" }}>ʃ</div>

            <svg viewBox="0 0 240 196" className="w-full max-w-[240px] hidden md:block" xmlns="http://www.w3.org/2000/svg">
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
              <h2 className="text-[clamp(24px,3.2vw,40px)] font-black tracking-tight leading-[1.16] mb-3">
                Get <em className="italic" style={{ fontFamily: "'Lora',serif" }}>Ready</em> to Start<br/>Your Journey
              </h2>
              <p className="text-[14.5px] text-[#17140D] opacity-65 leading-relaxed mb-6 max-w-[420px]">
                Pick your class, open your first chapter, complete all 6 steps. Your assigned mentor reviews your project and scores your 4 skills.
              </p>
              <div className="flex gap-4 md:gap-5 mb-6 md:mb-7 flex-wrap">
                {["Sign up free", "Pick class & subject", "Submit your first project"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] md:text-[13.5px] font-semibold">
                    <div className="w-6 h-6 rounded-full bg-[#17140D] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    {text}
                  </div>
                ))}
              </div>
              <Link href="/login">
                <button className="bg-[#17140D] text-white rounded-full px-6 md:px-8 py-3.5 text-[14.5px] font-bold inline-flex items-center gap-2 hover:bg-[#2A261A] hover:-translate-y-px transition-all min-h-[44px]">
                  Order Now ↗
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 10 - FOOTER */}
      <footer className="bg-[#FDF8EF] px-4 md:px-8 lg:px-11 pb-6 md:pb-9">
        <div className="bg-[#17140D] rounded-[20px] md:rounded-[26px] px-5 py-10 md:p-12 lg:px-14 lg:py-14 mb-5 md:mb-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-8 lg:gap-11">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-[9px] bg-[#F5A623] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M2 8h8M2 12h12" stroke="#17140D" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
                <span className="text-[15px] font-black text-white tracking-[.06em]">BOOKANDLAB</span>
              </div>
              <p className="text-[13.5px] text-white/35 leading-relaxed max-w-[240px] mb-5 md:mb-6">
                Structured chapter learning with real mentor feedback — so every student grows every single week.
              </p>
              <div className="flex gap-2.5">
                {["𝕏", "in", "ig", "yt"].map((label, i) => (
                  <button key={i} className="w-9 h-9 rounded-[10px] border border-white/10 text-white/35 bg-transparent hover:border-[#F5A623] hover:text-[#F5A623] transition-colors text-sm min-h-[36px]">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-[13px] font-bold text-white mb-4 tracking-wider">Platform</h5>
              <div className="flex flex-col gap-2.5">
                {["How It Works", "Subjects", "Pricing", "For Mentors", "For Schools"].map(l => (
                  <Link key={l} href="#" className="text-[13.5px] text-white/35 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[13px] font-bold text-white mb-4 tracking-wider">Company</h5>
              <div className="flex flex-col gap-2.5">
                {["About Us", "Blog", "Careers", "Press Kit"].map(l => (
                  <Link key={l} href="#" className="text-[13.5px] text-white/35 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[13px] font-bold text-white mb-4 tracking-wider">Support</h5>
              <div className="flex flex-col gap-2.5">
                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Use"].map(l => (
                  <Link key={l} href="#" className="text-[13.5px] text-white/35 hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-[13px] text-[#7A7060] px-2 md:px-3 gap-2">
          <div>© BookandLab 2024. All rights reserved.</div>
          <div>Terms & Privacy Policy</div>
        </div>
      </footer>
    </div>
  );
}
