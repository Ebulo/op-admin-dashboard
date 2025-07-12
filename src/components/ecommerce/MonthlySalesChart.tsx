// "use client";

"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type MonthlyRevenue = {
  [source: string]: {
    period: string;
    total_revenue_usd: number;
  }[];
};

export default function MonthlySalesChart({ revenue }: { revenue: MonthlyRevenue }) {
  // Step 1: Get all unique months across all sources
  const allMonths = new Set<string>();
  Object.values(revenue).forEach((entries) => {
    entries.forEach((entry) => allMonths.add(entry.period));
  });

  const months = Array.from(allMonths).sort();

  // Step 2: Prepare series for ApexCharts
  const series = Object.entries(revenue).map(([source, entries]) => {
    // Create a month → revenue map for this source
    const revenueMap = Object.fromEntries(entries.map(e => [e.period, e.total_revenue_usd]));

    // Fill missing months with 0
    const data = months.map(month => revenueMap[month] ?? 0);

    return {
      name: source,
      data,
    };
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    xaxis: {
      categories: months,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
      },
    },
  };

  return (
    <div className="rounded-2xl border p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
        Monthly Revenue by Source
      </h3>
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
}

// import { RevenueEntry } from "@/hooks/usePublisherAnalytics";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// // import ReactApexChart from "react-apexcharts";
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export default function MonthlySalesChart({ revenue }: { revenue: RevenueEntry[] }) {
//   const months = revenue.map(r => r.period);
//   const values = revenue.map(r => r.total_revenue_usd);

//   const series = [{
//     name: "Revenue",
//     data: values,
//   }];

//   const options: ApexOptions = {
//     chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
//     xaxis: { categories: months },
//     plotOptions: {
//       bar: { horizontal: false, columnWidth: "50%", borderRadius: 6 },
//     },
//     dataLabels: { enabled: false },
//     stroke: { show: true, width: 2, colors: ["transparent"] },
//     legend: { position: "top" },
//     tooltip: {
//       y: { formatter: (val: number) => `$${val.toFixed(2)}` },
//     },
//   };

//   return (
//     <div className="rounded-2xl border p-5 dark:border-gray-800 dark:bg-white/[0.03]">
//       <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
//         Monthly Revenue
//       </h3>
//       <ReactApexChart options={options} series={series} type="bar" height={300} />
//     </div>
//   );
// }
