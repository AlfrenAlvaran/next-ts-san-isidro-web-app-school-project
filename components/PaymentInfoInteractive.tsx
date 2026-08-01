
"use client";

import { useState } from "react";
import {
  Landmark,
  MapPin,
  Clock,
  Wallet,
  Smartphone,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Banknote,
} from "lucide-react";

type Props = {
  referenceNumber?: string;
  service?: string;
  amount?: string;
  link?: string;
  isManualOnly: boolean;
  address: string;
  hours: string;
  lat: number;
  lng: number;
};

const PAYMENT_METHODS = [
  { label: "GCash", icon: Smartphone },
  { label: "Maya", icon: Smartphone },
  { label: "GrabPay", icon: Wallet },
  { label: "Cards", icon: CreditCard },
  { label: "Online Banking", icon: Landmark },
];

export default function PaymentInfoInteractive({
  referenceNumber,
  service,
  amount,
  link,
  isManualOnly,
  address,
  hours,
  lat,
  lng,
}: Props) {
  const [tab, setTab] = useState<"online" | "person">(
    isManualOnly ? "person" : "online",
  );
  const [copied, setCopied] = useState(false);

  const mapsQuery = encodeURIComponent(address);
  const bbox = `${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const bigMapHref = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

  function copyRef() {
    if (!referenceNumber) return;
    navigator.clipboard.writeText(referenceNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] py-10 px-4 sm:py-14">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with seal emblem */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full bg-[#0B1B33] flex items-center justify-center ring-4 ring-[#B8860B]/20">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7"
              fill="none"
              stroke="#B8860B"
              strokeWidth="1.5"
            >
              <path
                d="M12 3l7 3.5v5.2c0 4.6-3 8.3-7 9.3-4-1-7-4.7-7-9.3V6.5L12 3z"
                strokeLinejoin="round"
              />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-[#B8860B] text-xs font-bold tracking-[0.25em] uppercase mb-1">
              Official Payment
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B33] tracking-tight">
              Complete your certificate payment
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isManualOnly
                ? "This request must be settled in person at the barangay hall."
                : "Pay online now, or settle in person — whichever works best for you."}
            </p>
          </div>
        </div>

        {/* Reference stub — ticket motif */}
        {(referenceNumber || service || amount) && (
          <div className="relative rounded-2xl border border-[#0B1B33]/10 bg-white p-5 shadow-[0_1px_0_0_rgba(11,27,51,0.04)]">
            <div
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F7F4EC] border border-[#0B1B33]/10"
              aria-hidden
            />
            <div
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F7F4EC] border border-[#0B1B33]/10"
              aria-hidden
            />
            <div
              className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t border-dashed border-[#0B1B33]/15"
              aria-hidden
            />
            <div className="relative grid grid-cols-1 sm:grid-cols-2">
              <div className="pb-4 sm:pb-0 sm:pr-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Payment Stub
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Unpaid
                  </span>
                </div>
                {referenceNumber && (
                  <button
                    onClick={copyRef}
                    className="group flex items-center gap-1.5 text-[11px] font-bold text-[#B8860B] tracking-wide uppercase mb-1 hover:text-[#8B6914] transition-colors"
                  >
                    {referenceNumber}
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    )}
                  </button>
                )}
                {service && (
                  <p className="text-sm font-bold text-[#0B1B33]">{service}</p>
                )}
              </div>
              <div className="pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l border-[#0B1B33]/10 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-1">
                  Amount due
                </span>
                <p className="text-xl font-serif font-bold text-[#0B1B33]">
                  {amount ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual-only notice */}
        {isManualOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              Online payment isn&apos;t available for this request right now.
              Please pay in person at the barangay cashier using the details
              below.
            </p>
          </div>
        )}

        {/* Segmented tabs */}
        {!isManualOnly && (
          <div className="inline-flex w-full sm:w-auto rounded-xl bg-[#0B1B33]/5 p-1">
            <button
              onClick={() => setTab("online")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "online"
                  ? "bg-white text-[#0B1B33] shadow-sm"
                  : "text-slate-500 hover:text-[#0B1B33]"
              }`}
            >
              Pay online
            </button>
            <button
              onClick={() => setTab("person")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "person"
                  ? "bg-white text-[#0B1B33] shadow-sm"
                  : "text-slate-500 hover:text-[#0B1B33]"
              }`}
            >
              Pay in person
            </button>
          </div>
        )}

        {/* Pay online panel */}
        {!isManualOnly && tab === "online" && (
          <div className="bg-white rounded-2xl border border-[#0B1B33]/10 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0B1B33] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg font-bold text-[#0B1B33]">
                  Pay online
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pay with GCash, Maya, GrabPay, credit or debit card, or
                  online banking. Your certificate is released as soon as
                  payment clears.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map(({ label, icon: Icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0B1B33] bg-[#F7F4EC] border border-[#0B1B33]/10 rounded-full px-3 py-1.5"
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                  ))}
                </div>

                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1B33] hover:bg-[#B8860B] text-white text-sm font-semibold transition-colors"
                  >
                    Pay online now
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <p className="mt-5 text-xs text-slate-400 bg-[#F7F4EC] rounded-md px-3 py-2.5">
                    Your payment link is included in the email we sent you. If
                    you can&apos;t find it, contact the barangay office and
                    we&apos;ll resend it.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pay in person panel */}
        {(isManualOnly || tab === "person") && (
          <div className="bg-white rounded-2xl border border-[#0B1B33]/10 overflow-hidden">
            <div className="p-6 pb-0 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg border border-[#0B1B33]/15 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-[#0B1B33]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg font-bold text-[#0B1B33]">
                  Pay in person
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Visit the barangay cashier and show your reference number.
                </p>
              </div>
            </div>

            {/* Embedded map — signature element, ticket-perforated top edge */}
            <div className="relative mt-5 mx-6 rounded-xl overflow-hidden border border-[#0B1B33]/10">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,#F7F4EC_6px,#F7F4EC_10px)] z-10" />
              <iframe
                title="Map to barangay hall"
                src={embedSrc}
                className="w-full h-52 sm:h-64 border-0 grayscale-[15%]"
                loading="lazy"
              />
              <a
                href={bigMapHref}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B1B33] bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border border-[#0B1B33]/10 hover:bg-white transition-colors shadow-sm"
              >
                Open full map
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            <div className="p-6 pt-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {address}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#B8860B] hover:underline inline-flex items-center gap-1"
                  >
                    Get directions
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Cashier hours
                    </p>
                    <p className="text-xs text-slate-500">{hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Banknote className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Accepted payment
                    </p>
                    <p className="text-xs text-slate-500">
                      Cash only at the counter
                    </p>
                  </div>
                </div>
              </div>

              {referenceNumber && (
                <div className="flex items-center gap-2 bg-[#F7F4EC] rounded-lg px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-slate-600">
                    Show reference{" "}
                    <span className="font-bold text-[#0B1B33]">{referenceNumber}</span> to
                    the cashier — your certificate is released once payment is
                    recorded.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help footer */}
        <div className="bg-white rounded-2xl border border-[#0B1B33]/10 p-5 flex items-start gap-3">
          <Smartphone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500">
            Questions about your payment? Contact the barangay office and
            mention your reference number{referenceNumber ? ` (${referenceNumber})` : ""} so staff
            can look up your request.
          </p>
        </div>
      </div>
    </div>
  );
}