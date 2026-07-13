"use client";
import Loading from "@/components/Loading";
import HouseHoldModal from "@/components/HouseHoldModal";
import { useResidentProfile } from "@/hooks/useResidentProfile";
import {
  MapPin,
  Stamp,
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search as SearchIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useRequests } from "@/hooks/useRequests";
import { MiniProgress, StagePill } from "@/components/Shared";

type HouseholdMember = {
  id: string;
  name: string;
  relation: string;
  age: number;
};

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; member: HouseholdMember }
  | null;

const Page = () => {
  const { profile, loading, saveProfile } = useResidentProfile();
  const [modalState, setModalState] = useState<ModalState>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { requests, loading: requestsLoading } = useRequests();
  const router = useRouter();

  if (loading || !profile) {
    return <Loading />;
  }

  // Narrowed, stable reference for use inside the closures below —
  // TS can't carry the `!profile` guard's narrowing into nested functions.
  const currentProfile = profile;

  function openAddMember() {
    setModalState({ mode: "create" });
  }

  function openEditMember(member: HouseholdMember) {
    setModalState({ mode: "edit", member });
  }

  function closeModal() {
    setModalState(null);
  }

  function goToRequest(id: string) {
    router.push(`/request/${id}`);
  }

  async function handleAddMember(newMember: {
    name: string;
    relation: string;
    age: number;
  }) {
    const res = await fetch("/api/household", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });

    if (!res.ok) {
      const { error } = await res.json();
      console.error(error);
      return;
    }

    const { member } = await res.json();

    saveProfile({
      ...currentProfile,
      houseHoldMembers: [...(currentProfile.houseHoldMembers ?? []), member],
    });
  }

  const activeCount = requests.filter(
    (r) => r.status === "pending" || r.status,
  ).length;
  const releasedCount = requests.filter((r) => r.status === "released").length;

  async function handleEditMember(updated: HouseholdMember) {
    const res = await fetch(`/api/household/${updated.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updated.name,
        relation: updated.relation,
        age: updated.age,
      }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      console.error(error);
      return;
    }

    saveProfile({
      ...currentProfile,
      houseHoldMembers: currentProfile.houseHoldMembers.map((m) =>
        m.id === updated.id ? updated : m,
      ),
    });
  }

  async function handleDeleteMember(id: string) {
    const confirmed = window.confirm("Remove this household member?");
    if (!confirmed) return;

    setDeletingId(id);
    const res = await fetch(`/api/household/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const { error } = await res.json();
      console.error(error);
      return;
    }

    saveProfile({
      ...currentProfile,
      houseHoldMembers: currentProfile.houseHoldMembers.filter(
        (m) => m.id !== id,
      ),
    });
  }

  return (
    <>
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
            Magandang araw
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentProfile.fullName.split(",").reverse().join(" ").trim()}
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {currentProfile.purok} ·
                Household {currentProfile.householdNo ?? ""}
              </p>
            </div>
            <Link
              href={"/request"}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#B8860B] active:scale-[0.97] text-slate-900 hover:text-white text-sm font-semibold rounded-lg transition-all duration-200 shrink-0"
            >
              <Stamp className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Request a Certificate
            </Link>
          </div>
        </div>
        <div className="border-t border-slate-800 relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-3 divide-x divide-slate-800">
            {[
              { value: activeCount, label: "Active requests" },
              {
                value: currentProfile.houseHoldMembers.length,
                label: "Household members",
              },
              { value: releasedCount, label: "Certificates released" },
            ].map((s) => (
              <div
                key={s.label}
                className="py-5 text-center sm:text-left sm:px-2 first:pl-0"
              >
                <p className="text-white text-xl sm:text-2xl font-extrabold tabular-nums">
                  {s.value}
                </p>
                <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Link
            href="/request"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#B8860B] active:scale-[0.97] text-slate-900 hover:text-white text-sm font-semibold rounded-lg transition-all duration-200 shrink-0"
          >
            <Stamp className="w-4 h-4 transition-transform group-hover:rotate-12" />
            Request a Certificate
          </Link>

          {/* My requests */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  My requests
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track the status of every certificate you&apos;ve filed
                </p>
              </div>
              <Link
                href="/request"
                className="text-xs font-semibold text-[#B8860B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                New request <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {requestsLoading ? (
              <p className="text-xs text-slate-400">Loading requests…</p>
            ) : requests.length === 0 ? (
              <p className="text-xs text-slate-400">
                You haven&apos;t filed any certificate requests yet.
              </p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => goToRequest(r.id)}
                    className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 tabular-nums">
                          {r.referenceNo}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">
                          {r.serviceTitle}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {r.purpose} · Filed {r.submitted}
                        </p>
                      </div>
                      <StagePill stage={r.stage} status={r.status} />
                    </div>
                    <MiniProgress stage={r.stage} status={r.status} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Household */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B8860B]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Household members
                </h3>
              </div>
              <button
                onClick={openAddMember}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#0F172A] hover:text-[#B8860B] text-slate-600 flex items-center justify-center transition-colors"
                title="Add household member"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {currentProfile.houseHoldMembers?.map((m: HouseholdMember) => (
                <div key={m.id} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[11px] font-bold shrink-0">
                    {m.name.split(",")[0].slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {m.relation} · {m.age} y/o
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditMember(m)}
                      className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center"
                      title="Edit member"
                    >
                      <Pencil className="w-3 h-3 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      disabled={deletingId === m.id}
                      className="w-6 h-6 rounded-md hover:bg-rose-50 flex items-center justify-center disabled:opacity-40"
                      title="Remove member"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {modalState && (
        <HouseHoldModal
          mode={modalState.mode}
          member={modalState.mode === "edit" ? modalState.member : undefined}
          onClose={closeModal}
          onAdd={handleAddMember}
          onEdit={handleEditMember}
        />
      )}
    </>
  );
};

export default Page;