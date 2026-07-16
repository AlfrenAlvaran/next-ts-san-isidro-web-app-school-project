"use client";
import useSWR from "swr";
import axios from "axios";
import { useMemo } from "react";

export type ResidentItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isApproved: boolean;
  isVerified: boolean;
  avatarUrl: string | null;
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
    deltaPct,
    newThisWeek,
    recent,
  };
}