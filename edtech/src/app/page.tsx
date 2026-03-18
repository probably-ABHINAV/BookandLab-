"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Headphones,
  Play,
  GraduationCap,
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Flame,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ============ NAVIGATION ============ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight">
                BookandLab
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-navy-900 hover:text-primary-500 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-navy-600 hover:text-primary-500 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#courses"
                className="text-sm font-medium text-navy-600 hover:text-primary-500 transition-colors"
              >
                Courses
              </Link>
              <Link
                href="#stats"
                className="text-sm font-medium text-navy-600 hover:text-primary-500 transition-colors"
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-navy-900 hover:text-primary-500 transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <Link href="/signup" className="btn-pill btn-primary text-sm !py-2.5 !px-6">
              Sign Up
            </Link>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-cream-200 px-6 py-4 animate-fade-in-up">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium py-2">Home</Link>
              <Link href="#features" className="text-sm font-medium py-2">Features</Link>
              <Link href="#courses" className="text-sm font-medium py-2">Courses</Link>
              <div className="flex gap-3 pt-3 border-t border-cream-200">
                <Link href="/login" className="btn-pill btn-outline text-sm !py-2 flex-1 justify-center">
                  Log In
                </Link>
                <Link href="/signup" className="btn-pill btn-primary text-sm !py-2 flex-1 justify-center">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-primary-300/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Anywhere, Anytime Learning
              </div>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                Improve your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary-500">Skills</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 20"
                    fill="none"
                  >
                    <path
                      d="M2 15C50 5 100 2 150 8C200 14 250 5 298 12"
                      stroke="#E5B05D"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="animate-[draw_1.5s_ease-in-out_forwards]"
                    />
                  </svg>
                </span>{" "}
                Faster
              </h1>
              <p className="text-lg text-navy-600 mb-8 max-w-lg leading-relaxed">
                Speed up the skill acquisition process by finding unlimited
                courses that match your niche. Learn through our unique 6-step
                methodology with mentor-guided feedback.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="btn-pill btn-primary text-base !py-3.5 !px-8 group">
                  Enroll Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features" className="btn-pill btn-outline text-base !py-3.5 !px-8">
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {[
                    "bg-primary-300",
                    "bg-blue-300",
                    "bg-green-300",
                    "bg-purple-300",
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 ${bg} rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-primary-400 text-primary-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-navy-600">
                    <span className="font-bold text-navy-900">4.8</span> from
                    2,000+ reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Illustration area */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Main hero card */}
                <div className="bg-primary-400 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-300/40 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/30 rounded-full translate-y-8 -translate-x-8" />

                  <div className="relative z-10 text-navy-900">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Start Learning</p>
                        <p className="text-sm opacity-80">6-step methodology</p>
                      </div>
                    </div>

                    {/* Step indicators */}
                    <div className="grid grid-cols-6 gap-2 mb-6">
                      {["Context", "Concept", "Think", "Deep", "Project", "Reflect"].map(
                        (step, i) => (
                          <div key={step} className="text-center">
                            <div
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                                i < 3
                                  ? "bg-white text-primary-600"
                                  : "bg-white/30 text-navy-900"
                              }`}
                            >
                              {i + 1}
                            </div>
                            <p className="text-[10px] font-medium opacity-80">
                              {step}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                      <div className="bg-white h-full rounded-full w-[50%] transition-all duration-1000" />
                    </div>
                    <p className="text-sm mt-2 font-medium">
                      3 of 6 steps completed
                    </p>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-navy-600">Day Streak</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-4 shadow-lg"
                  style={{ animation: "float 3s ease-in-out 0.5s infinite" }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm font-bold">Weekly Goal</p>
                      <p className="text-xs text-navy-600">4/5 chapters</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute top-1/2 -right-10 bg-white rounded-2xl p-3 shadow-lg"
                  style={{ animation: "float 3s ease-in-out 1s infinite" }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <p className="text-sm font-bold">+15%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z"
              fill="#fefcf9"
            />
          </svg>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section id="stats" className="py-16 bg-cream-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "4.5", label: "Star Reviews", sub: "80K reviews" },
              { value: "30M", label: "Enrollments", sub: "Total learners" },
              { value: "2M+", label: "Learners", sub: "Active monthly" },
              { value: "1K+", label: "Courses", sub: "Expert-led" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="font-heading text-4xl md:text-5xl font-bold text-navy-900">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-navy-700 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-navy-600 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Why Choose Us
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">
              Our Features{" "}
              <span className="text-primary-500">Special</span> For You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              {
                icon: Award,
                title: "Get Certified",
                desc: "Earn certificates upon completing courses. Showcase your achievements to employers.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: Headphones,
                title: "Mentor Support",
                desc: "Get personalized feedback from dedicated mentors who review your projects.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Play,
                title: "6-Step Learning",
                desc: "Our unique methodology: Context → Concept → Thinking → Deep Dive → Project → Reflection.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: GraduationCap,
                title: "Skill Tracking",
                desc: "Track your growth across 4 skill dimensions with detailed analytics and trends.",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Our Methodology
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">
              6-Step Learning Path
            </h2>
            <p className="text-navy-600 mt-4 max-w-2xl mx-auto">
              Every chapter follows our proven 6-step methodology designed to
              maximize understanding and retention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              {
                step: 1,
                title: "Context",
                desc: "Start with a real-world scenario that connects the concept to your life.",
                emoji: "🌍",
              },
              {
                step: 2,
                title: "Concept",
                desc: "Learn the core idea through clear explanations and examples.",
                emoji: "💡",
              },
              {
                step: 3,
                title: "Thinking",
                desc: "Challenge your understanding with guided thinking prompts.",
                emoji: "🧠",
              },
              {
                step: 4,
                title: "Deep Dive",
                desc: "Go deeper with worked examples and advanced material.",
                emoji: "🔬",
              },
              {
                step: 5,
                title: "Project",
                desc: "Apply what you learned in a hands-on project submission.",
                emoji: "🚀",
              },
              {
                step: 6,
                title: "Reflection",
                desc: "Reflect on your learning journey and consolidate knowledge.",
                emoji: "✨",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-flat group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.emoji}</span>
                      <h3 className="font-heading text-lg font-bold">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-navy-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRACKER FEATURES ============ */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
                Stay Motivated
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                Track Your{" "}
                <span className="text-primary-500">Progress</span> Like Never
                Before
              </h2>
              <p className="text-navy-600 mb-8 leading-relaxed">
                Our built-in tracking system keeps you motivated with streaks,
                weekly goals, skill analytics, and a comprehensive progress
                dashboard.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Flame,
                    title: "Streak Tracker",
                    desc: "Build daily learning habits with streak tracking",
                    color: "text-orange-500",
                  },
                  {
                    icon: Target,
                    title: "Weekly Goals",
                    desc: "Set and crush your weekly chapter completion targets",
                    color: "text-green-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "Skill Analytics",
                    desc: "Monitor growth across 4 skill dimensions over time",
                    color: "text-blue-500",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Chapter Progress",
                    desc: "Visual progress tracking for every chapter and subject",
                    color: "text-purple-500",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-navy-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-cream-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-navy-600">Good morning</p>
                    <p className="font-heading text-xl font-bold">Dashboard</p>
                  </div>
                  <div className="badge badge-success">Active</div>
                </div>

                {/* Streak + Goal */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-6 h-6 text-orange-500" />
                      <span className="text-3xl font-bold text-navy-900">
                        12
                      </span>
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      Day Streak
                    </p>
                    <p className="text-xs text-navy-600">Best: 15 days</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-6 h-6 text-green-500" />
                      <span className="text-3xl font-bold text-navy-900">
                        4/5
                      </span>
                    </div>
                    <p className="text-sm font-medium text-navy-700">
                      Weekly Goal
                    </p>
                    <p className="text-xs text-navy-600">80% complete</p>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-3">
                  {[
                    { name: "Mathematics", pct: 75, color: "bg-blue-500" },
                    { name: "Science", pct: 60, color: "bg-green-500" },
                    { name: "English", pct: 90, color: "bg-purple-500" },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-navy-600">{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${s.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill bars */}
                <div className="mt-6 pt-4 border-t border-cream-200">
                  <p className="text-sm font-semibold mb-3">Skill Snapshot</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Clarity", score: 4.2, trend: "↑" },
                      { name: "Thinking", score: 3.8, trend: "↑" },
                      { name: "Application", score: 4.0, trend: "→" },
                      { name: "Communication", score: 3.5, trend: "↑" },
                    ].map((sk) => (
                      <div
                        key={sk.name}
                        className="bg-cream-50 rounded-xl p-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{sk.name}</span>
                          <span
                            className={`text-xs ${
                              sk.trend === "↑"
                                ? "text-green-500"
                                : "text-navy-400"
                            }`}
                          >
                            {sk.trend}
                          </span>
                        </div>
                        <p className="text-lg font-bold">{sk.score}/5</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-6 -right-3 w-full h-full bg-primary-200 rounded-3xl" />
              <div className="absolute -z-20 top-12 -right-6 w-full h-full bg-primary-100 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ ROLES SECTION ============ */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
              Built For Everyone
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">
              Three Powerful Panels
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                role: "Student",
                desc: "Learn through 6-step chapters, track progress, build streaks, submit projects, and grow your skills.",
                features: [
                  "6-step learning flow",
                  "Streak & goal tracking",
                  "Skill analytics",
                  "Project submissions",
                ],
                color: "border-blue-200 hover:border-blue-400",
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                link: "/signup",
              },
              {
                role: "Mentor",
                desc: "Review student projects, provide rubric-based feedback, and track student progress across skills.",
                features: [
                  "Rubric-based reviews",
                  "Student progress view",
                  "Skill trend analysis",
                  "Assignment management",
                ],
                color: "border-green-200 hover:border-green-400",
                iconBg: "bg-green-50",
                iconColor: "text-green-600",
                link: "/signup",
              },
              {
                role: "Admin",
                desc: "Full platform control: manage users, chapters, content, subscriptions, and mentor assignments.",
                features: [
                  "Full CRUD operations",
                  "Chapter content editor",
                  "User management",
                  "Subscription control",
                ],
                color: "border-purple-200 hover:border-purple-400",
                iconBg: "bg-purple-50",
                iconColor: "text-purple-600",
                link: "/signup",
              },
            ].map((panel) => (
              <div
                key={panel.role}
                className={`card border-2 ${panel.color} transition-colors`}
              >
                <div
                  className={`w-14 h-14 ${panel.iconBg} rounded-2xl flex items-center justify-center mb-5`}
                >
                  <Users className={`w-7 h-7 ${panel.iconColor}`} />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2">
                  {panel.role}
                </h3>
                <p className="text-sm text-navy-600 mb-5 leading-relaxed">
                  {panel.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {panel.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={panel.link}
                  className="btn-pill btn-secondary w-full justify-center text-sm"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your{" "}
            <span className="text-primary-400">Learning Journey?</span>
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of students already improving their skills with our
            structured 6-step methodology and mentor-guided feedback system.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-pill btn-secondary text-base !py-3.5 !px-8 group"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="btn-pill text-base !py-3.5 !px-8 bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-navy-900 text-white/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-white">
                  BookandLab
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                An interactive EdTech platform designed to help students learn
                through structured methodology with mentor support.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-primary-400 transition-colors">Features</Link></li>
                <li><Link href="#courses" className="hover:text-primary-400 transition-colors">Courses</Link></li>
                <li><Link href="#stats" className="hover:text-primary-400 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/signup" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-primary-400 transition-colors">Log In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm">
            <p>© 2026 BookandLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
