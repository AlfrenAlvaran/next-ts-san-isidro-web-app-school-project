"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  ScrollText,
  CheckCircle2,
  Clock,
  Pencil,
  Send,
  PackageCheck,
  UserPlus,
  User,
  Home as HomeIcon,
  Phone,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Profile } from "@/constant/types";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import ResidentIdCard from "@/components/ResidentIdCard";
import RecordSection from "@/components/RecordSection";
const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/resident-profile");
      // console.log("data",response.data)
      setProfile(response.data.profile);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const margeSave = async (patch: Partial<Profile>) => {
    try {
      await axios.patch("/api/resident-profile", patch);
      setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
      toast.success("Account updated");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update. Please try again.";
      toast.error(message);
    }
  };

  if (loading || !profile) {
    return <Loading />;
  }

  const completeness = (() => {
    const checks = [
      profile.email,
      profile.emergencyName,
      profile.emergencyContact,
      profile.civilStatus,
    ];
    const filled = checks.filter((v) => v && v.trim().length > 0).length;
    return Math.round(30 + (filled / checks.length) * 70);
  })();

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
      {/* Back Home */}
      <Link
        href={"/home"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Bact to home
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#B8860B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
            Resident Record
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Account
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            The information on file with Barangay San Isidro. Keep it current
            for faster document processing.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD  */}
        <div className="space-y-6">
          <ResidentIdCard
            fullName={profile.fullName}
            purok={profile.purok}
            householdNo={profile.householdNo}
            idNumber={profile.idNumber}
            memberSince={profile.memberSince}
            validThru={profile.validThru}
            isVerified={profile.isApproved}
          />
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-900">
                Record completeness
              </p>
              <span className="text-xs font-bold text-[#B8860B] tabular-nums">
                {completeness}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#0F172A] to-[#B8860B] transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {completeness < 100
                ? "Add any missing contact or emergency details to complete your record."
                : "Your resident record is complete."}
            </p>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RecordSection
            icon={User}
            title="Personal information"
            subtitle="As it should appear on issued certificates"
            fields={[
              {
                key: "fullName",
                label: "Full name",
                value: profile.fullName,
                wide: true,
              },
              {
                key: "birthdate",
                label: "Date of birth",
                value: profile.birthdate,
                type: "date",
              },
              {
                key: "sex",
                label: "Sex",
                value: profile.sex,
                type: "select",
                options: ["Female", "Male"],
              },
              {
                key: "civilStatus",
                label: "Civil status",
                value: profile.civilStatus,
                type: "select",
                options: ["Single", "Married", "Widowed", "Separated"],
              },
            ]}
            onSave={margeSave}
          />

          <RecordSection
            icon={HomeIcon}
            title="Address & residency"
            subtitle="Used to verify Purok and household assignment"
            fields={[
              {
                key: "address",
                label: "Complete address",
                value: profile.address,
                wide: true,
              },
              { key: "purok", label: "Purok", value: profile.purok },
              {
                key: "yearsResiding",
                label: "Years residing here",
                value: profile.yearsResiding,
              },
            ]}
            onSave={margeSave}
          />

           <RecordSection
            icon={ShieldAlert}
            title="Emergency contact"
            subtitle="Contacted only in urgent or emergency situations"
            fields={[
              { key: "emergencyName", label: "Full name", value: profile.emergencyName },
              { key: "emergencyRelation", label: "Relation", value: profile.emergencyRelation },
              { key: "emergencyContact", label: "Contact number", value: profile.emergencyContact, wide: true },
            ]}
            onSave={margeSave}
          />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;