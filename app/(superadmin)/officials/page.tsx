"use client";

import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Landmark,
  Search,
  Check,
  History,
  Phone,
  User,
  CalendarDays,
  ChevronDown,
  Camera,
  X,
} from "lucide-react";

type PositionKey =
  | "chairman"
  | "kagawad"
  | "sk_chairman"
  | "secretary"
  | "treasurer";

type TermStatus = "current" | "past";

interface Position {
  title: string;
  seats: number;
}

const POSITIONS: Record<PositionKey, Position> = {
  chairman: { title: "Punong Barangay", seats: 1 },
  kagawad: { title: "Kagawad", seats: 7 },
  sk_chairman: { title: "SK Chairman", seats: 1 },
  secretary: { title: "Barangay Secretary", seats: 1 },
  treasurer: { title: "Barangay Treasurer", seats: 1 },
};

interface Official {
  id: number;
  name: string;
  position: PositionKey;
  contact: string;
  termStart: string;
  termEnd: string;
  status: TermStatus;
  photoUrl?: string;
}

const OFFICIALS: Official[] = [
  { id: 1, name: "Roberto Villanueva", position: "chairman", contact: "0917 234 5678", termStart: "2023", termEnd: "2026", status: "current", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto%20Villanueva" },
  { id: 2, name: "Elena Reyes", position: "kagawad", contact: "0918 345 1122", termStart: "2023", termEnd: "2026", status: "current", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Reyes" },
  { id: 3, name: "Bayani Torres", position: "kagawad", contact: "0919 456 2233", termStart: "2023", termEnd: "2026", status: "current" },
  { id: 4, name: "Corazon Lim", position: "kagawad", contact: "0920 567 3344", termStart: "2023", termEnd: "2026", status: "current", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Corazon%20Lim" },
  { id: 5, name: "Danilo Ramos", position: "kagawad", contact: "0921 678 4455", termStart: "2023", termEnd: "2026", status: "current" },
  { id: 6, name: "Grace Manalo", position: "kagawad", contact: "0922 789 5566", termStart: "2023", termEnd: "2026", status: "current", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace%20Manalo" },
  { id: 7, name: "Patricia Uy", position: "sk_chairman", contact: "0923 890 6677", termStart: "2023", termEnd: "2026", status: "current" },
  { id: 8, name: "Fernando Cruz", position: "secretary", contact: "0924 901 7788", termStart: "2023", termEnd: "2026", status: "current" },
  { id: 9, name: "Ligaya Santos", position: "treasurer", contact: "0925 012 8899", termStart: "2023", termEnd: "2026", status: "current", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ligaya%20Santos" },
  { id: 10, name: "Arturo Bautista", position: "kagawad", contact: "0926 123 9900", termStart: "2020", termEnd: "2023", status: "past" },
];

function Avatar({ name, photoUrl, size = "w-8 h-8" }: { name: string; photoUrl?: string; size?: string }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${size} rounded-full object-cover shrink-0 bg-slate-100`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[11px] font-bold text-slate-500`}>
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </div>
  );
}

export default function AddOfficialPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [position, setPosition] = useState<PositionKey>("kagawad");
  const [termStart, setTermStart] = useState("");
  const [termEnd, setTermEnd] = useState("");
  const [positionOpen, setPositionOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "current" | "past">("current");

  const seatsFilled = useMemo(() => {
    const counts: Partial<Record<PositionKey, number>> = {};
    OFFICIALS.filter((o) => o.status === "current").forEach((o) => {
      counts[o.position] = (counts[o.position] ?? 0) + 1;
    });
    return counts;
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload `file` to your storage (S3/Cloud Storage) and store the returned URL instead of a local preview
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !termStart.trim() || !termEnd.trim()) return;
    // TODO: wire up to your officials mutation, including photoPreview/uploaded photo URL
    setAdded(true);
    setName("");
    setContact("");
    setTermStart("");
    setTermEnd("");
    setPhotoPreview(null);
    setTimeout(() => setAdded(false), 3000);
  };

  const filtered = useMemo(() => {
    return OFFICIALS.filter((o) => {
      const matchesQuery =
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        POSITIONS[o.position].title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" ? true : o.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const selectedSeat = POSITIONS[position];
  const selectedFilled = seatsFilled[position] ?? 0;
  const seatsFull = selectedSeat.seats > 1 && selectedFilled >= selectedSeat.seats;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/super-admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to overview
        </Link>
        <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Super Admin
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Elected officials.
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Keep the record of who holds office in San Isidro, and for how long.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Add official form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">Add to the record</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This adds a term record — it doesn't create a system login.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0F172A] hover:bg-[#B8860B] text-white flex items-center justify-center transition-colors shadow-sm"
                title="Upload photo"
              >
                <Camera className="w-3 h-3" />
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 flex items-center justify-center transition-colors"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600">Photo</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Square photo works best. JPG or PNG, up to 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Contact number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="0917 000 0000"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Position
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPositionOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-slate-400" />
                  {POSITIONS[position].title}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${positionOpen ? "rotate-180" : ""}`} />
              </button>

              {positionOpen && (
                <div className="absolute z-20 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-[fadeUp_0.15s_ease-out_backwards]">
                  {(Object.keys(POSITIONS) as PositionKey[]).map((key) => {
                    const p = POSITIONS[key];
                    const filled = seatsFilled[key] ?? 0;
                    const full = p.seats > 1 && filled >= p.seats;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setPosition(key);
                          setPositionOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className={position === key ? "font-semibold text-slate-900" : "text-slate-600"}>
                          {p.title}
                        </span>
                        {p.seats > 1 && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            full ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {filled} of {p.seats} filled
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {seatsFull && (
              <p className="text-[11px] text-rose-500 mt-1.5">
                All {selectedSeat.seats} seats for {selectedSeat.title} are currently filled for this term.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Term start (year)
              </label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={termStart}
                  onChange={(e) => setTermStart(e.target.value)}
                  placeholder="2026"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Term end (year)
              </label>
              <div className="relative">
                <CalendarDays className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={termEnd}
                  onChange={(e) => setTermEnd(e.target.value)}
                  placeholder="2029"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Landmark className="w-4 h-4" /> Add to record
            </button>
            {added && (
              <span className="text-xs font-semibold text-emerald-600 animate-[fadeUp_0.3s_ease-out_backwards]">
                Added to the record
              </span>
            )}
          </div>
        </form>

        {/* Seats summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Seats this term</h3>
          {(Object.keys(POSITIONS) as PositionKey[]).map((key) => {
            const p = POSITIONS[key];
            const filled = seatsFilled[key] ?? 0;
            const pct = Math.min(100, (filled / p.seats) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-700">{p.title}</p>
                  <p className="text-[11px] text-slate-400">{filled}/{p.seats}</p>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#B8860B] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Officials list */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Officials on record</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {OFFICIALS.length} shown</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or position"
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
              {(["current", "past", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md capitalize transition-colors ${
                    filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f === "current" ? "Current term" : f === "past" ? "Past terms" : "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">No officials match your search.</p>
          )}
          {filtered.map((o, i) => (
            <div
              key={o.id}
              className="group flex items-center gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-slate-50 transition-colors animate-[fadeUp_0.35s_ease-out_backwards]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Avatar name={o.name} photoUrl={o.photoUrl} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{o.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{o.contact}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 w-36">
                <Landmark className="w-3 h-3 shrink-0" /> {POSITIONS[o.position].title}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                  o.status === "current" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {o.status === "current" ? <Check className="w-2.5 h-2.5" /> : <History className="w-2.5 h-2.5" />}
                {o.status === "current" ? "Current term" : "Past term"}
              </span>
              <span className="hidden md:inline text-[11px] text-slate-400 w-24 text-right shrink-0">
                {o.termStart}–{o.termEnd}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}