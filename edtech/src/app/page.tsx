import Link from "next/link";
import { ArrowRight, Play, BookOpen, Star, Shield, Target, Users, LayoutDashboard, Brain, PieChart, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-yellow selection:text-brand-navy overflow-hidden">
      
      {/* Floating Glass Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full px-6 py-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-brand-yellow" />
          </div>
          <span className="font-heading text-2xl font-black tracking-tight text-brand-navy uppercase">
            MÖNAC
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-text-secondary">
          <Link href="#features" className="hover:text-brand-navy transition-colors">Platform</Link>
          <Link href="#methodology" className="hover:text-brand-navy transition-colors">Methodology</Link>
          <Link href="#roles" className="hover:text-brand-navy transition-colors">For Mentors</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-brand-navy hover:opacity-70 transition-opacity">
            Log In
          </Link>
          <Link href="/signup" className="btn btn-primary !py-2.5 !px-6 !text-sm">
            Start Learning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-yellow/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-[80px] -z-10" />

        <div className="flex-1 space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface shadow-sm border border-brand-navy/5">
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-brand-navy uppercase">Future of EdTech</span>
          </div>

          <h1 className="font-heading text-6xl lg:text-[5rem] font-bold text-brand-navy leading-[1.05] tracking-tight text-balance">
            Master Skills with 
            <span className="block italic font-light text-brand-yellow pr-4">Precision.</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-lg leading-relaxed">
            MÖNAC combines personalized learning paths, rigorous mentor feedback, and automated streak tracking to accelerate career growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/signup" className="btn btn-accent w-full sm:w-auto !py-4 !px-8 text-lg">
              Explore Courses <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
            <button className="btn btn-outline w-full sm:w-auto !py-4 !px-8 text-lg border-brand-muted bg-white hover:border-brand-navy">
              <Play className="w-5 h-5 mr-2" /> How it works
            </button>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-brand-navy/10 mt-8">
            <div>
              <p className="font-heading text-3xl font-bold text-brand-navy">4.9/5</p>
              <div className="flex text-brand-yellow mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
            <div className="w-px h-12 bg-brand-navy/10" />
            <div>
              <p className="font-heading text-3xl font-bold text-brand-navy">2M+</p>
              <p className="text-sm font-medium text-text-secondary mt-1">Active Learners</p>
            </div>
          </div>
        </div>

        {/* Hero Visual - Abstract Composition */}
        <div className="flex-1 relative w-full aspect-square max-w-[600px] animate-fade-up delay-200">
          <div className="absolute inset-0 bg-brand-navy rounded-[3rem] rotate-3 transition-transform hover:rotate-6 duration-700" />
          <div className="absolute inset-0 bg-brand-yellow rounded-[3rem] -rotate-3 overflow-hidden shadow-2xl flex flex-col justify-between p-10">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl p-4">
                <Target className="w-full h-full text-brand-navy" />
              </div>
              <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-brand-navy shadow-sm">
                Top 1% Performers
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="h-6 w-3/4 bg-white/30 rounded-full" />
              <div className="h-6 w-5/6 bg-white/30 rounded-full" />
              <div className="h-4 w-1/2 bg-white/20 rounded-full mt-8" />
            </div>

            <div className="mt-12 bg-white/90 p-6 rounded-2xl shadow-xl flex items-center justify-between text-brand-navy transform translate-y-4 hover:translate-y-0 transition-transform cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-brand-yellow font-bold">
                  JS
                </div>
                <div>
                  <p className="font-bold">Advanced JavaScript</p>
                  <p className="text-sm text-text-secondary">Next lesson: Closures</p>
                </div>
              </div>
              <Play className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Features Grid */}
      <section id="features" className="section-padding bg-brand-navy text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-premium bg-brand-yellow text-brand-navy mb-6">Designed for Excellence</span>
            <h2 className="font-heading text-5xl font-bold mb-4">Why choose MÖNAC?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">We abandoned traditional video lectures for an interactive, active-learning approach that guarantees skill retention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute right-0 top-0 w-64 h-64 bg-brand-yellow/20 blur-[80px] rounded-full" />
              <Shield className="w-12 h-12 text-brand-yellow mb-6" />
              <h3 className="font-heading text-3xl font-bold mb-4">6-Step Methodology</h3>
              <p className="text-white/70 text-lg max-w-md">Every chapter forces you through Context, Concepts, Critical Thinking, Deep Dives, Real Projects, and Reflection. No passive watching allowed.</p>
              
              <div className="flex gap-2 mt-8">
                {['Context', 'Think', 'Build'].map((s, i) => (
                  <div key={s} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {i+1}. {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="bg-[#1a2235] rounded-3xl p-10 flex flex-col justify-between group">
              <div>
                <Brain className="w-10 h-10 text-white mb-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-heading text-2xl font-bold mb-3">Skill Analytics</h3>
                <p className="text-white/60">We measure Critical Thinking, Communication, Concept Clarity, and Application separately.</p>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="bg-[#1a2235] rounded-3xl p-10 flex flex-col justify-between group">
              <div>
                <PieChart className="w-10 h-10 text-brand-yellow mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-heading text-2xl font-bold mb-3">Streak Tracking</h3>
                <p className="text-white/60">Maintain daily learning streaks and set strict weekly goals to build unstoppable momentum.</p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 bg-brand-yellow text-brand-navy rounded-3xl p-10 relative overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer">
              <Users className="w-12 h-12 text-brand-navy mb-6" />
              <div className="max-w-md">
                <h3 className="font-heading text-3xl font-bold mb-4">Expert Mentor Reviews</h3>
                <p className="text-brand-navy/80 text-lg mb-8">Every project you submit is reviewed by an assigned industry mentor. Receive incredibly detailed feedback using our strict 1-5 rubric for 4 distinct skills.</p>
                <div className="inline-flex items-center font-bold pb-1 border-b-2 border-brand-navy hover:text-white hover:border-white transition-colors">
                  Explore Mentorship <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-brand-navy/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Role Segmentation Section */}
      <section id="roles" className="section-padding px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-brand-navy mb-4">Three Powerful Experiences</h2>
          <p className="text-text-secondary text-lg">A unified platform tailored specifically for every type of user.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { role: "Student", desc: "Access the 6-step chapters, submit projects, and watch your skill parameters grow.", icon: BookOpen, color: "bg-surface border-brand-muted" },
            { role: "Mentor", desc: "Manage an assigned roster of students, grade submissions via rubric, and guide careers.", icon: Users, color: "bg-brand-muted border-transparent" },
            { role: "Admin", desc: "Author deep-dive chapters, manage user roles, assign mentors, and handle subscriptions.", icon: LayoutDashboard, color: "bg-brand-navy text-white border-brand-navy" }
          ].map((panel, i) => (
            <div key={panel.role} className={`bento-card relative overflow-hidden group ${panel.color}`}>
              <panel.icon className={`w-10 h-10 mb-6 ${panel.role === 'Admin' ? 'text-brand-yellow' : 'text-brand-navy'}`} />
              <h3 className={`font-heading text-3xl font-bold mb-4 ${panel.role === 'Admin' ? 'text-white' : 'text-brand-navy'}`}>{panel.role} Panel</h3>
              <p className={`mb-8 ${panel.role === 'Admin' ? 'text-white/70' : 'text-text-secondary'}`}>{panel.desc}</p>
              
              <Link href="/login" className={`inline-flex items-center font-bold ${panel.role === 'Admin' ? 'text-brand-yellow' : 'text-brand-navy'}`}>
                Test Demo <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-brand-dark text-white pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center border-b border-white/10 pb-20 mb-12">
          <h2 className="font-heading text-6xl font-black mb-6">Ready to elevate your learning?</h2>
          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">Join the MÖNAC platform today. Setup takes less than a minute. Start mastering skills, not just memorizing syntax.</p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="btn btn-accent !py-4 !px-10 text-lg">
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-white/40">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpen className="w-5 h-5 text-brand-yellow" />
            <span className="font-heading font-bold text-white text-lg tracking-widest">MÖNAC</span>
          </div>
          <div className="flex gap-8">
            <p>© 2026 MÖNAC Education. All rights reserved.</p>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
