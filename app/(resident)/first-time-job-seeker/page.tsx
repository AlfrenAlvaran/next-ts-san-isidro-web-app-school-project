"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ScrollText,
  CheckCircle2,
  Clock,
  Pencil,
  Send,
  PackageCheck,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  UploadCloud,
  FileCheck2,
  X,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";

type JobseekerStatus =
  | "not_applied"
  | "submitted"
  | "under_review"
  | "approved"
  | "released";

type JobseekerApplication = {
  fullName: string;
  address: string;
  purok: string;
  educationalAttainment: string;
  desiredOccupation: string;
  status: JobseekerStatus;
  dateApplied?: string;
  certificateNo?: string;
  remarks?: string;
};

const STEPS: { key: JobseekerStatus; label: string; icon: typeof Clock }[] = [
  { key: "submitted", label: "Submitted", icon: Send },
  { key: "under_review", label: "Under review", icon: Pencil },
  { key: "approved", label: "Approved", icon: CheckCircle2 },
  { key: "released", label: "Ready for release", icon: PackageCheck },
];

const stepIndex = (status: JobseekerStatus) => {
  const order: JobseekerStatus[] = [
    "not_applied",
    "submitted",
    "under_review",
    "approved",
    "released",
  ];
  return order.indexOf(status);
};

