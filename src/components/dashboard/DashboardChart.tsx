import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SalesOverviewChart from "./SalesOverviewChart";
import RevenueProfitChart from "./RevenueProfitChart";
import ProductCategoriesChart from "./ProductCategoriesChart";
import SaleTrendChart from "./SaleTrendChart";

const DashboardCharts = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[430px] rounded-lg w-full" />
        <Skeleton className="h-[430px] rounded-lg w-full" />
        <Skeleton className="h-[350px] rounded-lg w-full" />
        <Skeleton className="h-[350px] rounded-lg w-full" />
        <Skeleton className="h-[350px] rounded-lg w-full" />
      </div>
    );
  }

  return (
    <div className=" py-8 flex flex-col flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <SalesOverviewChart />
        <RevenueProfitChart />
        <ProductCategoriesChart />
        <SaleTrendChart />
      </div>
    </div>
  );
};

export default DashboardCharts;
