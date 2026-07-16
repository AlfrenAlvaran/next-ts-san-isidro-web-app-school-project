"use client";
import React, { useState, useMemo } from "react";
import { Search, Users, LayoutGrid, ShieldCheck, ShieldAlert, Eye, X } from "lucide-react";
import { KPICard, Field } from "@/components/Shared";
import { useResidents, ResidentItem } from "@/hooks/useResidents";

export default function ResidentsPage() {
  const {
    residents,
    loading,
    error,
    totalCount,
    verifiedCount,
    unverifiedCount,
    deltaPct,
    byPurok,
    totalHouseholds,
  } = useResidents();

  const [query, setQuery] = useState("");
  const [purokFilter, setPurokFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState<"all" | "verified" | "unverified">("all");
  const [selected, setSelected] = useState<ResidentItem | null>(null);

  const maxResidents = Math.max(1, ...byPurok.map((p) => p.residents));
  const puroks = ["all", ...byPurok.map((p) => p.purok)];

  const filtered = useMemo(() => {
    return residents.filter((r) => {
      const matchesQuery =
        r.fullName.toLowerCase().includes(query.toLowerCase()) ||
        (r.idNumber ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (r.householdNo ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesPurok = purokFilter === "all" || r.purok === purokFilter;
      const matchesVerify =
        verifyFilter === "all" ||
        (verifyFilter === "verified" && r.isVerified) ||
        (verifyFilter === "unverified" && !r.isVerified);
      return matchesQuery && matchesPurok && matchesVerify;
    });
  }, [residents, query, purokFilter, verifyFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Population</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Residents</h1>
          <p className="text-slate-500 text-sm mt-1">
            {error
              ? "Failed to load residents."
              : `${totalCount.toLocaleString()} registered residents across ${byPurok.length} puroks.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total residents"
          value={totalCount.toLocaleString()}
          delta={`${deltaPct >= 0 ? "+" : ""}${deltaPct}%`}
          positive={deltaPct >= 0}
          icon={Users}
        />
        <KPICard
          label="Households"
          value={totalHouseholds.toLocaleString()}
          delta="on record"
          positive
          icon={LayoutGrid}
        />
        <KPICard
          label="Verified accounts"
          value={verifiedCount}
          delta="in directory"
          positive
          icon={ShieldCheck}
        />
        <KPICard
          label="Unverified accounts"
          value={unverifiedCount}
          delta="needs action"
          positive={false}
          icon={ShieldAlert}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Distribution by purok</h3>
          <p className="text-xs text-slate-400 mt-0.5">Share of total population</p>
        </div>
        {byPurok.length === 0 && (
          <p className="text-xs text-slate-400">No residents on record yet.</p>
        )}
        {byPurok.map((p) => (
          <div key={p.purok}>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-700">{p.purok}</span>
              <span className="text-slate-400">
                {p.residents.toLocaleString()} residents · {p.households} households
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0F172A] to-[#B8860B]"
                style={{ width: `${(p.residents / maxResidents) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <h3 className="text-sm font-bold text-slate-900">Resident directory</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ID number, household…"
              className="text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
          <select
            value={purokFilter}
            onChange={(e) => setPurokFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none"
          >
            {puroks.map((p) => (
              <option key={p} value={p}>{p === "all" ? "All puroks" : p}</option>
            ))}
          </select>
          <select
            value={verifyFilter}
            onChange={(e) => setVerifyFilter(e.target.value as "all" | "verified" | "unverified")}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none"
          >
            <option value="all">All accounts</option>
            <option value="verified">Verified only</option>
            <option value="unverified">Unverified only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">ID No.</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Name</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Purok</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Household</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden xl:table-cell">Age</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Verification</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                  Loading residents…
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-400 tabular-nums">
                    {r.idNumber ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{r.fullName}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{r.purok ?? "—"}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{r.householdNo ?? "—"}</td>
                  <td className="px-5 py-3.5 text-slate-500 hidden xl:table-cell tabular-nums">{r.age ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    {r.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="w-7 h-7 rounded-md hover:bg-slate-100 inline-flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                  No residents match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {residents.length} residents</p>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">
                  {selected.idNumber ?? "No ID number"}
                </p>
                <h3 className="text-lg font-extrabold text-slate-900">{selected.fullName}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] font-bold text-lg shrink-0 overflow-hidden">
                  {selected.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selected.avatarUrl} alt={selected.fullName} className="w-full h-full object-cover" />
                  ) : (
                    selected.fullName.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selected.fullName}</p>
                  <p className="text-xs text-slate-500">{selected.purok ?? "No purok"} · {selected.householdNo ?? "No household no."}</p>
                  <div className="mt-2">
                    {selected.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Field label="Age" value={selected.age?.toString() ?? "Not set"} />
                <Field label="Sex" value={selected.sex ?? "Not set"} />
                <Field label="Civil status" value={selected.civilStatus ?? "Not set"} />
                <Field label="Address" value={selected.address ?? "Not set"} />
                <Field label="Purok" value={selected.purok ?? "Not set"} />
                <Field label="Household no." value={selected.householdNo ?? "Not set"} />
                <Field label="Email" value={selected.email} />
                <Field label="Contact number" value={selected.phone} />
                <Field label="Member since" value={selected.memberSince ?? "Not set"} />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100">
              <button
                onClick={() => setSelected(null)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}