const FirstTimeJobseekerPage = () => {
  const [application, setApplication] = useState<JobseekerApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [educationalAttainment, setEducationalAttainment] = useState("");
  const [desiredOccupation, setDesiredOccupation] = useState("");
  const [validId, setValidId] = useState<File | null>(null);
  const [birthCertificate, setBirthCertificate] = useState<File | null>(
    null
  );
  const [agreedDeclaration, setAgreedDeclaration] = useState(false);
  const [agreedOncePerYear, setAgreedOncePerYear] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/jobseeker-application");
      setApplication(response.data.application);
    } catch (error) {
      toast.error("Failed to load your application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (
    file: File | undefined,
    setter: (file: File | null) => void
  ) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be under 5MB");
      return;
    }
    setter(file);
  };

  const canSubmit =
    educationalAttainment.trim().length > 0 &&
    desiredOccupation.trim().length > 0 &&
    !!validId &&
    !!birthCertificate &&
    agreedDeclaration &&
    agreedOncePerYear &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !validId || !birthCertificate) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("educationalAttainment", educationalAttainment);
      formData.append("desiredOccupation", desiredOccupation);
      formData.append("validId", validId);
      formData.append("birthCertificate", birthCertificate);

      const response = await axios.post(
        "/api/jobseeker-application",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setApplication(response.data.application);
      toast.success("Application submitted");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to submit. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const hasApplication = !!application && application.status !== "not_applied";

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
      <Link
        href={"/home"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to home
      </Link>

      <div className="mb-8">
        <p className="text-[#B8860B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
          RA 11261 · Republic Act No. 11261
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          First Time Jobseeker Certificate
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 max-w-2xl">
          A one-time exemption certificate for first-time jobseekers under
          the Barangay, waiving fees for documents needed for employment
          such as police clearance, medical certificate, and NBI clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Info card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
              <h3 className="text-sm font-bold text-slate-900">
                Who can apply
              </h3>
            </div>
            <ul className="space-y-2.5 text-[12px] text-slate-500 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#B8860B]">•</span>
                Filipino citizen, at least 18 years old, residing in the
                barangay
              </li>
              <li className="flex gap-2">
                <span className="text-[#B8860B]">•</span>
                Has not been previously employed at any point in time
              </li>
              <li className="flex gap-2">
                <span className="text-[#B8860B]">•</span>
                Has not availed of this certificate before — one per
                lifetime
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[#B8860B]" />
              <h3 className="text-sm font-bold text-slate-900">
                Good to know
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The certificate is valid only for the specific government
              transaction it was issued for and may only be used once.
              Misrepresentation of jobseeker status is punishable under
              RA 11261.
            </p>
          </div>
        </div>

        {/* RIGHT: Form or status */}
        <div className="lg:col-span-2 space-y-6">
          {hasApplication && application ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-[#B8860B]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Application status
                  </h3>
                </div>
                {application.certificateNo && (
                  <span className="text-[11px] text-slate-400">
                    Ref. {application.certificateNo}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                {STEPS.map((step, i) => {
                  const current = stepIndex(application.status);
                  const active = i <= current - 1;
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                            active
                              ? "bg-[#0F172A] border-[#0F172A] text-white"
                              : "bg-slate-50 border-slate-200 text-slate-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p
                          className={`text-[10px] font-semibold text-center ${
                            active ? "text-slate-900" : "text-slate-300"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`h-px flex-1 -mt-5 ${
                            i < stepIndex(application.status) - 1
                              ? "bg-[#0F172A]"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {application.remarks && (
                <p className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-slate-100 leading-relaxed">
                  {application.remarks}
                </p>
              )}
              {application.status === "released" && (
                <p className="text-[11px] text-emerald-600 mt-6 pt-4 border-t border-slate-100 leading-relaxed font-semibold">
                  Your certificate is ready for pickup at the Barangay Hall.
                  Please bring a valid ID.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-4 h-4 text-[#B8860B]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Application details
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                    Highest educational attainment
                  </label>
                  <select
                    value={educationalAttainment}
                    onChange={(e) => setEducationalAttainment(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                  >
                    <option value="">Select attainment</option>
                    <option value="Elementary Graduate">
                      Elementary Graduate
                    </option>
                    <option value="High School Graduate">
                      High School Graduate
                    </option>
                    <option value="Senior High School Graduate">
                      Senior High School Graduate
                    </option>
                    <option value="College Graduate">
                      College Graduate
                    </option>
                    <option value="Vocational / TESDA Graduate">
                      Vocational / TESDA Graduate
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                    Desired occupation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={desiredOccupation}
                      onChange={(e) => setDesiredOccupation(e.target.value)}
                      placeholder="e.g. Sales associate"
                      className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UploadField
                    label="Valid ID"
                    hint="Any government-issued ID"
                    file={validId}
                    onSelect={(f) => handleFileSelect(f, setValidId)}
                    onClear={() => setValidId(null)}
                    inputId="validId"
                  />
                  <UploadField
                    label="Birth certificate"
                    hint="PSA copy or certified true copy"
                    file={birthCertificate}
                    onSelect={(f) => handleFileSelect(f, setBirthCertificate)}
                    onClear={() => setBirthCertificate(null)}
                    inputId="birthCertificate"
                  />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedDeclaration}
                    onChange={(e) => setAgreedDeclaration(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 accent-[#0F172A]"
                  />
                  <span className="text-[12px] text-slate-500 leading-relaxed">
                    I declare that I have never been previously employed and
                    am applying for my first job.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedOncePerYear}
                    onChange={(e) => setAgreedOncePerYear(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 accent-[#0F172A]"
                  />
                  <span className="text-[12px] text-slate-500 leading-relaxed">
                    I understand this certificate may only be availed once
                    under RA 11261.
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1E293B] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Submit application
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const UploadField = ({
  label,
  hint,
  file,
  onSelect,
  onClear,
  inputId,
}: {
  label: string;
  hint: string;
  file: File | null;
  onSelect: (file: File | undefined) => void;
  onClear: () => void;
  inputId: string;
}) => {
  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
        {label}
      </label>

      {file ? (
        <div className="flex items-center gap-2.5 border border-slate-200 rounded-lg px-3 py-2.5">
          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs text-slate-700 truncate flex-1">
            {file.name}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center gap-1.5 border border-dashed border-slate-200 rounded-lg px-3 py-4 cursor-pointer hover:border-[#B8860B]/40 hover:bg-[#B8860B]/5 transition-colors"
        >
          <UploadCloud className="w-4 h-4 text-slate-300" />
          <span className="text-[11px] font-semibold text-slate-500">
            Upload file
          </span>
          <span className="text-[10px] text-slate-300">{hint}</span>
          <input
            id={inputId}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => onSelect(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
};

export default FirstTimeJobseekerPage;