"use client";
import { Field, StatusPill } from "@/components/Shared";

import { RequestItem, useRequests } from "@/hooks/useRequests";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  Eye,
  X,
  Check,
} from "lucide-react";
import { CERT_TYPES } from "@/constant";

const RequestsPage = () => {
  const { requests, loading, updateStatus } = useRequests("admin");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<RequestItem | null>(null);

  const filters = ["all", "pending", "released", "rejected"];

  async function handleUpdateStatus(
    id: string,
    status: "released" | "rejected"
  ) {
    try {
      await updateStatus(id, status);
      setSelected(null);
      toast.success(
        status === "released"
          ? "Certificate approved and queued for release."
          : "Request rejected."
      );
    } catch {
      // updateStatus already shows an error toast on failure
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
      return matchesQuery && matchesStatus && matchesType;
    });
    list = [...list].sort((a, b) =>
      sort === "newest"
        ? new Date(b.submitted).getTime() - new Date(a.submitted).getTime()
        : new Date(a.submitted).getTime() - new Date(b.submitted).getTime(),
    );
    return list;
  }, [requests, query, statusFilter, typeFilter, sort]);

  const counts = {
    all: requests.length,
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
      "Status",
    ];
    const rows = filtered.map((r) => [
      r.referenceNo,
      r.residentName ?? "",
      r.serviceTitle,
      r.purpose,
      r.submitted,
      r.status,
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
  }

  return (
    <div className="space-y-6">
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
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "all" ? "border-[#0F172A]" : "border-slate-200 hover:border-slate-300"}`}
        >
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">
            {counts.all}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Total requests</p>
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "pending" ? "border-amber-400" : "border-slate-200 hover:border-slate-300"}`}
        >
          <p className="text-xl font-extrabold text-amber-600 tabular-nums">
            {counts.pending}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting review</p>
        </button>
        <button
          onClick={() => setStatusFilter("released")}
          className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "released" ? "border-emerald-400" : "border-slate-200 hover:border-slate-300"}`}
        >
          <p className="text-xl font-extrabold text-emerald-600 tabular-nums">
            {counts.released}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Released</p>
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "rejected" ? "border-rose-400" : "border-slate-200 hover:border-slate-300"}`}
        >
          <p className="text-xl font-extrabold text-rose-600 tabular-nums">
            {counts.rejected}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Rejected</p>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold capitalize transition-colors ${
                statusFilter === f
                  ? "bg-[#0F172A] text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resident, reference, certificate…"
              className="text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
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
          <button
            onClick={() =>
              setSort((s) => (s === "newest" ? "oldest" : "newest"))
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-600 font-medium hover:border-slate-300 transition-colors"
          >
            {sort === "newest" ? "Newest first" : "Oldest first"}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Reference
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Resident
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                Certificate
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden xl:table-cell">
                Purpose
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">
                Submitted
              </th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
                  Loading requests…
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
                    {r.referenceNo}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {r.residentName ?? "Unknown"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                    {r.serviceTitle}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden xl:table-cell">
                    {r.purpose}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">
                    {r.submitted}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={r.status} />
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
                  colSpan={7}
                  className="px-5 py-16 text-center text-sm text-slate-400"
                >
                  No requests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {requests.length} requests
      </p>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
            <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

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
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
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
                <p className="text-xs text-slate-400 mt-3">
                  Submitted {selected.submitted}
                </p>
              </div>

              <div className="space-y-3">
                <Field
                  label="Requesting resident"
                  value={selected.residentName ?? "Unknown"}
                />
                <Field label="Certificate type" value={selected.serviceTitle} />
                <Field label="Stated purpose" value={selected.purpose} />
                <Field label="Date submitted" value={selected.submitted} />
                <Field label="Reference number" value={selected.referenceNo} />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
              {selected.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selected.id, "rejected")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selected.id, "released")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelected(null)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
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