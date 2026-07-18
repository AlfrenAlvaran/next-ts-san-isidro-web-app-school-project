"use client";

import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => {
  axios.get(url).then((res) => res.data.summary);
};
