"use client"
import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  Megaphone,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Check,
  X,
  Clock,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Stamp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ---------------------------------------------------------------------------
// Seed data — modeled on the barangay's real certificate/service catalogue
// ---------------------------------------------------------------------------

const CERT_TYPES = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit Endorsement",
  "Barangay ID",
];

const seedRequests = [
  { id: "SI-2601", name: "Reyes, Marivic C.", type: "Barangay Clearance", purpose: "Employment", submitted: "Jul 12, 8:14 AM", status: "pending" },
  { id: "SI-2600", name: "Delos Santos, Ronnel M.", type: "Certificate of Indigency", purpose: "Medical assistance", submitted: "Jul 12, 7:52 AM", status: "pending" },
  { id: "SI-2599", name: "Villanueva, Ana Liza P.", type: "Certificate of Residency", purpose: "School requirement", submitted: "Jul 11, 4:30 PM", status: "approved" },
  { id: "SI-2598", name: "Cruz, Bartolome Jr.", type: "Business Permit Endorsement", purpose: "Sari-sari store renewal", submitted: "Jul 11, 2:05 PM", status: "approved" },
  { id: "SI-2597", name: "Fernandez, Kristine Joy", name2: "", type: "Barangay ID", purpose: "Valid ID", submitted: "Jul 11, 11:41 AM", status: "pending" },
  { id: "SI-2596", name: "Aquino, Domingo T.", type: "Barangay Clearance", purpose: "Firearm license", submitted: "Jul 10, 9:18 AM", status: "rejected" },
  { id: "SI-2595", name: "Santos, Perlita G.", type: "Certificate of Residency", purpose: "Voter's registration", submitted: "Jul 10, 8:02 AM", status: "approved" },
  { id: "SI-2594", name: "Mendoza, Vicente D.", type: "Certificate of Indigency", purpose: "PhilHealth subsidy", submitted: "Jul 9, 3:47 PM", status: "approved" },
  { id: "SI-2593", name: "Torres, Josephine A.", type: "Barangay Clearance", purpose: "Job application", submitted: "Jul 9, 1:22 PM", status: "approved" },
  { id: "SI-2592", name: "Ramos, Eduardo Jr.", type: "Barangay ID", purpose: "Senior citizen ID", submitted: "Jul 9, 10:10 AM", status: "pending" },
  { id: "SI-2591", name: "Garcia, Nenita B.", type: "Certificate of Residency", purpose: "Bank requirement", submitted: "Jul 8, 4:55 PM", status: "rejected" },
  { id: "SI-2590", name: "Pascual, Renato C.", type: "Business Permit Endorsement", purpose: "New business permit", submitted: "Jul 8, 9:33 AM", status: "approved" },
];

const trend = [
  { day: "Jul 6", requests: 14 },
  { day: "Jul 7", requests: 19 },
  { day: "Jul 8", requests: 16 },
  { day: "Jul 9", requests: 24 },
  { day: "Jul 10", requests: 18 },
  { day: "Jul 11", requests: 27 },
  { day: "Jul 12", requests: 11 },
];

const announcements = [
  { id: 1, title: "Free Anti-Rabies Vaccination for Pets", date: "Jul 10, 2026", status: "published", tag: "Health" },
  { id: 2, title: "Barangay Assembly — Q3 Budget Review", date: "Jul 8, 2026", status: "published", tag: "Governance" },
  { id: 3, title: "Water Interruption Notice, Purok 4–6", date: "Jul 5, 2026", status: "published", tag: "Advisory" },
  { id: 4, title: "Livelihood Training: Basic Baking", date: "Jul 15, 2026", status: "draft", tag: "Program" },
];

const residentsByPurok = [
  { purok: "Purok 1", households: 214, residents: 986 },
  { purok: "Purok 2", households: 188, residents: 843 },
  { purok: "Purok 3", households: 251, residents: 1122 },
  { purok: "Purok 4", households: 176, residents: 799 },
  { purok: "Purok 5", households: 203, residents: 918 },
  { purok: "Purok 6", households: 165, residents: 731 },
];

