"use client";
import React from "react";
import Link from "next/link";
import { Clock, FileText, Users, Megaphone, Stamp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useRequests } from "@/hooks/useRequests";
import { useResidents } from "@/hooks/useResidents";
import { KPICard } from "@/components/Shared";

export default function OverviewPage() {
  const {
    pendingCount,
    pendingToday,
    releasedCount,
    releasedThisWeekChange,
    weeklySeries,
    weekOverWeekChange,
    recent,
    loading: requestsLoading,
  } = useRequests("admin");

  const {
    totalCount: residentsCount,
    deltaPct: residentsDelta,
    loading: residentsLoading,
    error: residentsError,
  } = useResidents();

  const wowPositive = weekOverWeekChange >= 0;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Magandang araw, Kapitana.</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening in Barangay San Isidro today.</p>
        </div>
        <Link
          href="/certificate-requests"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Stamp className="w-4 h-4" /> Review pending requests
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Pending requests"
          value={pendingCount}
          delta={`+${pendingToday} today`}
          positive={false}
          icon={Clock}
        />
        <KPICard
          label="Released this week"
          value={releasedCount}
          delta={`${releasedThisWeekChange >= 0 ? "+" : ""}${releasedThisWeekChange}%`}
          positive={releasedThisWeekChange >= 0}
          icon={FileText}
        />
        <KPICard
          label="Registered residents"
          value={
            residentsError
              ? "—"
              : residentsLoading
              ? "…"
              : (residentsCount ?? 0).toLocaleString()
          }
          delta={
            residentsError
              ? "Failed to load"
              : `${residentsDelta >= 0 ? "+" : ""}${residentsDelta}%`
          }
          positive={!residentsError && residentsDelta >= 0}
          icon={Users}
        />
        {/* Placeholder until a Notice/Announcement model exists */}
        <KPICard
          label="Published notices"
          value="—"
          delta="Not tracked yet"
          positive
          icon={Megaphone}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Requests received</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                wowPositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
              }`}
            >
              {wowPositive ? "+" : ""}
              {weekOverWeekChange}% vs prior week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklySeries} margin={{ left: -20, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8860B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                labelStyle={{ color: "#0F172A", fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="requests" stroke="#0F172A" strokeWidth={2} fill="url(#reqFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Recent activity</h3>
          <p className="text-xs text-slate-400 mb-5">Latest submissions</p>
          <div className="space-y-4">
            {requestsLoading && <p className="text-xs text-slate-400">Loading…</p>}
            {!requestsLoading && recent.length === 0 && (
              <p className="text-xs text-slate-400">No requests yet.</p>
            )}
            {recent.map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {r.residentName ?? r.serviceTitle}
                  </p>
                  <p className="text-[11px] text-slate-400">{r.serviceTitle}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/certificate-requests" className="w-full block mt-5 text-xs font-semibold text-[#B8860B] hover:text-[#0F172A] transition-colors">
            View all requests →
          </Link>
        </div>
      </div>
    </div>
  );
}