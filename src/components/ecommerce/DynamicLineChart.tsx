// "use client";
// import React from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import { IntervalType } from "@/types/other";
// import { CompletedStats } from "@/types/stats";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
// interface Props {
//     title: string;
//     data: CompletedStats;
//     interval: IntervalType;
//     onIntervalChange?: (interval: IntervalType) => void;
// }

// export default function DynamicLineChart({
//     title,
//     data,
//     interval,
// }: Props) {
//     const categories =
//         Object.values(data)[0]?.map((entry) => entry.period) || [];

//     const series = Object.entries(data).map(([source, entries]) => ({
//         name: source,
//         data: entries.map((entry) => entry.completed_count),
//     }));

//     const options: ApexOptions = {
//         chart: {
//             type: "area",
//             height: 310,
//             toolbar: { show: false },
//             fontFamily: "Outfit, sans-serif",
//             zoom: { enabled: false },
//         },
//         xaxis: {
//             type: "category",
//             categories,
//             labels: {
//                 style: { colors: "#6B7280", fontSize: "13px" },
//             },
//         },
//         stroke: {
//             curve: "smooth",
//             width: 2,
//         },
//         fill: {
//             type: "gradient",
//             gradient: {
//                 shadeIntensity: 1,
//                 opacityFrom: 0.3,
//                 opacityTo: 0,
//                 stops: [0, 100],
//             },
//         },
//         dataLabels: { enabled: false },
//         tooltip: { shared: true, intersect: false },
//         legend: {
//             position: "top",
//             horizontalAlign: "left",
//             fontSize: "13px",
//             labels: { colors: "#374151" },
//         },
//         yaxis: {
//             labels: {
//                 style: {
//                     colors: "#6B7280",
//                     fontSize: "13px",
//                 },
//             },
//         },
//         grid: {
//             borderColor: "#E5E7EB",
//             strokeDashArray: 4,
//         },
//     };

//     return (
//         <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
//             <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
//                         {title}
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                         Target you&apos;ve set for each {interval}
//                     </p>
//                 </div>

//             </div>

//             <ReactApexChart
//                 options={options}
//                 series={series}
//                 type="area"
//                 height={310}
//             />
//         </div>
//     );
// }

"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
// import { IntervalType } from "@/types/other";
import { CompletedStats } from "@/types/stats";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
    title: string;
    data: CompletedStats;
    // interval: IntervalType;
}

export default function DynamicLineChart({ title, data }: Props) {
    // ✅ Step 1: Get all unique periods across all series
    const allPeriods = new Set<string>();
    Object.values(data).forEach((entries) => {
        entries.forEach((entry) => allPeriods.add(entry.period));
    });

    const categories = Array.from(allPeriods).sort();

    // ✅ Step 2: Prepare series with missing values as 0
    const series = Object.entries(data).map(([source, entries]) => {
        const periodMap = Object.fromEntries(entries.map(e => [e.period, e.completed_count]));
        const chartData = categories.map(period => periodMap[period] ?? 0);

        return { name: source, data: chartData };
    });

    // ✅ Step 3: Better UI options
    const options: ApexOptions = {
        chart: {
            type: "area",
            height: 310,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
            zoom: { enabled: false },
        },
        xaxis: {
            categories,
            labels: {
                style: { colors: "#6B7280", fontSize: "13px" },
            },
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0.8,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        markers: {
            size: 4,
            hover: { size: 6 },
        },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"], // consistent color palette
        dataLabels: { enabled: false },
        tooltip: {
            shared: true,
            intersect: false,
            theme: "dark",
            y: {
                formatter: (val) => val.toString(),
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "left",
            fontSize: "13px",
            labels: { colors: "#374151" },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#6B7280",
                    fontSize: "13px",
                },
            },
        },
        grid: {
            borderColor: "#E5E7EB",
            strokeDashArray: 4,
        },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    legend: { position: "bottom" },
                },
            },
        ],
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Completed postbacks per {localStorage.getItem("interval")}
                    </p>
                </div>
            </div>

            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={310}
            />
        </div>
    );
}

// interface Props {
//     title: string;
//     data: CompletedEntry[];
//     interval: IntervalType;
//     onIntervalChange?: (interval: IntervalType) => void;
// }

// export default function DynamicLineChart({ title, data, interval }: Props) {
//     const categories = data.map((entry) => entry.period);
//     const series = [{
//         name: "Completed Tasks",
//         data: data.map((entry) => entry.completed_count),
//     }];

//     const options: ApexOptions = {
//         chart: {
//             type: "area",
//             height: 310,
//             toolbar: { show: false },
//             fontFamily: "Outfit, sans-serif",
//             zoom: { enabled: false },
//         },
//         xaxis: {
//             type: "category",
//             categories,
//             labels: {
//                 style: { colors: "#6B7280", fontSize: "13px" },
//             },
//         },
//         stroke: { curve: "smooth", width: 2 },
//         fill: {
//             type: "gradient",
//             gradient: {
//                 shadeIntensity: 1,
//                 opacityFrom: 0.3,
//                 opacityTo: 0,
//                 stops: [0, 100],
//             },
//         },
//         dataLabels: { enabled: false },
//         tooltip: { shared: true, intersect: false },
//         legend: {
//             position: "top",
//             horizontalAlign: "left",
//             fontSize: "13px",
//             labels: { colors: "#374151" },
//         },
//         yaxis: {
//             labels: {
//                 style: {
//                     colors: "#6B7280",
//                     fontSize: "13px",
//                 },
//             },
//         },
//         grid: {
//             borderColor: "#E5E7EB",
//             strokeDashArray: 4,
//         },
//     };

//     return (
//         <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
//             <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
//                         {title}
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                         Tasks completed per {interval}
//                     </p>
//                 </div>
//             </div>
//             <ReactApexChart options={options} series={series} type="area" height={310} />
//         </div>
//     );
// }