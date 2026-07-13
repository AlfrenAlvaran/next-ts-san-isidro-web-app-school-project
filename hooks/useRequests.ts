"use client";
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";
import type { RequestStatus } from "@/data";

export type RequestItem = {
  id: string;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  purpose: string;
  stage: number;
  status: RequestStatus;
  submitted: string;
};

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.requests);

export function useRequests() {
  const {
    data: requests,
    error,
    isLoading,
    mutate,
  } = useSWR<RequestItem[]>("/api/requests", fetcher);

  const createRequest = async (payload: {
    serviceTitle: string;
    category: string;
    fee: string;
    purpose: string;
  }) => {
    try {
      const res = await axios.post("/api/requests", payload);
      const newRequest: RequestItem = res.data.request;

      // Optimistic-ish: append the newly created request to the cache
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

  return {
    requests: requests ?? [],
    loading: isLoading,
    error,
    createRequest,
    mutate,
  };
}