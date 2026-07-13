"use client";
import Loading from "@/components/Loading";
import HouseHoldModal from "@/components/HouseHoldModal";
import { useResidentProfile } from "@/hooks/useResidentProfile";
import { MapPin, Stamp, Users, UserPlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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

  if (loading || !profile) {
    return <Loading />;
  }

  function openAddMember() {
    setModalState({ mode: "create" });
  }

  function openEditMember(member: HouseholdMember) {
    setModalState({ mode: "edit", member });
  }

  function closeModal() {
    setModalState(null);
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
      ...profile,
      houseHoldMembers: [...(profile.houseHoldMembers ?? []), member],
    });
  }

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
      ...profile,
      houseHoldMembers: profile.houseHoldMembers.map((m) =>
        m.id === updated.id ? updated : m
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
      ...profile,
      houseHoldMembers: profile.houseHoldMembers.filter((m) => m.id !== id),
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
                {profile.fullName.split(",").reverse().join(" ").trim()}
              </h1>
              <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {profile.purok} · Household{" "}
                {profile.householdNo ?? ""}
              </p>
            </div>
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
              {profile.houseHoldMembers?.map((m: HouseholdMember) => (
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