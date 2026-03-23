"use client";
import { User, Settings, Bell, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="font-heading text-3xl font-bold">Profile</h1>
      <div className="card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">Student</h2>
            <p className="text-sm text-navy-600">student@bookandlab.com</p>
          </div>
        </div>
        <div className="space-y-4 border-t border-cream-200 pt-6">
          {[
            { icon: Settings, label: "Account Settings", desc: "Update your name and email" },
            { icon: Bell, label: "Notification Preferences", desc: "Manage how you receive updates" },
            { icon: Shield, label: "Privacy & Security", desc: "Password and security settings" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-cream-50 transition-colors text-left">
              <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-navy-600">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
