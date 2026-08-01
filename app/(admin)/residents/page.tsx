"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { KPICard, Field } from "@/components/Shared";
import { useResidents, ResidentItem } from "@/hooks/useResidents";

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const add = (p: number) => pages.push(p);
  const spread = 1;

  add(1);
  if (page - spread > 2) pages.push("ellipsis");
  for (
    let p = Math.max(2, page - spread);
    p <= Math.min(pageCount - 1, page + spread);
    p++
  ) {
    add(p);
  }
  if (page + spread < pageCount - 1) pages.push("ellipsis");
  if (pageCount > 1) add(pageCount);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="w-8 h-8 inline-flex items-center justify-center text-slate-300"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`w-8 h-8 inline-flex items-center justify-center rounded-lg text-[12px] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] ${
              p === page
                ? "bg-[#0F172A] text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
        className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="px-5 py-4" colSpan={9}>
        <div className="h-3.5 w-full max-w-md bg-slate-100 rounded animate-pulse" />
      </td>
    </tr>
  );
}

function VerificationPill({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Unverified
    </span>
  );
}

function ApprovalPill({ approved }: { approved: boolean }) {
  return approved ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
      Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Pending
    </span>
  );
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
  const [query, setQuery] = useState("");
  const [purokFilter, setPurokFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
  const [selected, setSelected] = useState<ResidentItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [query, purokFilter, verifyFilter, approvalFilter, pageSize]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selected && !decisionLoading) {
        setSelected(null);
        setShowRejectBox(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, decisionLoading]);

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters =
    query || purokFilter !== "all" || verifyFilter !== "all" || approvalFilter !== "all";

  function clearFilters() {
    setQuery("");
    setPurokFilter("all");
    setVerifyFilter("all");
    setApprovalFilter("all");
  }

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes rowIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

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
          className={`text-left rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 ${
            approvalFilter === "pending"
              ? "ring-2 ring-rose-400 ring-offset-2 ring-offset-white rounded-xl"
              : "hover:-translate-y-0.5"
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
          <div key={p.purok} className="group">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-700">{p.purok}</span>
              <span className="text-slate-400">
                {p.residents.toLocaleString()} residents · {p.households}{" "}
                households
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0F172A] to-[#B8860B] transition-all duration-500 ease-out group-hover:brightness-110"
                style={{ width: `${(p.residents / maxResidents) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3 flex-wrap shrink-0">
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
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] ${
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
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 transition-colors focus-within:border-slate-400">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ID number, household…"
              className="text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-slate-300 hover:text-slate-500 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={purokFilter}
            onChange={(e) => setPurokFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#B8860B]"
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
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#B8860B]"
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
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[#B8860B]"
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
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
            {!loading &&
              paginated.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    animation: `rowIn 0.25s ease-out ${Math.min(i, 8) * 0.03}s both`,
                  }}
                  className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors cursor-pointer"
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
                    <VerificationPill verified={r.isVerified} />
                  </td>
                  <td className="px-5 py-3.5">
                    <ApprovalPill approved={r.isApproved} />
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
                    <button
                      className="w-7 h-7 rounded-md hover:bg-slate-200/70 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="View resident"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-16 text-center">
                  <div className="inline-flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                      <Search className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">
                      No residents match your filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-semibold text-[#B8860B] hover:underline mt-1"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400">
            {filtered.length === 0
              ? "No residents"
              : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  filtered.length,
                )} of ${filtered.length}`}
          </p>
          <div className="flex items-center gap-1.5">
            <label htmlFor="pageSize" className="text-xs text-slate-400">
              Rows
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="text-xs text-slate-600 font-medium bg-white border border-slate-200 rounded-md px-1.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
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
                onClick={() => {
                  setSelected(null);
                  setShowRejectBox(false);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
                aria-label="Close details"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] font-bold text-lg shrink-0 overflow-hidden ring-2 ring-white shadow-sm">
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
                    <VerificationPill verified={selected.isVerified} />
                    {selected.isApproved ? (
                      <ApprovalPill approved />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
                  <div className="rounded-xl border border-slate-200 overflow-hidden transition-colors hover:border-slate-300">
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
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none resize-none transition-colors focus:border-slate-400"
                  rows={3}
                />
              )}
              <div className="flex gap-3">
                {!selected.isApproved && (
                  <>
                    <button
                      onClick={() => handleDecision("approve")}
                      disabled={decisionLoading}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 active:scale-[0.98]"
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
                      className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 active:scale-[0.98]"
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
                  onClick={() => {
                    setSelected(null);
                    setShowRejectBox(false);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors active:scale-[0.98]"
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