"use client";
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";
import { useMemo } from "react";
import type { RequestStatus } from "@/data";

export type RequestItem = {
  id: string;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  purpose: string;
  stage: number;
  status: RequestStatus; // "pending" | "released" | "rejected"
  submitted: string; // "YYYY-MM-DD" per your API's toISOString().split("T")[0]
  residentName?: string; // present on admin-scoped endpoint only
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.requests);

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysAgo(n: number, from: Date) {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d;
}

export function useRequests(scope: "mine" | "admin" = "mine") {
  const endpoint = scope === "admin" ? "/api/admin/requests" : "/api/requests";

  const {
    data: requests,
    error,
    isLoading,
    mutate,
  } = useSWR<RequestItem[]>(endpoint, fetcher);

  const createRequest = async (payload: {
    serviceTitle: string;
    category: string;
    fee: string;
    purpose: string;
  }) => {
    try {
      const res = await axios.post("/api/requests", payload);
      const newRequest: RequestItem = res.data.request;
      mutate([newRequest, ...(requests ?? [])], false);
      toast.success(`Request submitted — Ref ${newRequest.referenceNo}`);
      return newRequest;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to submit request. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const updateStatus = async (
    id: string,
    status: "pending" | "released" | "rejected",
  ) => {
    try {
      const res = await axios.patch(`/api/admin/requests/${id}`, { status });
      const updated: RequestItem = res.data.request;
      mutate(
        (list ?? []).map((r) => (r.id === id ? updated : r)),
        false,
      );
      return updated;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update request. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const list = requests ?? [];
  const today = startOfDay(new Date());

  const pendingCount = useMemo(
    () => list.filter((r) => r.status === ("pending" as RequestStatus)).length,
    [list],
  );

  const releasedCount = useMemo(
    () => list.filter((r) => r.status === ("released" as RequestStatus)).length,
    [list],
  );

  const rejectedCount = useMemo(
    () => list.filter((r) => r.status === ("rejected" as RequestStatus)).length,
    [list],
  );

  const countsByStatus = useMemo(() => {
    return list.reduce<Record<string, number>>((acc, r) => {
      const key = String(r.status);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [list]);

  const pendingToday = useMemo(
    () =>
      list.filter(
        (r) =>
          r.status === ("pending" as RequestStatus) &&
          startOfDay(new Date(r.submitted)).getTime() === today.getTime(),
      ).length,
    [list, today],
  );

  const releasedThisWeekChange = useMemo(() => {
    const thisWeekStart = daysAgo(6, today);
    const lastWeekStart = daysAgo(13, today);
    const lastWeekEnd = daysAgo(6, today);

    const isReleased = (r: RequestItem) =>
      r.status === ("released" as RequestStatus);

    const thisWeek = list.filter(
      (r) => isReleased(r) && new Date(r.submitted) >= thisWeekStart,
    ).length;
    const lastWeek = list.filter((r) => {
      const submitted = new Date(r.submitted);
      return (
        isReleased(r) && submitted >= lastWeekStart && submitted < lastWeekEnd
      );
    }).length;

    if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  }, [list, today]);

  const weeklySeries = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const day = daysAgo(6 - i, today);
      const next = daysAgo(5 - i, today);
      const count = list.filter((r) => {
        const submitted = new Date(r.submitted);
        return submitted >= day && submitted < next;
      }).length;
      return {
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        requests: count,
      };
    });
  }, [list, today]);

  const weekOverWeekChange = useMemo(() => {
    const thisWeekStart = daysAgo(6, today);
    const lastWeekStart = daysAgo(13, today);
    const lastWeekEnd = daysAgo(6, today);

    const thisWeekCount = list.filter(
      (r) => new Date(r.submitted) >= thisWeekStart,
    ).length;
    const lastWeekCount = list.filter((r) => {
      const submitted = new Date(r.submitted);
      return submitted >= lastWeekStart && submitted < lastWeekEnd;
    }).length;

    if (lastWeekCount === 0) return thisWeekCount > 0 ? 100 : 0;
    return Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
  }, [list, today]);

  const recent = useMemo(
    () =>
      [...list]
        .sort(
          (a, b) =>
            new Date(b.submitted).getTime() - new Date(a.submitted).getTime(),
        )
        .slice(0, 5),
    [list],
  );

  return {
    requests: list,
    loading: isLoading,
    error,
    createRequest,
    mutate,
    pendingCount,
    releasedCount,
    rejectedCount,
    releasedThisWeekChange,
    countsByStatus,
    pendingToday,
    weeklySeries,
    weekOverWeekChange,
    recent,
    updateStatus,
  };
}
