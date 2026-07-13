// app/request/page.tsx
"use client";

import { useState } from "react";
import {
  FileText,
  Shield,
  Home,
  Briefcase,
  Users,
  Stamp,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import Header from "@/components/Header";

interface CertificateType {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  processingTime: string;
  fee: string;
}

const certificateTypes: CertificateType[] = [
  {
    id: "clearance",
    name: "Barangay Clearance",
    description: "General-purpose clearance for employment, business, or legal transactions",
    icon: Shield,
    processingTime: "1-2 business days",
    fee: "₱50.00",
  },
  {
    id: "residency",
    name: "Certificate of Residency",
    description: "Confirms your address and length of stay in the barangay",
    icon: Home,
    processingTime: "1 business day",
    fee: "₱30.00",
  },
  {
    id: "indigency",
    name: "Certificate of Indigency",
    description: "For availing government assistance or fee waivers",
    icon: Users,
    processingTime: "1 business day",
    fee: "Free",
  },
  {
    id: "business",
    name: "Business Clearance",
    description: "Required for new or renewed business permit applications",
    icon: Briefcase,
    processingTime: "2-3 business days",
    fee: "₱100.00",
  },
];

type Step = "select" | "details" | "confirmed";
const stepOrder: Step[] = ["select", "details", "confirmed"];
const stepLabels: Record<Step, string> = {
  select: "Certificate",
  details: "Details",
  confirmed: "Done",
};

export default function RequestPage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState<"pickup" | "email">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");

  const currentIndex = stepOrder.indexOf(step);

  const handleSelectType = (type: CertificateType) => {
    setSelectedType(type);
    setTimeout(() => setStep("details"), 150);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // TODO: replace with your real API call, e.g.
    // const res = await fetch("/api/requests", {
    //   method: "POST",
    //   body: JSON.stringify({ certificateId: selectedType?.id, purpose, quantity, delivery }),
    // });
    // const data = await res.json();
    await new Promise((resolve) => setTimeout(resolve, 900));
    const ref = `SI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNo(ref);
    setSubmitting(false);
    setStep("confirmed");
  };

  const handleReset = () => {
    setStep("select");
    setSelectedType(null);
    setPurpose("");
    setQuantity(1);
    setDelivery("pickup");
    setReferenceNo("");
  };

  return (
    

      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        {/* Page header */}
        <div className="mb-6">
          <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">
            Resident Portal
          </p>
          <h1 className="text-slate-900 text-xl font-bold">Request a certificate</h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose a certificate type and we'll prepare it for pickup or email.
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
                <div className="flex-1 h-[2px] mx-3 rounded-full bg-slate-100 overflow-hidden">
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
          <div className="grid sm:grid-cols-2 gap-3">
            {certificateTypes.map((cert) => {
              const Icon = cert.icon;
              const isSelected = selectedType?.id === cert.id;
              return (
                <button
                  key={cert.id}
                  onClick={() => handleSelectType(cert)}
                  className={`group relative text-left p-4 rounded-xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                    isSelected ? "border-[#0F172A]" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 mb-3 ${
                      isSelected ? "bg-[#0F172A]" : "bg-slate-100 group-hover:bg-[#0F172A]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors duration-200 ${
                        isSelected ? "text-[#B45309]" : "text-slate-600 group-hover:text-[#B45309]"
                      }`}
                    />
                  </div>
                  <p className="text-slate-900 text-sm font-semibold mb-1 pr-6">{cert.name}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-3">
                    {cert.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cert.processingTime}
                    </span>
                    <span className="font-semibold text-slate-600">{cert.fee}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step: request details */}
        {step === "details" && selectedType && (
          <div>
            <button
              onClick={() => setStep("select")}
              className="group flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium mb-5 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                <selectedType.icon className="w-4.5 h-4.5 text-[#B45309]" />
              </div>
              <div>
                <p className="text-slate-900 text-sm font-semibold">{selectedType.name}</p>
                <p className="text-slate-500 text-xs">
                  {selectedType.processingTime} · {selectedType.fee}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
                  Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Requirement for job application"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-[#0F172A] transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
                  Number of copies
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wide mb-2">
                  Delivery method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDelivery("pickup")}
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      delivery === "pickup"
                        ? "border-[#0F172A] bg-[#0F172A] text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    Pick up at hall
                  </button>
                  <button
                    onClick={() => setDelivery("email")}
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      delivery === "email"
                        ? "border-[#0F172A] bg-[#0F172A] text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    Email a copy
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!purpose.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-40 disabled:hover:bg-[#0F172A] disabled:active:scale-100 transition-all duration-200"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting request
                  </>
                ) : (
                  "Submit request"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: confirmed */}
        {step === "confirmed" && selectedType && (
          <div className="text-center py-6">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center">
                <Stamp className="w-7 h-7 text-[#B45309]" strokeWidth={2} />
              </div>
              <CheckCircle2 className="absolute -bottom-1 -right-1 w-6 h-6 text-white bg-[#0F172A] rounded-full" />
            </div>

            <h2 className="text-slate-900 text-lg font-bold mb-1">Request submitted</h2>
            <p className="text-slate-500 text-sm mb-6">
              We'll notify you once your {selectedType.name.toLowerCase()} is ready.
            </p>

            <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                Reference number
              </p>
              <p className="text-slate-900 text-base font-bold tracking-wide">{referenceNo}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mb-8">
              <Clock className="w-3.5 h-3.5" />
              Estimated ready in {selectedType.processingTime}
            </div>

            <button
              onClick={handleReset}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Request another certificate
            </button>
          </div>
        )}
      </main>
    
  );
}