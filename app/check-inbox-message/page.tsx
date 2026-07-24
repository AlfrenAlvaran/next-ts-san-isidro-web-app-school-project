import Loading from "@/components/Loading";
import CheckEmailContent from "@/components/CheckEmailContent";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CheckEmailContent />
    </Suspense>
  );
};

export default page;