const seedResidents = [
  { id: "RES-08841", name: "Reyes, Marivic C.", purok: "Purok 3", household: "HH-1142", age: 34, civilStatus: "Married", sex: "Female", occupation: "Public School Teacher", voter: true, pwd: false, senior: false, fourPs: false, contact: "0917 220 4481" },
  { id: "RES-08840", name: "Delos Santos, Ronnel M.", purok: "Purok 1", household: "HH-0311", age: 41, civilStatus: "Married", sex: "Male", occupation: "Jeepney Driver", voter: true, pwd: false, senior: false, fourPs: true, contact: "0928 774 1190" },
  { id: "RES-08839", name: "Villanueva, Ana Liza P.", purok: "Purok 5", household: "HH-0876", age: 19, civilStatus: "Single", sex: "Female", occupation: "College Student", voter: true, pwd: false, senior: false, fourPs: false, contact: "0915 062 3387" },
  { id: "RES-08838", name: "Cruz, Bartolome Jr.", purok: "Purok 2", household: "HH-0219", age: 52, civilStatus: "Married", sex: "Male", occupation: "Sari-sari Store Owner", voter: true, pwd: false, senior: false, fourPs: false, contact: "0918 340 7702" },
  { id: "RES-08837", name: "Fernandez, Kristine Joy T.", purok: "Purok 4", household: "HH-0654", age: 27, civilStatus: "Single", sex: "Female", occupation: "Call Center Agent", voter: true, pwd: false, senior: false, fourPs: false, contact: "0906 815 2244" },
  { id: "RES-08836", name: "Aquino, Domingo T.", purok: "Purok 6", household: "HH-1009", age: 63, civilStatus: "Widowed", sex: "Male", occupation: "Retired", voter: true, pwd: false, senior: true, fourPs: false, contact: "0933 402 8815" },
  { id: "RES-08835", name: "Santos, Perlita G.", purok: "Purok 1", household: "HH-0142", age: 45, civilStatus: "Married", sex: "Female", occupation: "Vendor, Public Market", voter: true, pwd: false, senior: false, fourPs: true, contact: "0917 559 6631" },
  { id: "RES-08834", name: "Mendoza, Vicente D.", purok: "Purok 3", household: "HH-0987", age: 71, civilStatus: "Married", sex: "Male", occupation: "Retired", voter: true, pwd: true, senior: true, fourPs: false, contact: "0921 004 5578" },
  { id: "RES-08833", name: "Torres, Josephine A.", purok: "Purok 2", household: "HH-0433", age: 24, civilStatus: "Single", sex: "Female", occupation: "Nurse", voter: true, pwd: false, senior: false, fourPs: false, contact: "0945 128 9903" },
  { id: "RES-08832", name: "Ramos, Eduardo Jr.", purok: "Purok 5", household: "HH-0765", age: 68, civilStatus: "Married", sex: "Male", occupation: "Retired", voter: true, pwd: false, senior: true, fourPs: false, contact: "0917 663 2210" },
  { id: "RES-08831", name: "Garcia, Nenita B.", purok: "Purok 4", household: "HH-0592", age: 38, civilStatus: "Separated", sex: "Female", occupation: "Dressmaker", voter: false, pwd: false, senior: false, fourPs: true, contact: "0928 371 4462" },
  { id: "RES-08830", name: "Pascual, Renato C.", purok: "Purok 6", household: "HH-1187", age: 30, civilStatus: "Married", sex: "Male", occupation: "Electrician", voter: true, pwd: false, senior: false, fourPs: false, contact: "0916 802 3391" },
  { id: "RES-08829", name: "Bautista, Corazon M.", purok: "Purok 1", household: "HH-0088", age: 8, civilStatus: "Single", sex: "Female", occupation: "Student", voter: false, pwd: false, senior: false, fourPs: true, contact: "0917 220 4481" },
  { id: "RES-08828", name: "Navarro, Ferdinand S.", purok: "Purok 3", household: "HH-1142", age: 12, civilStatus: "Single", sex: "Male", occupation: "Student", voter: false, pwd: true, senior: false, fourPs: false, contact: "0917 220 4481" },
  { id: "RES-08827", name: "Ocampo, Teresita V.", purok: "Purok 2", household: "HH-0219", age: 79, civilStatus: "Widowed", sex: "Female", occupation: "Retired", voter: true, pwd: false, senior: true, fourPs: false, contact: "0918 340 7702" },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

const STATUS_STYLES = {
  pending: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200", label: "Pending" },
  approved: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200", label: "Approved" },
  rejected: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50", ring: "ring-rose-200", label: "Rejected" },
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function KPICard({ label, value, delta, positive, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#B8860B]" strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {delta}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">{value}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
    </div>
  );
}

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "requests", label: "Certificate Requests", icon: FileText, badge: true },
  { key: "residents", label: "Residents", icon: Users },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "settings", label: "Settings", icon: Settings },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function BarangayAdminDashboard() {
  const [view, setView] = useState("overview");
  const [requests, setRequests] = useState(seedRequests);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  function updateStatus(id, status) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected(null);
    setToast(status === "approved" ? "Certificate approved and queued for printing." : "Request rejected.");
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* ---------------------------------------------------------------- */}
      {/* Sidebar */}
      {/* ---------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[#0F172A] flex-col">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center">
            <Stamp className="w-4 h-4 text-[#B8860B]" />
          </div>
          <div>
            <p className="text-white text-[13px] font-bold leading-none">San Isidro</p>
            <p className="text-slate-500 text-[10px] leading-none mt-1 tracking-wide uppercase">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((item) => {
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  active
                    ? "bg-[#B8860B]/15 text-[#B8860B]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" strokeWidth={2} />
                  {item.label}
                </span>
                {item.badge && pendingCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-[#B8860B] text-slate-900" : "bg-slate-700 text-slate-200"}`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-5 border-t border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            KP
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">Kap. Julieta P. Ramos</p>
            <p className="text-slate-500 text-[10px]">Punong Barangay</p>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main column */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-8 gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center">
              <Stamp className="w-3.5 h-3.5 text-[#B8860B]" />
            </div>
            <span className="font-bold text-slate-900 text-sm">San Isidro</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search requests, residents…"
              className="bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <p className="hidden md:block text-xs text-slate-400">Sunday, July 12, 2026</p>
            <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B8860B] ring-2 ring-white" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] text-xs font-bold">
                KP
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
          {view === "overview" && (
            <OverviewView requests={requests} pendingCount={pendingCount} onOpenRequests={() => setView("requests")} />
          )}
          {view === "requests" && (
            <RequestsView
              requests={requests}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onSelect={setSelected}
            />
          )}
          {view === "residents" && <ResidentsView />}
          {view === "announcements" && <AnnouncementsView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Detail drawer */}
      {/* ---------------------------------------------------------------- */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
            <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">{selected.id}</p>
                <h3 className="text-lg font-extrabold text-slate-900">{selected.type}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Certificate stub visual — signature element */}
              <div className="relative rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border border-dashed border-slate-300" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-dashed border-slate-300" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Request Stub</span>
                  <StatusPill status={selected.status} />
                </div>
                <p className="text-sm font-bold text-slate-900">{selected.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Purpose: {selected.purpose}</p>
                <p className="text-xs text-slate-400 mt-3">Submitted {selected.submitted}</p>
              </div>

              <div className="space-y-3">
                <Field label="Requesting resident" value={selected.name} />
                <Field label="Certificate type" value={selected.type} />
                <Field label="Stated purpose" value={selected.purpose} />
                <Field label="Date submitted" value={selected.submitted} />
                <Field label="Reference number" value={selected.id} />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
              {selected.status === "pending" ? (
                <>
                  <button
                    onClick={() => updateStatus(selected.id, "rejected")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-[fadeUp_0.2s_ease-out]">
          <style>{`@keyframes fadeUp { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
          <Check className="w-4 h-4 text-[#B8860B]" />
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

function OverviewView({ requests, pendingCount, onOpenRequests }) {
  const approvedThisWeek = requests.filter((r) => r.status === "approved").length;
  const recent = requests.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Magandang araw, Kapitana.</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening in Barangay San Isidro today.</p>
        </div>
        <button
          onClick={onOpenRequests}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Stamp className="w-4 h-4" /> Review pending requests
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Pending requests" value={pendingCount} delta="+3 today" positive={false} icon={Clock} />
        <KPICard label="Approved this week" value={approvedThisWeek} delta="+18%" positive icon={FileText} />
        <KPICard label="Registered residents" value="12,406" delta="+0.4%" positive icon={Users} />
        <KPICard label="Published notices" value="24" delta="+2 new" positive icon={Megaphone} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Requests received</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+21% vs prior week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend} margin={{ left: -20, right: 10, top: 5 }}>
              <defs>
                <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8860B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                labelStyle={{ color: "#0F172A", fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="requests" stroke="#0F172A" strokeWidth={2} fill="url(#reqFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Recent activity</h3>
          <p className="text-xs text-slate-400 mb-5">Latest submissions</p>
          <div className="space-y-4">
            {recent.map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{r.name}</p>
                  <p className="text-[11px] text-slate-400">{r.type}</p>
                </div>
                <StatusPill status={r.status} />
              </div>
            ))}
          </div>
          <button onClick={onOpenRequests} className="w-full mt-5 text-xs font-semibold text-[#B8860B] hover:text-[#0F172A] transition-colors">
            View all requests →
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

function RequestsView({ requests, query, setQuery, statusFilter, setStatusFilter, onSelect }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const filters = ["all", "pending", "approved", "rejected"];

  const filtered = useMemo(() => {
    let list = requests.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.type.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesType = typeFilter === "all" || r.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });
    list = [...list].sort((a, b) => (sort === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)));
    return list;
  }, [requests, query, statusFilter, typeFilter, sort]);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  function exportCsv() {
    const header = ["Reference", "Resident", "Certificate Type", "Purpose", "Submitted", "Status"];
    const rows = filtered.map((r) => [r.id, r.name, r.type, r.purpose, r.submitted, r.status]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
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
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Records</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Certificate Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Review, approve, and issue resident certificate requests.</p>
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
        <button onClick={() => setStatusFilter("all")} className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "all" ? "border-[#0F172A]" : "border-slate-200 hover:border-slate-300"}`}>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">{counts.all}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total requests</p>
        </button>
        <button onClick={() => setStatusFilter("pending")} className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "pending" ? "border-amber-400" : "border-slate-200 hover:border-slate-300"}`}>
          <p className="text-xl font-extrabold text-amber-600 tabular-nums">{counts.pending}</p>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting review</p>
        </button>
        <button onClick={() => setStatusFilter("approved")} className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "approved" ? "border-emerald-400" : "border-slate-200 hover:border-slate-300"}`}>
          <p className="text-xl font-extrabold text-emerald-600 tabular-nums">{counts.approved}</p>
          <p className="text-xs text-slate-500 mt-0.5">Approved</p>
        </button>
        <button onClick={() => setStatusFilter("rejected")} className={`text-left bg-white rounded-xl border p-4 transition-colors ${statusFilter === "rejected" ? "border-rose-400" : "border-slate-200 hover:border-slate-300"}`}>
          <p className="text-xl font-extrabold text-rose-600 tabular-nums">{counts.rejected}</p>
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
                statusFilter === f ? "bg-[#0F172A] text-white" : "text-slate-500 hover:text-slate-800"
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
              placeholder="Search name, reference, type…"
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
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
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
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Reference</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Resident</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Certificate</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden xl:table-cell">Purpose</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Submitted</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => onSelect(r)}>
                <td className="px-5 py-3.5 text-xs font-bold text-slate-400 tabular-nums">{r.id}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{r.name}</td>
                <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{r.type}</td>
                <td className="px-5 py-3.5 text-slate-500 hidden xl:table-cell">{r.purpose}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">{r.submitted}</td>
                <td className="px-5 py-3.5"><StatusPill status={r.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <button className="w-7 h-7 rounded-md hover:bg-slate-100 inline-flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                  No requests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {requests.length} requests</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Residents
// ---------------------------------------------------------------------------

function ResidentsView() {
  const [query, setQuery] = useState("");
  const [purokFilter, setPurokFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const totalResidents = residentsByPurok.reduce((a, p) => a + p.residents, 0);
  const maxResidents = Math.max(...residentsByPurok.map((p) => p.residents));
  const totalHouseholds = residentsByPurok.reduce((a, p) => a + p.households, 0);
  const voterCount = seedResidents.filter((r) => r.voter).length;
  const seniorCount = seedResidents.filter((r) => r.senior).length;

  const puroks = ["all", ...residentsByPurok.map((p) => p.purok)];

  const filtered = useMemo(() => {
    return seedResidents.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.household.toLowerCase().includes(query.toLowerCase());
      const matchesPurok = purokFilter === "all" || r.purok === purokFilter;
      const matchesTag =
        tagFilter === "all" ||
        (tagFilter === "voter" && r.voter) ||
        (tagFilter === "senior" && r.senior) ||
        (tagFilter === "pwd" && r.pwd) ||
        (tagFilter === "4ps" && r.fourPs);
      return matchesQuery && matchesPurok && matchesTag;
    });
  }, [query, purokFilter, tagFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Population</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Residents</h1>
          <p className="text-slate-500 text-sm mt-1">{totalResidents.toLocaleString()} registered residents across 6 puroks.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add resident
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total residents" value={totalResidents.toLocaleString()} delta="+0.4%" positive icon={Users} />
        <KPICard label="Households" value={totalHouseholds.toLocaleString()} delta="+6 new" positive icon={LayoutGrid} />
        <KPICard label="Registered voters" value={voterCount} delta="in directory" positive icon={Check} />
        <KPICard label="Senior citizens" value={seniorCount} delta="in directory" positive icon={Clock} />
      </div>

      {/* Purok distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Distribution by purok</h3>
          <p className="text-xs text-slate-400 mt-0.5">Share of total population</p>
        </div>
        {residentsByPurok.map((p) => (
          <div key={p.purok}>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-700">{p.purok}</span>
              <span className="text-slate-400">{p.residents.toLocaleString()} residents · {p.households} households</span>
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

      {/* Directory */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <h3 className="text-sm font-bold text-slate-900">Resident directory</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ID, household…"
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
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 outline-none"
          >
            <option value="all">All residents</option>
            <option value="voter">Registered voters</option>
            <option value="senior">Senior citizens</option>
            <option value="pwd">PWD</option>
            <option value="4ps">4Ps beneficiary</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Resident ID</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Name</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Purok</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Household</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3 hidden xl:table-cell">Age</th>
              <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Tags</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                <td className="px-5 py-3.5 text-xs font-bold text-slate-400 tabular-nums">{r.id}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{r.name}</td>
                <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{r.purok}</td>
                <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{r.household}</td>
                <td className="px-5 py-3.5 text-slate-500 hidden xl:table-cell tabular-nums">{r.age}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {r.voter && <MiniTag label="Voter" />}
                    {r.senior && <MiniTag label="Senior" />}
                    {r.pwd && <MiniTag label="PWD" />}
                    {r.fourPs && <MiniTag label="4Ps" />}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="w-7 h-7 rounded-md hover:bg-slate-100 inline-flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-slate-400">
                  No residents match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {seedResidents.length} sampled records</p>

      {/* Resident profile drawer */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#B8860B] tracking-wide uppercase mb-1">{selected.id}</p>
                <h3 className="text-lg font-extrabold text-slate-900">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] font-bold text-lg shrink-0">
                  {selected.name.split(",")[0].slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selected.name}</p>
                  <p className="text-xs text-slate-500">{selected.purok} · {selected.household}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selected.voter && <MiniTag label="Voter" />}
                    {selected.senior && <MiniTag label="Senior" />}
                    {selected.pwd && <MiniTag label="PWD" />}
                    {selected.fourPs && <MiniTag label="4Ps" />}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Field label="Age" value={selected.age} />
                <Field label="Sex" value={selected.sex} />
                <Field label="Civil status" value={selected.civilStatus} />
                <Field label="Occupation" value={selected.occupation} />
                <Field label="Purok" value={selected.purok} />
                <Field label="Household no." value={selected.household} />
                <Field label="Contact number" value={selected.contact} />
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

function MiniTag({ label }) {
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#B8860B]/10 text-[#B8860B]">
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

function AnnouncementsView() {
  const [items, setItems] = useState(announcements);

  function toggle(id) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Communications</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Announcements</h1>
          <p className="text-slate-500 text-sm mt-1">Manage what appears on the public homepage.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> New announcement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {items.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded-full">{a.tag}</span>
                <span className="text-[11px] text-slate-400">{a.date}</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm truncate">{a.title}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggle(a.id)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  a.status === "published" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {a.status === "published" ? "Published" : "Draft"}
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings (placeholder section)
// ---------------------------------------------------------------------------

function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Configuration</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Office hours, staff accounts, and certificate templates.</p>
      </div>
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 text-center">
        <Settings className="w-6 h-6 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-400">Settings management is not part of this preview.</p>
      </div>
    </div>
  );
}