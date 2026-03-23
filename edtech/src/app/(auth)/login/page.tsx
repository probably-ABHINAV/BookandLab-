"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // For MVP: demo login sets cookies and redirects based on role
  const handleDemoLogin = async (role: "student" | "mentor" | "admin") => {
    setLoading(true);
    // Set demo cookies
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `user_id=demo-${role}-id; path=/; max-age=86400`;
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/${role}/dashboard`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // In production: authenticate via Stack Auth
    // For MVP: use demo login
    setError("Use the demo login buttons below to test the platform.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400 to-primary-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/30 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/30 rounded-full translate-y-20 -translate-x-20" />
        <div className="relative z-10 text-navy-900 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-heading text-3xl font-bold">BookandLab</span>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">
            Welcome back to your learning journey
          </h1>
          <p className="text-lg opacity-80">
            Continue building skills with our 6-step methodology, track your
            streaks, and get mentor feedback.
          </p>
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

          <h2 className="font-heading text-3xl font-bold mb-2">Log In</h2>
          <p className="text-navy-600 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary-500 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                placeholder="you@example.com"
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
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition pr-12"
                  placeholder="••••••••"
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

            {error && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full justify-center !py-3"
            >
              {loading ? "Logging in..." : "Log In"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream-50 text-navy-600">
                  Or try a demo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {(["student", "mentor", "admin"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  disabled={loading}
                  className="btn-pill btn-outline justify-center text-sm !py-2.5 capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
