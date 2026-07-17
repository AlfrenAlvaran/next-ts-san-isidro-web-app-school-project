"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  LayoutGrid,
  ShieldCheck,
  ShieldAlert,
  Eye,
  X,
  UserCheck,
  UserX,
  FileText,
  ExternalLink,
} from "lucide-react";
import { KPICard, Field } from "@/components/Shared";
import { useResidents, ResidentItem } from "@/hooks/useResidents";

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export default function ResidentsPage() {
  const {
    residents,
    loading,
    error,
    totalCount,
    approvedCount,
    pendingApprovalCount,
    verifiedCount,
    unverifiedCount,
    deltaPct,
    byPurok,
    totalHouseholds,
    decideResident,
    mutate,
  } = useResidents();

  const [decisionLoading, setDecisionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  async function handleDecision(action: "approve" | "reject") {
    if (!selected) return;
    setDecisionLoading(true);
    try {
      await decideResident(
        selected.userId,
        action,
        action === "reject" ? rejectReason : undefined,
      );
      await mutate();
      setSelected(null);
      setShowRejectBox(false);
      setRejectReason("");
    } catch (e) {
      console.error(e);
      alert("Something went wrong sending the decision. Please try again.");
    } finally {
      setDecisionLoading(false);
    }
  }
  const [query, setQuery] = useState("");
  const [purokFilter, setPurokFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
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
      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" && r.isApproved) ||
        (approvalFilter === "pending" && !r.isApproved);
      return matchesQuery && matchesPurok && matchesVerify && matchesApproval;
    });
  }, [residents, query, purokFilter, verifyFilter, approvalFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Population
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Residents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {error
              ? "Failed to load residents."
              : `${totalCount.toLocaleString()} registered residents across ${byPurok.length} puroks.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
        <KPICard
          label="Approved by admin"
          value={approvedCount}
          delta="cleared"
          positive
          icon={UserCheck}
        />
        <button
          type="button"
          onClick={() =>
            setApprovalFilter((prev) =>
              prev === "pending" ? "all" : "pending",
            )
          }
          className={`text-left rounded-xl transition-shadow ${
            approvalFilter === "pending"
              ? "ring-2 ring-rose-400 ring-offset-2 ring-offset-white rounded-xl"
              : ""
          }`}
        >
          <KPICard
            label="Pending approval"
            value={pendingApprovalCount}
            delta="needs review"
            positive={false}
            icon={UserX}
          />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Distribution by purok
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Share of total population
          </p>
        </div>
        {byPurok.length === 0 && (
          <p className="text-xs text-slate-400">No residents on record yet.</p>
        )}
        {byPurok.map((p) => (
          <div key={p.purok}>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-700">{p.purok}</span>
              <span className="text-slate-400">
                {p.residents.toLocaleString()} residents · {p.households}{" "}
                households
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
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-slate-900">
            Resident directory
          </h3>
          <button
            type="button"
            onClick={() =>
              setApprovalFilter((prev) =>
                prev === "pending" ? "all" : "pending",
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              approvalFilter === "pending"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
            }`}
          >
            <UserX className="w-3 h-3" />
            {approvalFilter === "pending"
              ? "Showing pending only ×"
              : `Pending approval (${pendingApprovalCount})`}
          </button>
        </div>
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
              <option key={p} value={p}>
                {p === "all" ? "All puroks" : p}
              </option>
            ))}
          </select>
          <select
            value={verifyFilter}
            onChange={(e) =>
              setVerifyFilter(
                e.target.value as "all" | "verified" | "unverified",
              )
            }
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none"
          >
            <option value="all">All accounts</option>
            <option value="verified">Verified only</option>
            <option value="unverified">Unverified only</option>
          </select>
          <select
            value={approvalFilter}
            onChange={(e) =>
              setApprovalFilter(
                e.target.value as "all" | "approved" | "pending",
              )
            }
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none"
          >
            <option value="all">All approval statuses</option>
            <option value="approved">Approved only</option>
            <option value="pending">Pending approval</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                ID No.
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Name
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                Purok
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">
                Household
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden xl:table-cell">
                Age
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Verification
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Approval
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                Document
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
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
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    <span className="flex items-center gap-2">
                      {r.fullName}
                      {!r.hasProfile && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-400">
                          No profile
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    {r.purok ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">
                    {r.householdNo ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden xl:table-cell tabular-nums">
                    {r.age ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {r.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {r.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />{" "}
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                        Pending
                      </span>
                    )}
                  </td>
                  <td
                    className="px-5 py-3.5 hidden md:table-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.documentUrl ? (
                      <a
                        href={r.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-[#B8860B] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-300">—</span>
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
                <td
                  colSpan={9}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
                  No residents match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {residents.length} residents
      </p>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">
                  {selected.idNumber ?? "No ID number"}
                </p>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selected.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] font-bold text-lg shrink-0 overflow-hidden">
                  {selected.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.avatarUrl}
                      alt={selected.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selected.fullName.slice(0, 1)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {selected.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selected.purok ?? "No purok"} ·{" "}
                    {selected.householdNo ?? "No household no."}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                        Unverified
                      </span>
                    )}
                    {selected.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />{" "}
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{" "}
                        Pending approval
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Field
                  label="Age"
                  value={selected.age?.toString() ?? "Not set"}
                />
                <Field label="Sex" value={selected.sex ?? "Not set"} />
                <Field
                  label="Civil status"
                  value={selected.civilStatus ?? "Not set"}
                />
                <Field label="Address" value={selected.address ?? "Not set"} />
                <Field label="Purok" value={selected.purok ?? "Not set"} />
                <Field
                  label="Household no."
                  value={selected.householdNo ?? "Not set"}
                />
                <Field label="Email" value={selected.email} />
                <Field label="Contact number" value={selected.phone} />
                <Field
                  label="Member since"
                  value={selected.memberSince ?? "Not set"}
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Submitted document
                </p>
                {selected.documentUrl ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    {isImageUrl(selected.documentUrl) ? (
                      <a
                        href={selected.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selected.documentUrl}
                          alt={`${selected.fullName} submitted document`}
                          className="w-full max-h-64 object-cover bg-slate-100"
                        />
                      </a>
                    ) : null}
                    <a
                      href={selected.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <FileText className="w-4 h-4 text-slate-400" />
                        View submitted document
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No document submitted.
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 space-y-3">
              {showRejectBox && (
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Optional reason to include in the email…"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none resize-none"
                  rows={3}
                />
              )}
              <div className="flex gap-3">
                {!selected.isApproved && (
                  <>
                    <button
                      onClick={() => handleDecision("approve")}
                      disabled={decisionLoading}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {decisionLoading ? "Sending…" : "Approve"}
                    </button>
                    <button
                      onClick={() =>
                        showRejectBox
                          ? handleDecision("reject")
                          : setShowRejectBox(true)
                      }
                      disabled={decisionLoading}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
                    >
                      {showRejectBox
                        ? decisionLoading
                          ? "Sending…"
                          : "Confirm reject"
                        : "Reject"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
