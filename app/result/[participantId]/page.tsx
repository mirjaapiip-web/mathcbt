import { Suspense } from "react";
import { ResultSummary } from "@/components/result-summary";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Hasil Battle",
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="exam-shell min-h-screen p-6">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_380px]">
            <Skeleton className="h-[620px]" />
            <Skeleton className="h-[420px]" />
          </div>
        </div>
      }
    >
      <ResultSummary />
    </Suspense>
  );
}
