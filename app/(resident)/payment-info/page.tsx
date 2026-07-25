// app/payment-info/page.tsx
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
} from "lucide-react";

export default async function PaymentInfoPage({
  searchParams,
}: {
  searchParams: Promise<{
    ref?: string;
    service?: string;
    amount?: string;
    link?: string;
    method?: string;
  }>;
}) {
  const { ref, service, amount, link, method } = await searchParams;
  const isManualOnly = method === "manual";

  const mapsQuery = encodeURIComponent(
    "Barangay San Isidro Hall, San Isidro, Philippines",
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Payment
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete your certificate payment
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isManualOnly
              ? "Please settle this payment in person at the barangay hall."
              : "Pay online now, or settle it in person at the barangay hall — whichever works best for you."}
          </p>
        </div>

        {/* Reference stub */}
        {(ref || service || amount) && (
          <div className="relative rounded-xl border border-dashed border-slate-300 bg-white p-5">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-dashed border-slate-300" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-dashed border-slate-300" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                Payment Stub
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600">
                Unpaid
              </span>
            </div>
            {ref && (
              <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">
                {ref}
              </p>
            )}
            {service && (
              <p className="text-sm font-bold text-slate-900">{service}</p>
            )}
            {amount && (
              <p className="text-xs text-slate-500 mt-0.5">
                Amount due: {amount}
              </p>
            )}
          </div>
        )}

        {/* Pay online — only shown when an online option actually exists */}
        {!isManualOnly && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-slate-900">
                  Pay online
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Pay with GCash, Maya, GrabPay, credit or debit card, or online
                  banking. Your certificate is released as soon as payment clears.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["GCash", "Maya", "GrabPay", "Cards", "Online Banking"].map(
                    (method) => (
                      <span
                        key={method}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1"
                      >
                        {method}
                      </span>
                    ),
                  )}
                </div>

                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold transition-colors"
                  >
                    Pay online now
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 bg-slate-50 rounded-md px-3 py-2">
                    Your payment link is included in the email we sent you. If you
                    can't find it, contact the barangay office and we'll resend
                    it.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual-only notice */}
        {isManualOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Online payment isn't available for this request right now. Please
              pay in person at the barangay cashier using the details below.
            </p>
          </div>
        )}

        {/* Pay in person */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-extrabold text-slate-900">
                Pay in person
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Visit the barangay cashier and bring your reference number.
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Barangay San Isidro Hall
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#B8860B] hover:underline inline-flex items-center gap-1"
                    >
                      View on Google Maps
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Cashier hours
                    </p>
                    <p className="text-xs text-slate-500">
                      Monday–Friday, 8:00 AM–5:00 PM (closed on holidays)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wallet className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
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

              {ref && (
                <div className="mt-4 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-xs text-slate-600">
                    Show reference{" "}
                    <span className="font-bold text-slate-900">{ref}</span> to
                    the cashier — your certificate is released once payment is
                    recorded.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help footer */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
          <Smartphone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500">
            Questions about your payment? Contact the barangay office and
            mention your reference number{ref ? ` (${ref})` : ""} so staff can
            look up your request.
          </p>
        </div>
      </div>
    </div>
  );
}