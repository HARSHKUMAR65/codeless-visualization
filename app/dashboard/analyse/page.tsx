"use client";
import React from "react";
import DashboardLayout from "@/app/components/DashboardLayout/DashboardLayout";
import { useSearchParams } from "next/navigation";
import Loader from "@/app/components/ui/loader";
import { useGetSinlgleData } from "@/app/hooks/useFile";
import GenericChart from "@/app/components/UserData/SingleVizulize";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // convert id to number safely
  const numericId = id ? parseInt(id, 10) : undefined;

  const { data, isLoading, isError } = useGetSinlgleData(numericId || 0);
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 font-semibold text-lg">
            ⚠️ Something went wrong. Please try again.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-lg">No data found ❌</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <GenericChart data={data.data} />
    </DashboardLayout>
  );
};

export default Page;
