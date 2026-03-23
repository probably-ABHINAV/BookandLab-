"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: create account via Stack Auth + create user in Supabase
    // For MVP: set cookies and redirect
    document.cookie = `user_id=demo-${role}-id; path=/; max-age=86400`;
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    window.location.href = `/${role}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 to-navy-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-3xl font-bold">BookandLab</span>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">
            Start your learning journey today
          </h1>
          <p className="text-lg text-white/70">
            Join thousands of students improving their skills through structured
            learning, mentor feedback, and progress tracking.
          </p>
          <div className="mt-12 space-y-4">
            {["6-step learning methodology", "Personal mentor feedback", "Streak & goal tracking", "Skill analytics dashboard"].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-400/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-400 rounded-full" />
                </div>
                <span className="text-sm text-white/80">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold">BookandLab</span>
          </div>

          <h2 className="font-heading text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-navy-600 mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 font-semibold hover:underline">
              Log In
            </Link>
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["student", "mentor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all border-2 ${
                      role === r
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-cream-200 bg-white text-navy-600 hover:border-cream-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full justify-center !py-3 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-xs text-navy-600 text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
