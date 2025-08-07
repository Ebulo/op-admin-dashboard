"use client";
import React, { useEffect } from "react";
import { usePublisherAnalytics } from "@/hooks/usePublisherAnalytics";
import FilterSortBar from "@/components/ecommerce/FilterBar";
import { NumberMetrics } from "@/components/ecommerce/NumberMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import DynamicLineChart from "@/components/ecommerce/DynamicLineChart";
// import { IntervalType } from "@/types/other";
// import { DateRangeProvider } from "@/context/DateRangeContext";

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const sorts = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Highest Revenue", value: "highest" },
];

export default function Ecommerce() {
  const { stats, revenue, loading, completed, interval, callAllApi } = usePublisherAnalytics();
  // const { stats, revenue, loading, interval, setInterval } = usePublisherAnalytics();
  // alert(`Here is the updates --> ${stats} ${revenue}`)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("publisherIds");
      localStorage.removeItem("appIds");
      localStorage.removeItem("countryCodes");
      localStorage.removeItem("groupByFields");
      localStorage.removeItem("dateRange");
      localStorage.removeItem("interval");
    }
  }, []);

  return (
    <div className="col-span-12 space-y-6 xl:col-span-7">
      <FilterSortBar
        filters={filters}
        sorts={sorts}
        interval={interval}
        onFilterChange={(f) => console.log("Filter changed:", f)}
        onSortChange={(s) => console.log("Sort changed:", s)}
        // onIntervalChange={(intv) => setInterval(intv)}
        callAllApi={callAllApi}
      />

      {!loading && stats && (
        <>
          <NumberMetrics
            totalRevenueUsd={stats.total_revenue_usd}
            totalPostbacks={
              Object.values(stats.postback_counts).reduce((a, b) => a + b, 0)
            }
          />
          <MonthlySalesChart revenue={revenue} />
          <DynamicLineChart
            title="Completed Tasks"
            data={completed}
            interval={interval}
          // onIntervalChange={(intv) => setInterval(intv as IntervalType)}
          />
        </>
      )}
    </div>
  );
}
