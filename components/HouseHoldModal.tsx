"use client"

import { MemberModalProps } from "@/constant"
import { X, UserPlus, Pencil } from "lucide-react"
import { useState } from "react"

const RELATIONS = ["Spouse", "Child", "Parent", "Sibling", "Other"]

const HouseHoldModal = ({
  mode = "create",
  member,
  onClose,
  onAdd,
  onEdit,
}: MemberModalProps) => {
  const [name, setName] = useState<string>(member?.name ?? "")
  const [relation, setRelation] = useState<string>(member?.relation ?? RELATIONS[0])
  const [age, setAge] = useState<string>(member?.age != null ? String(member.age) : "")

  const isEdit = mode === "edit"
  const canSubmit = name.trim().length > 2 && age !== "" && Number(age) > 0

  function handleSubmit() {
    const payload = { name: name.trim(), relation, age: Number(age) }

    if (isEdit && member) {
      onEdit({ ...member, ...payload })
    } else {
      onAdd(payload)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-extrabold text-slate-900">
            {isEdit ? "Edit household member" : "Add household member"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          {isEdit
            ? "Update this member's details on household HH-1142."
            : "This adds a member to household HH-1142 on your barangay record."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-2 block">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reyes, Juan D."
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-shadow"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">Relation</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-shadow bg-white"
              >
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">Age</label>
              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="0"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-shadow"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#B8860B] disabled:opacity-30 disabled:pointer-events-none text-white text-sm font-semibold transition-colors"
          >
            {isEdit ? (
              <><Pencil className="w-4 h-4" /> Save changes</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Add member</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HouseHoldModal