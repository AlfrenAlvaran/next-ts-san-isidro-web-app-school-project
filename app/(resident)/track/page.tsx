"use client";
import { useMemo, useState } from "react";
import Loading from "@/components/Loading";
import { useRequests, RequestItem } from "@/hooks/useRequests";
import { STAGES } from "@/data";
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Copy,
  Check,
  Inbox,
  Eye,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";

type FilterKey = "all" | RequestItem["status"];

const STATUS_CONFIG: Record<
  RequestItem["status"],
  { label: string; icon: typeof Clock; className: string }
> = {
  submitted: {
    label: "Submitted",
    icon: FileText,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_review: {
    label: "In Review",
    icon: Eye,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approved: {
    label: "Approved",
    icon: ThumbsUp,
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  released: {
    label: "Released",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "pending", label: "Pending" },
  { key: "in_review", label: "In Review" },
  { key: "approved", label: "Approved" },
  { key: "released", label: "Released" },
  { key: "rejected", label: "Rejected" },
];

// Maps a status to how far along the 4-step STAGES track it should show.
// "stage" from the API already drives this in most cases, but rejected
// requests short-circuit the track regardless of numeric stage.
function isTerminalRejected(status: RequestItem["status"]) {
  return status === "rejected";
}

function StatusBadge({ status }: { status: RequestItem["status"] }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function StageTracker({
  stage,
  status,
}: {
  stage: number;
  status: RequestItem["status"];
}) {
  const isRejected = isTerminalRejected(status);
  return (
    <div className="flex items-center gap-1.5 w-full">
      {STAGES.map((label, i) => {
        const isDone = !isRejected && i <= stage;
        const isCurrent = !isRejected && i === stage;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isRejected
                    ? "bg-rose-300"
                    : isDone
                      ? isCurrent
                        ? "bg-[#B8860B] ring-4 ring-[#B8860B]/15"
                        : "bg-[#0F172A]"
                      : "bg-slate-200"
                }`}
              />
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
                  !isRejected && i < stage ? "bg-[#0F172A]" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CopyReference({ referenceNo }: { referenceNo: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(referenceNo);
    setCopied(true);
    toast.success("Reference copied");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
      title="Copy reference number"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
      {referenceNo}
    </button>
  );
}

const Page = () => {
  const { requests, loading } = useRequests();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<RequestItem | null>(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesFilter = filter === "all" || r.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.referenceNo.toLowerCase().includes(q) ||
        r.serviceTitle.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [requests, filter, query]);

  const counts = useMemo(() => {
    const base: Record<FilterKey, number> = {
      all: requests.length,
      submitted: 0,
      pending: 0,
      in_review: 0,
      approved: 0,
      released: 0,
      rejected: 0,
    };
    for (const r of requests) {
      base[r.status] += 1;
    }
    return base;
  }, [requests]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Header */}
      <section className="bg-[#0F172A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-8 relative">
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Track
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Requests
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Monitor the status of every certificate request you&apos;ve submitted.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 space-y-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by reference, service, or category…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30 focus:border-[#B8860B] transition-shadow"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? "bg-[#0F172A] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 ${
                    filter === f.key ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Inbox className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {requests.length === 0
                ? "No requests yet"
                : "No matching requests"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {requests.length === 0
                ? "Submit a certificate request to see it tracked here."
                : "Try a different search or filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(r);
                  }
                }}
                className="w-full text-left bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-all hover:shadow-sm group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">
                        {r.serviceTitle}
                      </p>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <CopyReference referenceNo={r.referenceNo} />
                      <span className="text-slate-300">·</span>
                      <p className="text-[11px] text-slate-400">{r.category}</p>
                      <span className="text-slate-300">·</span>
                      <p className="text-[11px] text-slate-400">
                        {r.submitted}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>

                <div className="mt-4">
                  <StageTracker stage={r.stage} status={r.status} />
                  <div className="flex justify-between mt-1.5">
                    {STAGES.map((label, i) => (
                      <span
                        key={label}
                        className={`text-[10px] ${
                          !isTerminalRejected(r.status) && i <= r.stage
                            ? "text-slate-600 font-medium"
                            : "text-slate-300"
                        } ${i === 0 ? "" : i === STAGES.length - 1 ? "text-right" : "text-center"}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail slide-over */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-[1px] animate-in fade-in duration-150"
            onClick={() => setSelected(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-105 bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                  Request details
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  {selected.serviceTitle}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <XCircle className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selected.status} />
                <CopyReference referenceNo={selected.referenceNo} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3">
                  Progress
                </p>
                <StageTracker stage={selected.stage} status={selected.status} />
                <div className="flex justify-between mt-1.5">
                  {STAGES.map((label, i) => (
                    <span
                      key={label}
                      className={`text-[10px] ${
                        !isTerminalRejected(selected.status) && i <= selected.stage
                          ? "text-slate-600 font-medium"
                          : "text-slate-300"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <dl className="space-y-3">
                {[
                  { label: "Category", value: selected.category },
                  { label: "Fee", value: selected.fee },
                  { label: "Purpose", value: selected.purpose },
                  { label: "Date submitted", value: selected.submitted },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0"
                  >
                    <dt className="text-xs text-slate-400 shrink-0">
                      {item.label}
                    </dt>
                    <dd className="text-xs font-medium text-slate-700 text-right">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {(selected.status === "pending" ||
                selected.status === "submitted" ||
                selected.status === "in_review" ||
                selected.status === "approved") && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3.5 flex gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your request is being reviewed. You&apos;ll receive an email once
                    it moves to the next stage.
                  </p>
                </div>
              )}
              {selected.status === "released" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3.5 flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    This certificate is ready. Visit the barangay office with a
                    valid ID to claim it.
                  </p>
                </div>
              )}
              {selected.status === "rejected" && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3.5 flex gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 leading-relaxed">
                    This request was rejected. Please contact the barangay
                    office for details or submit a new request.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;