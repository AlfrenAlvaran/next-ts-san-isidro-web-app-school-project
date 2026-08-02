"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Stamp,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlusCircle,
  AlertTriangle,
  Copy,
  CopyCheck,
  RefreshCcw,
} from "lucide-react";
import Header from "@/components/Header";
import { services, ServiceChild } from "@/data";
import axios from "axios";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- date helpers ---------- */

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function formatLong(d: Date) {
  return d.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------- steps ---------- */

type Step = "select" | "details" | "pickup" | "confirmed";
const stepOrder: Step[] = ["select", "details", "pickup", "confirmed"];
const stepLabels: Record<Step, string> = {
  select: "Certificate",
  details: "Details",
  pickup: "Pickup",
  confirmed: "Done",
};

export default function RequestPage() {
  const [step, setStep] = useState<Step>("select");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selectedType, setSelectedType] = useState<ServiceChild | null>(null);
  const [purpose, setPurpose] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [submitting, setSubmitting] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [copied, setCopied] = useState(false);

  // Error state for the submit step — surfaced in the UI instead of only
  // being logged to the console.
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  const currentIndex = stepOrder.indexOf(step);
  const today = useMemo(() => startOfDay(new Date()), []);
  const earliestPickup = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1); // earliest is tomorrow
    return d;
  }, [today]);

  const goTo = (next: Step, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setStep(next);
  };

  const handleSelectType = (type: ServiceChild) => {
    setSelectedType(type);
    setTimeout(() => goTo("details"), 150);
  };

  const handleSubmit = async () => {
    if (!selectedType || !purpose.trim() || !pickupDate) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await axios.post("/api/requests", {
        serviceTitle: selectedType.title,
        category: selectedType.category,
        fee: selectedType.fee,
        purpose,
        pickupDate: pickupDate.toISOString(),
      });

      setReferenceNo(res.data.request.referenceNo);
      goTo("confirmed");
    } catch (err) {
      let message =
        "Something went wrong on our end. Please try submitting again.";

      if (axios.isAxiosError(err)) {
        if (!err.response) {
          message =
            "We couldn't reach the server. Check your connection and try again.";
        } else if (err.response.status >= 500) {
          message =
            "The barangay system is temporarily unavailable. Please try again in a moment.";
        } else if (err.response.data?.error) {
          message = err.response.data.error;
        }
        console.error(err.response?.data?.error ?? "Unknown error submitting request.");
      } else {
        console.error(err);
      }

      setSubmitError(message);
      setShakeError(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!shakeError) return;
    const t = setTimeout(() => setShakeError(false), 420);
    return () => clearTimeout(t);
  }, [shakeError]);

  const handleReset = () => {
    setStep("select");
    setSelectedType(null);
    setPurpose("");
    setPickupDate(null);
    setReferenceNo("");
    setSubmitError(null);
    setCopied(false);
  };

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — fail quietly,
      // the reference number is still visible on screen to copy manually.
    }
  };

  /* ---------- calendar grid ---------- */

  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [visibleMonth]);

  const canGoPrevMonth =
    visibleMonth.getFullYear() > today.getFullYear() ||
    (visibleMonth.getFullYear() === today.getFullYear() &&
      visibleMonth.getMonth() > today.getMonth());

  const isDateDisabled = (d: Date) =>
    d.getTime() < earliestPickup.getTime() || d.getDay() === 0; // closed Sundays

  return (
    <>
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(var(--slide-from, 8px)); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes monthIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shakeX {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.35); }
          100% { box-shadow: 0 0 0 10px rgba(180, 83, 9, 0); }
        }
        .step-enter {
          animation: stepIn 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pop-enter {
          animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .month-enter {
          animation: monthIn 0.22s ease-out;
        }
        .shake-error {
          animation: shakeX 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        .seal-ring {
          animation: ringPulse 1.8s cubic-bezier(0.22, 1, 0.36, 1) 1;
        }
      `}</style>

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        {/* Page header */}
        <div className="mb-6">
          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5">
            Resident Portal
          </p>
          <h1 className="text-slate-900 text-2xl font-bold tracking-tight">
            Request a certificate
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
            Choose a certificate type, tell us what it's for, and pick a date
            to collect it at the barangay hall.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {stepOrder.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                    i < currentIndex
                      ? "bg-[#0F172A] text-white"
                      : i === currentIndex
                        ? "bg-[#0F172A] text-white ring-4 ring-[#0F172A]/10"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < currentIndex ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline transition-colors duration-300 ${
                    i <= currentIndex ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
              {i < stepOrder.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0F172A] transition-all duration-500 ease-out"
                    style={{ width: i < currentIndex ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step: select certificate type */}
        {step === "select" && (
          <div className="step-enter" style={{ ["--slide-from" as string]: "8px" }}>
            <p className="text-xs text-slate-500 mb-3">
              <span className="text-rose-500">*</span> Required — choose one
              service
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((service, idx) => {
                const Icon = service.icon;
                const id = slugify(service.title);
                const isSelected =
                  selectedType && slugify(selectedType.title) === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectType(service)}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className={`pop-enter group relative text-left p-4 rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-[#0F172A] shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center animate-[popIn_0.25s_ease]">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 mb-3 ${
                        isSelected
                          ? "bg-[#0F172A]"
                          : "bg-slate-100 group-hover:bg-[#0F172A]"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isSelected
                            ? "text-[#B45309]"
                            : "text-slate-600 group-hover:text-[#B45309]"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 mb-1 pr-6">
                      <p className="text-slate-900 text-sm font-semibold">
                        {service.title}
                      </p>
                      {service.tag && (
                        <span className="text-[9px] font-bold uppercase tracking-wide text-[#B45309] bg-[#B45309]/10 px-1.5 py-0.5 rounded-full">
                          {service.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.processing}
                      </span>
                      <span className="font-semibold text-slate-600">
                        {service.fee}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: request details */}
        {step === "details" && selectedType && (
          <div className="step-enter">
            <button
              onClick={() => goTo("select", "back")}
              className="group flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium mb-5 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>

            <SelectedSummary selectedType={selectedType} />

            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
                  Purpose <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Requirement for job application"
                  rows={3}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200 resize-none"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p
                    className={`text-[11px] transition-colors duration-200 ${
                      !purpose.trim() ? "text-slate-400" : "text-transparent"
                    }`}
                  >
                    This field is required.
                  </p>
                  <p className="text-[11px] text-slate-300 tabular-nums">
                    {purpose.length}/200
                  </p>
                </div>
              </div>

              <button
                onClick={() => goTo("pickup")}
                disabled={!purpose.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-40 disabled:hover:bg-[#0F172A] disabled:active:scale-100 transition-all duration-200"
              >
                Choose pickup date
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: pickup date */}
        {step === "pickup" && selectedType && (
          <div className="step-enter">
            <button
              onClick={() => goTo("details", "back")}
              className="group flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium mb-5 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>

            <SelectedSummary selectedType={selectedType} />

            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
              Pickup date <span className="text-rose-500">*</span>
            </label>
            <p className="text-slate-500 text-xs mb-4">
              Choose the day you'll collect your certificate at the barangay
              hall. Closed on Sundays.
            </p>

            <div className="rounded-xl border border-slate-200 bg-white p-4 mb-5 shadow-sm shadow-slate-100">
              {/* month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setVisibleMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
                    )
                  }
                  disabled={!canGoPrevMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-150"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p
                  key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                  className="month-enter text-slate-900 text-sm font-semibold"
                >
                  {MONTH_LABELS[visibleMonth.getMonth()]}{" "}
                  {visibleMonth.getFullYear()}
                </p>
                <button
                  onClick={() =>
                    setVisibleMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
                    )
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* day labels */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_LABELS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-semibold text-slate-400 py-1.5"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* day grid */}
              <div
                key={`grid-${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                className="month-enter grid grid-cols-7 gap-1"
              >
                {calendarCells.map((d, i) => {
                  if (!d) return <div key={`empty-${i}`} />;
                  const disabled = isDateDisabled(d);
                  const selected = pickupDate && isSameDay(d, pickupDate);
                  const isToday = isSameDay(d, today);
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => !disabled && setPickupDate(d)}
                      disabled={disabled}
                      title={d.getDay() === 0 ? "Closed on Sundays" : undefined}
                      className={`relative aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/30 ${
                        selected
                          ? "bg-[#0F172A] text-white font-bold scale-105 shadow-sm"
                          : disabled
                            ? d.getDay() === 0
                              ? "text-slate-300 cursor-not-allowed line-through decoration-slate-200"
                              : "text-slate-300 cursor-not-allowed"
                            : "text-slate-700 hover:bg-slate-100 hover:scale-105"
                      }`}
                    >
                      {d.getDate()}
                      {isToday && !selected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B45309]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                  Today
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-3 border-t border-dashed border-slate-300" />
                  Closed (Sunday)
                </span>
              </div>
            </div>

            {pickupDate && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#B45309]/5 border border-[#B45309]/20 mb-5 pop-enter">
                <CalendarIcon className="w-4 h-4 text-[#B45309] shrink-0" />
                <p className="text-slate-700 text-xs">
                  Ready for pickup on{" "}
                  <span className="font-semibold text-slate-900">
                    {formatLong(pickupDate)}
                  </span>
                </p>
              </div>
            )}

            {submitError && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-rose-50 border border-rose-200 mb-4 pop-enter">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-rose-700 text-xs font-semibold mb-0.5">
                    Couldn't submit your request
                  </p>
                  <p className="text-rose-600/90 text-xs leading-relaxed">
                    {submitError}
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition-colors duration-150 disabled:opacity-50"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Retry
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!pickupDate || submitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold active:scale-[0.99] disabled:opacity-40 disabled:active:scale-100 transition-all duration-200 ${
                submitError
                  ? "bg-rose-600 hover:bg-rose-700 disabled:hover:bg-rose-600"
                  : "bg-[#0F172A] hover:bg-[#1E293B] disabled:hover:bg-[#0F172A]"
              } text-white ${shakeError ? "shake-error" : ""}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting request
                </>
              ) : submitError ? (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  Try again
                </>
              ) : (
                "Submit request"
              )}
            </button>
          </div>
        )}

        {/* Step: confirmed */}
        {step === "confirmed" && selectedType && (
          <div className="text-center py-6 step-enter">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="seal-ring w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center pop-enter">
                <Stamp className="w-7 h-7 text-[#B45309]" strokeWidth={2} />
              </div>
              <CheckCircle2 className="absolute -bottom-1 -right-1 w-6 h-6 text-white bg-[#0F172A] rounded-full" />
            </div>

            <h2 className="text-slate-900 text-lg font-bold mb-1">
              Request submitted
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              We'll notify you once your {selectedType.title.toLowerCase()} is
              ready for pickup.
            </p>

            <div className="inline-flex flex-col items-center gap-1.5 px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                Reference number
              </p>
              <button
                onClick={handleCopyReference}
                className="group flex items-center gap-2 text-slate-900 text-base font-bold tracking-wide hover:text-[#0F172A] transition-colors duration-150"
                title="Copy reference number"
              >
                {referenceNo}
                {copied ? (
                  <CopyCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors duration-150" />
                )}
              </button>
              <span
                className={`text-[10px] font-medium transition-opacity duration-200 ${
                  copied ? "opacity-100 text-emerald-600" : "opacity-0"
                }`}
              >
                Copied to clipboard
              </span>
            </div>

            {pickupDate && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B45309]/5 border border-[#B45309]/20 mb-8">
                <CalendarIcon className="w-3.5 h-3.5 text-[#B45309]" />
                <p className="text-slate-700 text-xs font-medium">
                  Pickup: {formatLong(pickupDate)}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center">
              <button
                onClick={handleReset}
                className="group flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <PlusCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                Submit another request
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}



function SelectedSummary({ selectedType }: { selectedType: ServiceChild }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0">
        <selectedType.icon className="w-4.5 h-4.5 text-[#B45309]" />
      </div>
      <div className="min-w-0">
        <p className="text-slate-900 text-sm font-semibold truncate">
          {selectedType.title}
        </p>
        <p className="text-slate-500 text-xs flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {selectedType.processing} · {selectedType.fee}
        </p>
      </div>
    </div>
  );
}