"use client";
// import { CompletedEntry } from "@/hooks/usePublisherAnalytics";
// import { IntervalType } from "@/types/other";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// // import ReactApexChart from "react-apexcharts";
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { IntervalType } from "@/types/other";
import { CompletedStats } from "@/types/stats";
// import classNames from "classnames";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// interface ChartData {
//     [source: string]: { period: string; completed_count: number }[];
// }

interface Props {
    title: string;
    data: CompletedStats;
    interval: IntervalType;
    onIntervalChange?: (interval: IntervalType) => void;
}

// const intervals: IntervalType[] = ["daily", "monthly", "quarterly", "yearly"];

export default function DynamicLineChart({
    title,
    data,
    interval,
    // onIntervalChange,
}: Props) {
    const categories =
        Object.values(data)[0]?.map((entry) => entry.period) || [];

    const series = Object.entries(data).map(([source, entries]) => ({
        name: source,
        data: entries.map((entry) => entry.completed_count),
    }));

    const options: ApexOptions = {
        chart: {
            type: "area",
            height: 310,
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
            zoom: { enabled: false },
        },
        xaxis: {
            type: "category",
            categories,
            labels: {
                style: { colors: "#6B7280", fontSize: "13px" },
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        tooltip: { shared: true, intersect: false },
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
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Target you&apos;ve set for each {interval}
                    </p>
                </div>

                {/* <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    {intervals.map((intv) => (
                        <button
                            key={intv}
                            onClick={() => onIntervalChange?.(intv)}
                            className={classNames(
                                "px-4 py-1.5 text-sm font-medium transition",
                                intv === interval
                                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-100"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                            )}
                        >
                            {intv.charAt(0).toUpperCase() + intv.slice(1)}
                        </button>
                    ))}
                </div> */}
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