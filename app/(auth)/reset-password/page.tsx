import Loading from "@/components/Loading";
import ResetPasswordContent from "@/components/Resetpasswordcontent";

import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default page;