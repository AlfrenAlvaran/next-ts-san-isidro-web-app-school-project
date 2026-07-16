import { Suspense } from "react";
import UnauthorizedView from "./unauthorized-view";


export default function UnauthorizedPage() {
  return (
    <Suspense fallback={null}>
      <UnauthorizedView />
    </Suspense>
  );
}