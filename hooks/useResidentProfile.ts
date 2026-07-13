"use client"
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";
import { Profile } from "@/constant/types";

const fetcher = (url: string) => axios.get(url).then(res=>res.data.profile)

export function useResidentProfile() {
  const { data: profile, error, isLoading, mutate } = useSWR<Profile>(
    "/api/resident-profile",
    fetcher
  );

  const saveProfile = async (patch: Partial<Profile>) => {
    try {
      await axios.patch("/api/resident-profile", patch);
      mutate({ ...profile, ...patch } as Profile, false); // optimistic update
      toast.success("Account updated");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update. Please try again.";
      toast.error(message);
    }
  };

  return { profile, loading: isLoading, error, saveProfile };
}