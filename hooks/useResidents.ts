"use client";
import useSWR from "swr";
import axios from "axios";
import { useMemo } from "react";

export type ResidentItem = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  isApproved: boolean;
  isVerified: boolean;
  avatarUrl: string | null;
  birthdate: string | null;
  age: number | null;
  sex: "Male" | "Female" | null;
  civilStatus: "Single" | "Married" | "Widowed" | "Separated" | null;
  address: string | null;
  purok: string | null;
  householdNo: string | null;
  idNumber: string | null;
  yearsResiding: string | null;
  memberSince: string | null;
  joined: string; // "YYYY-MM-DD"
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.residents);

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysAgo(n: number, from: Date) {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d;
}

export function useResidents() {
  const { data: residents, error, isLoading, mutate } = useSWR<ResidentItem[]>(
    "/api/admin/residents",
    fetcher
  );

  const list = residents ?? [];
  const today = startOfDay(new Date());

  const totalCount = list.length;

  const approvedCount = useMemo(
    () => list.filter((r) => r.isApproved).length,
    [list]
  );
  const pendingApprovalCount = useMemo(
    () => list.filter((r) => !r.isApproved).length,
    [list]
  );
  const verifiedCount = useMemo(
    () => list.filter((r) => r.isVerified).length,
    [list]
  );
  const unverifiedCount = useMemo(
    () => list.filter((r) => !r.isVerified).length,
    [list]
  );

  const deltaPct = useMemo(() => {
    const thisWeekStart = daysAgo(6, today);
    const lastWeekStart = daysAgo(13, today);
    const lastWeekEnd = daysAgo(6, today);

    const thisWeekCount = list.filter(
      (r) => new Date(r.joined) >= thisWeekStart
    ).length;
    const lastWeekCount = list.filter((r) => {
      const joined = new Date(r.joined);
      return joined >= lastWeekStart && joined < lastWeekEnd;
    }).length;

    if (lastWeekCount === 0) return thisWeekCount > 0 ? 100 : 0;
    return Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
  }, [list, today]);

  const newThisWeek = useMemo(() => {
    const thisWeekStart = daysAgo(6, today);
    return list.filter((r) => new Date(r.joined) >= thisWeekStart).length;
  }, [list, today]);

  // Real distribution by purok, derived from actual ResidentProfile.purok values —
  // residents with no purok set are grouped under "Unassigned"
  const byPurok = useMemo(() => {
    const groups = new Map<string, { residents: number; households: Set<string> }>();

    for (const r of list) {
      const key = r.purok?.trim() || "Unassigned";
      if (!groups.has(key)) {
        groups.set(key, { residents: 0, households: new Set() });
      }
      const g = groups.get(key)!;
      g.residents += 1;
      if (r.householdNo) g.households.add(r.householdNo);
    }

    return Array.from(groups.entries())
      .map(([purok, g]) => ({
        purok,
        residents: g.residents,
        households: g.households.size,
      }))
      .sort((a, b) => b.residents - a.residents);
  }, [list]);

  const totalHouseholds = useMemo(() => {
    const households = new Set(
      list.filter((r) => r.householdNo).map((r) => r.householdNo)
    );
    return households.size;
  }, [list]);

  // Sex distribution — residents with no sex set are grouped under "Unspecified"
  const bySex = useMemo(() => {
    const groups = new Map<string, number>();
    for (const r of list) {
      const key = r.sex ?? "Unspecified";
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    return Array.from(groups.entries())
      .map(([sex, count]) => ({ sex, count }))
      .sort((a, b) => b.count - a.count);
  }, [list]);

  // Civil status distribution — residents with no civilStatus set are grouped under "Unspecified"
  const byCivilStatus = useMemo(() => {
    const groups = new Map<string, number>();
    for (const r of list) {
      const key = r.civilStatus ?? "Unspecified";
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    return Array.from(groups.entries())
      .map(([civilStatus, count]) => ({ civilStatus, count }))
      .sort((a, b) => b.count - a.count);
  }, [list]);

  // Average age across residents with a known age
  const averageAge = useMemo(() => {
    const withAge = list.filter(
      (r): r is ResidentItem & { age: number } => r.age !== null
    );
    if (withAge.length === 0) return null;
    const sum = withAge.reduce((acc, r) => acc + r.age, 0);
    return Math.round((sum / withAge.length) * 10) / 10;
  }, [list]);

  const recent = useMemo(
    () =>
      [...list]
        .sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
        .slice(0, 5),
    [list]
  );

  return {
    residents: list,
    loading: isLoading,
    error,
    mutate,
    totalCount,
    approvedCount,
    pendingApprovalCount,
    verifiedCount,
    unverifiedCount,
    deltaPct,
    newThisWeek,
    byPurok,
    totalHouseholds,
    bySex,
    byCivilStatus,
    averageAge,
    recent,
  };
}