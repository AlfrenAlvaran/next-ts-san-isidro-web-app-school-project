"use client";
import { Field, StatusPill } from "@/components/Shared";

import { RequestItem, useRequests } from "@/hooks/useRequests";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Eye,
  X,
  Check,
  Loader2,
  CreditCard,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  AlertTriangle,
  CalendarClock,
  ArrowUpDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { CERT_TYPES } from "@/constant";
import Link from "next/link";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Status → accent color used for the row's left rail and the resident avatar.
const STATUS_ACCENT: Record<string, string> = {
  submitted: "#94A3B8",
  pending: "#F59E0B",
  released: "#10B981",
  rejected: "#F43F5E",
};

function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Deterministic soft tint for an avatar background, derived from the name.
function avatarTint(name?: string | null) {
  const tints = [
    "bg-indigo-50 text-indigo-600",
    "bg-rose-50 text-rose-600",
    "bg-amber-50 text-amber-700",
    "bg-emerald-50 text-emerald-600",
    "bg-sky-50 text-sky-600",
    "bg-violet-50 text-violet-600",
  ];
  if (!name) return tints[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return tints[hash % tints.length];
}

function PaymentPill({ status }: { status: "unpaid" | "paid" | "free" }) {
  const config = {
    paid: {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-500",
    },
    unpaid: {
      label: "Unpaid",
      className: "bg-amber-50 text-amber-700 ring-amber-100",
      dot: "bg-amber-500",
    },
    free: {
      label: "Free",
      className: "bg-slate-50 text-slate-600 ring-slate-200",
      dot: "bg-slate-400",
    },
  } as const;

  const { label, className, dot } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 transition-colors ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  active,
  accent,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left bg-white rounded-xl border p-4 overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 ${
        active
          ? "border-slate-300 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_20px_-8px_rgba(15,23,42,0.18)]"
          : "border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-10px_rgba(15,23,42,0.15)]"
      }`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-[3px] transition-transform duration-200 origin-left ${accent} ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
      <div className="flex items-start justify-between">
        <p className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
          {value}
        </p>
        <Icon
          className={`w-4 h-4 mt-0.5 transition-colors ${
            active
              ? "text-slate-700"
              : "text-slate-300 group-hover:text-slate-400"
          }`}
        />
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </button>
  );
}

function StatusIcon({ status }: { status: string }) {
  const map: Record<string, { icon: React.ElementType; className: string }> = {
    submitted: { icon: Inbox, className: "text-slate-500" },
    pending: { icon: Clock, className: "text-amber-500" },
    released: { icon: CheckCircle2, className: "text-emerald-500" },
    rejected: { icon: XCircle, className: "text-rose-500" },
  };
  const entry = map[status];
  if (!entry) return null;
  const Icon = entry.icon;
  return <Icon className={`w-3.5 h-3.5 ${entry.className}`} />;
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
      <td className="px-5 py-4">
        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse shrink-0" />
          <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-5 py-4 hidden xl:table-cell">
        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <div className="h-3 w-14 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-12 bg-slate-100 rounded-full animate-pulse" />
      </td>
      <td className="px-5 py-4" />
    </tr>
  );
}

const RequestsPage = () => {
  const {
    requests,
    loading,
    updateStatus,
    markPayment,
    notifyOverdue,
    overdueCount,
  } = useRequests("admin");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<
    "pending" | "released" | "rejected" | "payment" | "overdue" | null
  >(null);

  // Fields for the "notify resident" form inside the overdue banner.
  const [revisedPickupDate, setRevisedPickupDate] = useState("");
  const [overdueMessage, setOverdueMessage] = useState("");

  const filters = ["all", "submitted", "pending", "released", "rejected"];

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, typeFilter, overdueOnly, sort, pageSize]);

  // Reset the notify-resident form whenever a different request is opened.
  useEffect(() => {
    setRevisedPickupDate("");
    setOverdueMessage("");
  }, [selected?.id]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selected && actionLoading === null) {
        setSelected(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, actionLoading]);

  async function handleUpdateStatus(
    id: string,
    status: "pending" | "released" | "rejected",
  ) {
    setActionLoading(status);
    try {
      const updated = await updateStatus(id, status);
      setSelected(null);
      toast.success(
        status === "pending"
          ? "Request approved — payment instructions emailed to the resident."
          : status === "released"
            ? "Certificate released."
            : "Request rejected.",
      );
      return updated;
    } catch {
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkPaid(id: string) {
    setActionLoading("payment");
    try {
      const updated = await markPayment(id, "paid");
      setSelected((prev) =>
        prev ? { ...prev, paymentStatus: updated } : prev,
      );
      toast.success("Marked as paid.");
    } catch {
      // markPayment already shows an error toast
    } finally {
      setActionLoading(null);
    }
  }

  // Emails + logs an apology to the resident with a new pickup date once
  // a request's original wished pickup date has passed.
  async function handleNotifyOverdue(id: string) {
    if (!revisedPickupDate) return;
    setActionLoading("overdue");
    try {
      const updated = await notifyOverdue(id, {
        revisedPickupDate: new Date(revisedPickupDate).toISOString(),
        message: overdueMessage.trim() || undefined,
      });
      setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
      setRevisedPickupDate("");
      setOverdueMessage("");
    } catch {
      // notifyOverdue already shows an error toast
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = useMemo(() => {
    let list = requests.filter((r) => {
      const matchesQuery =
        (r.residentName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        r.referenceNo.toLowerCase().includes(query.toLowerCase()) ||
        r.serviceTitle.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesType = typeFilter === "all" || r.serviceTitle === typeFilter;
      const matchesOverdue = !overdueOnly || r.isOverdue === true;
      return matchesQuery && matchesStatus && matchesType && matchesOverdue;
    });
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? new Date(b.submitted).getTime() - new Date(a.submitted).getTime()
        : new Date(a.submitted).getTime() - new Date(b.submitted).getTime(),
    );
    return list;
  }, [requests, query, statusFilter, typeFilter, overdueOnly, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const counts = {
    all: requests.length,
    submitted: requests.filter((r) => r.status === "submitted").length,
    pending: requests.filter((r) => r.status === "pending").length,
    released: requests.filter((r) => r.status === "released").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  function exportCsv() {
    const header = [
      "Reference",
      "Resident",
      "Certificate Type",
      "Purpose",
      "Submitted",
      "Wished Pickup Date",
      "Status",
      "Payment",
    ];
    const rows = filtered.map((r) => [
      r.referenceNo,
      r.residentName ?? "",
      r.serviceTitle,
      r.purpose,
      r.submitted,
      formatDate(r.pickupDate),
      r.status,
      r.paymentStatus,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "san-isidro-certificate-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
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
            Records
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Certificate Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review, approve, and issue resident certificate requests.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-lg transition-all hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2"
        >
          <FileText className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Total requests"
          value={counts.all}
          icon={LayoutGrid}
          active={statusFilter === "all" && !overdueOnly}
          accent="bg-[#0F172A]"
          onClick={() => {
            setStatusFilter("all");
            setOverdueOnly(false);
          }}
        />
        <KpiCard
          label="Newly submitted"
          value={counts.submitted}
          icon={Inbox}
          active={statusFilter === "submitted"}
          accent="bg-slate-400"
          onClick={() => setStatusFilter("submitted")}
        />
        <KpiCard
          label="Awaiting review"
          value={counts.pending}
          icon={Clock}
          active={statusFilter === "pending"}
          accent="bg-amber-400"
          onClick={() => setStatusFilter("pending")}
        />
        <KpiCard
          label="Released"
          value={counts.released}
          icon={CheckCircle2}
          active={statusFilter === "released"}
          accent="bg-emerald-400"
          onClick={() => setStatusFilter("released")}
        />
        <KpiCard
          label="Rejected"
          value={counts.rejected}
          icon={XCircle}
          active={statusFilter === "rejected"}
          accent="bg-rose-400"
          onClick={() => setStatusFilter("rejected")}
        />
        <KpiCard
          label="Overdue pickup"
          value={overdueCount}
          icon={AlertTriangle}
          active={overdueOnly}
          accent="bg-rose-500"
          onClick={() => setOverdueOnly((v) => !v)}
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit max-w-full shrink-0 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`relative px-3 py-1.5 rounded-md text-[12px] font-semibold capitalize transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] ${
                statusFilter === f
                  ? "bg-[#0F172A] text-white"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {f}
              {f !== "all" && counts[f as keyof typeof counts] > 0 && (
                <span
                  className={`ml-1.5 text-[10px] font-bold tabular-nums ${
                    statusFilter === f ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {counts[f as keyof typeof counts]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center shrink-0">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 transition-colors focus-within:border-slate-400">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resident, reference, certificate…"
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
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 transition-colors hover:border-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-[13px] text-slate-700 outline-none bg-transparent"
            >
              <option value="all">All certificate types</option>
              {CERT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 sticky top-0 z-10">
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3">
                  Reference
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3">
                  Resident
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3 hidden md:table-cell">
                  Certificate
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3 hidden xl:table-cell">
                  Purpose
                </th>
                <th className="px-3 sm:px-5 py-3 hidden lg:table-cell">
                  <button
                    onClick={() =>
                      setSort((s) => (s === "newest" ? "oldest" : "newest"))
                    }
                    className="group inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wide hover:text-slate-600 transition-colors focus-visible:outline-none"
                  >
                    Submitted
                    <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3 hidden lg:table-cell">
                  Wished pickup
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-3 sm:px-5 py-3">
                  Payment
                </th>
                <th className="px-3 sm:px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
              {!loading &&
                paginated.map((r, i) => {
                  const accent = STATUS_ACCENT[r.status] ?? "#CBD5E1";
                  const isHovered = hoveredRow === r.id;
                  return (
                    <tr
                      key={r.id}
                      style={{
                        animation: `rowIn 0.25s ease-out ${Math.min(i, 8) * 0.03}s both`,
                        boxShadow: isHovered
                          ? "inset 3px 0 0 0 var(--row-accent)"
                          : "inset 2px 0 0 0 transparent",
                        // @ts-ignore custom property for the inset accent above
                        "--row-accent": accent,
                      }}
                      className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-[background-color,box-shadow] duration-150 cursor-pointer active:bg-slate-100/70"
                      onClick={() => setSelected(r)}
                      onMouseEnter={() => setHoveredRow(r.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-3 sm:px-5 py-3.5 text-xs font-bold text-slate-400 tabular-nums whitespace-nowrap">
                        {r.referenceNo}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarTint(
                              r.residentName,
                            )}`}
                          >
                            {initials(r.residentName)}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {r.residentName ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-slate-500 hidden md:table-cell whitespace-nowrap">
                        {r.serviceTitle}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-slate-500 hidden xl:table-cell max-w-[220px] truncate">
                        {r.purpose}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                        {r.submitted}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-xs hidden lg:table-cell whitespace-nowrap">
                        {r.isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            {formatDate(r.pickupDate)}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {formatDate(r.pickupDate)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="inline-flex items-center gap-1.5">
                          <StatusIcon status={r.status} />
                          <StatusPill status={r.status} />
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3.5">
                        {r.status === "pending" || r.status === "released" ? (
                          <PaymentPill status={r.paymentStatus} />
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150">
                          <button
                            className="w-7 h-7 rounded-md hover:bg-slate-200/70 inline-flex items-center justify-center"
                            aria-label="View request"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                          <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400">
                        No requests match your filters.
                      </p>
                      {(query ||
                        statusFilter !== "all" ||
                        typeFilter !== "all" ||
                        overdueOnly) && (
                        <button
                          onClick={() => {
                            setQuery("");
                            setStatusFilter("all");
                            setTypeFilter("all");
                            setOverdueOnly(false);
                          }}
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
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400">
            {filtered.length === 0
              ? "No requests"
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
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onChange={setPage}
        />
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">
                  {selected.referenceNo}
                </p>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selected.serviceTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setActionLoading(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
                aria-label="Close details"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="relative rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-dashed border-slate-300" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-dashed border-slate-300" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Request Stub
                  </span>
                  <StatusPill status={selected.status} />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {selected.residentName ?? "Unknown"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Purpose: {selected.purpose}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-400">
                    Submitted {selected.submitted}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      selected.isOverdue ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    <CalendarClock className="w-3.5 h-3.5" />
                    Wished pickup: {formatDate(selected.pickupDate)}
                  </span>
                </div>
              </div>

              {/* Overdue pickup — apologize + collect a revised date, emails + logs an in-portal notice */}
              {selected.isOverdue && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <p className="text-sm font-bold text-rose-700">
                      Past the resident's wished pickup date
                    </p>
                  </div>
                  <p className="text-xs text-rose-600">
                    They wished to pick this up on{" "}
                    {formatDate(selected.pickupDate)}. Give them a new date —
                    we'll email an apology and show it in their portal.
                  </p>

                  {selected.overdueNotice?.notified && (
                    <p className="text-[11px] text-rose-600 bg-white/70 rounded-md px-2.5 py-1.5">
                      Last notified{" "}
                      {formatDate(selected.overdueNotice.notifiedAt)} · new date
                      given:{" "}
                      {formatDate(selected.overdueNotice.revisedPickupDate)}
                    </p>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-rose-700">
                      New pickup date
                    </label>
                    <input
                      type="date"
                      value={revisedPickupDate}
                      onChange={(e) => setRevisedPickupDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors"
                    />
                    <textarea
                      value={overdueMessage}
                      onChange={(e) => setOverdueMessage(e.target.value)}
                      placeholder="Optional note (defaults to a standard apology with the new date)"
                      rows={2}
                      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-rose-300 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors resize-none"
                    />
                    <button
                      onClick={() => handleNotifyOverdue(selected.id)}
                      disabled={!revisedPickupDate || actionLoading !== null}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {actionLoading === "overdue" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      {actionLoading === "overdue"
                        ? "Notifying…"
                        : "Notify resident"}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment status — only relevant once approved */}
              {(selected.status === "pending" ||
                selected.status === "released") && (
                <div className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Payment status</p>
                        <p
                          className={`text-sm font-bold ${
                            selected.paymentStatus === "paid"
                              ? "text-emerald-600"
                              : selected.paymentStatus === "free"
                                ? "text-slate-500"
                                : "text-amber-600"
                          }`}
                        >
                          {selected.paymentStatus === "paid"
                            ? "Paid"
                            : selected.paymentStatus === "free"
                              ? "Free — no payment required"
                              : "Unpaid"}
                        </p>
                      </div>
                    </div>
                    {selected.paymentStatus === "unpaid" && (
                      <button
                        onClick={() => handleMarkPaid(selected.id)}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 underline disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === "payment" && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                        Mark as paid (in person)
                      </button>
                    )}
                  </div>
                  {selected.paymentLink &&
                    selected.paymentStatus === "unpaid" && (
                      <Link
                        href={selected.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#B8860B] hover:underline"
                      >
                        View online payment link
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    )}
                </div>
              )}

              <div className="space-y-3">
                <Field
                  label="Requesting resident"
                  value={selected.residentName ?? "Unknown"}
                />
                <Field label="Certificate type" value={selected.serviceTitle} />
                <Field label="Stated purpose" value={selected.purpose} />
                <Field label="Date submitted" value={selected.submitted} />
                <Field
                  label="Wished pickup date"
                  value={formatDate(selected.pickupDate)}
                />
                <Field label="Reference number" value={selected.referenceNo} />
              </div>
            </div>
            <div className="px-6 py-5 border-t border-slate-100 flex flex-col gap-3">
              {selected.status === "submitted" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selected.id, "rejected")}
                    disabled={actionLoading !== null}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {actionLoading === "rejected" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {actionLoading === "rejected" ? "Rejecting…" : "Reject"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selected.id, "pending")}
                    disabled={actionLoading !== null}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {actionLoading === "pending" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {actionLoading === "pending" ? "Approving…" : "Approve"}
                  </button>
                </div>
              )}

              {selected.status === "pending" && (
                <>
                  {selected.paymentStatus === "unpaid" && (
                    <p className="text-[11px] text-amber-600 bg-amber-50 rounded-md px-3 py-2 ring-1 ring-amber-100">
                      Payment is still unpaid. You can release anyway for
                      waived/exempted cases.
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selected.id, "rejected")
                      }
                      disabled={actionLoading !== null}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {actionLoading === "rejected" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {actionLoading === "rejected" ? "Rejecting…" : "Reject"}
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selected.id, "released")
                      }
                      disabled={actionLoading !== null}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] ${
                        selected.paymentStatus === "unpaid"
                          ? "bg-white border border-amber-300 text-amber-700 hover:bg-amber-50"
                          : "bg-[#0F172A] hover:bg-[#B8860B] text-white"
                      }`}
                    >
                      {actionLoading === "released" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {actionLoading === "released"
                        ? "Releasing…"
                        : selected.paymentStatus === "unpaid"
                          ? "Release anyway"
                          : "Release"}
                    </button>
                  </div>
                </>
              )}

              {(selected.status === "released" ||
                selected.status === "rejected") && (
                <button
                  onClick={() => setSelected(null)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors active:scale-[0.98]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;