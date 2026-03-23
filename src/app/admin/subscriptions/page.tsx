"use client";

import { useState } from "react";
import { CreditCard, Search } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const [userId, setUserId] = useState("");

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="font-heading text-3xl font-bold">Subscriptions</h1>

      <div className="card max-w-lg">
        <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-500" />
          Manage Subscription
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Enter User ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
                placeholder="User ID..."
              />
            </div>
          </div>
          <p className="text-xs text-navy-600">
            Navigate to the Users page, find the user, then use their ID to manage their subscription here.
          </p>
        </div>
      </div>
    </div>
  );
}
