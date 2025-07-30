"use client";
import React, { useEffect, useState } from "react";
// import { useState } from "react";

import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { useDateRange } from "@/context/DateRangeContext";
import { IntervalType } from "@/types/other";
import classNames from "classnames";
import { Publisher } from "@/types/publisher";
import { getPublishers } from "@/api/pubLists";
import { useAdminPublisher } from "@/context/AdminPublisherContext";
import { useAllContext } from "@/context/AllOtherContext";

interface FilterOption {
    label: string;
    value: string;
}

interface SortOption {
    label: string;
    value: string;
}


const intervals: IntervalType[] = ["daily", "monthly", "quarterly", "yearly"];
interface FilterSortBarProps {
    filters?: FilterOption[];
    sorts?: SortOption[];
    interval: IntervalType;
    onFilterChange?: (filter: string) => void;
    onSortChange?: (sort: string) => void;
    onDateChange?: (date: Date) => void;
    onIntervalChange: (interval: IntervalType) => void;
}


const groupByOptions = [
    { label: "Source", value: "source" },
    { label: "Publisher", value: "publisher" },
    { label: "App", value: "app" },
];


export default function FilterSortBar({
    // onDateChange,
    interval,
    onIntervalChange,
}: FilterSortBarProps) {
    // const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
    const { selectedPublisher, setSelectedPublisher } = useAdminPublisher();
    const { selectedGroupBy, setSelectedGroupBy } = useAllContext();

    const [publishers, setPublishers] = useState<Publisher[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const result = await getPublishers();
            setPublishers(result);
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!startDate && !endDate) {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            setStartDate(lastWeek);
            setEndDate(today);
        }
    }, [startDate, endDate, setStartDate, setEndDate]);


    return (
        <div className="sticky top-20 z-30 mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black/95">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                {/* Date Range Picker */}
                <div className="flex flex-col min-w-[250px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Date Range
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Start Date"
                                className="w-[110px] rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">to</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="End Date"
                            className="w-[110px] rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        />
                    </div>
                </div>

                {/* Interval Switcher */}
                <div className="flex flex-col min-w-[200px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Interval
                    </label>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                        {intervals.map((intv) => (
                            <button
                                key={intv}
                                onClick={() => onIntervalChange(intv)}
                                className={classNames(
                                    "flex-1 min-w-[70px] px-3 py-1.5 text-sm font-medium rounded-md transition",
                                    intv === interval
                                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-100"
                                        : "bg-gray-100 dark:text-gray-200 text-black hover:bg-gray-200 dark:bg-white/[0.02] dark:hover:bg-white/[0.06]"
                                )}
                            >
                                {intv.charAt(0).toUpperCase() + intv.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Publisher Dropdown */}
                <div className="flex flex-col min-w-[200px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Publisher
                    </label>
                    <select
                        value={selectedPublisher?.id || "ALL"}
                        onChange={(e) => {
                            const id = parseInt(e.target.value);
                            const pub = publishers.find((p) => p.id === id) || null;
                            setSelectedPublisher(pub);
                        }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="ALL">Aggregate</option>
                        {publishers.map((publisher) => (
                            <option key={publisher.id} value={publisher.id}>
                                {publisher.publisher_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Group By Dropdown */}
                <div className="flex flex-col min-w-[150px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Group By
                    </label>
                    <select
                        value={selectedGroupBy || "source"}
                        onChange={(e) => setSelectedGroupBy(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        {groupByOptions.map((groupBy) => (
                            <option key={groupBy.value} value={groupBy.value}>
                                {groupBy.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}


// "use client";
// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import { Calendar } from "lucide-react";
// import { useDateRange } from "@/context/DateRangeContext";
// import { IntervalType } from "@/types/other";
// import classNames from "classnames";
// import { Publisher } from "@/types/publisher";
// import { getPublishers } from "@/api/pubLists";
// import { useAdminPublisher } from "@/context/AdminPublisherContext";
// import { useAllContext } from "@/context/AllOtherContext";

// const intervals: IntervalType[] = ["daily", "monthly", "quarterly", "yearly"];

// const groupByOptions = [
//     { label: "Source", value: "source" },
//     { label: "Publisher", value: "publisher" },
//     { label: "App", value: "app" },
// ];

// interface FilterSortBarProps {
//     interval: IntervalType;
//     onIntervalChange: (interval: IntervalType) => void;
// }

// export default function FilterSortBar({ interval, onIntervalChange }: FilterSortBarProps) {
//     const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
//     const { selectedPublisher, setSelectedPublisher } = useAdminPublisher();
//     const { selectedGroupBy, setSelectedGroupBy } = useAllContext();
//     const [publishers, setPublishers] = useState<Publisher[]>([]);

//     useEffect(() => {
//         const fetch = async () => {
//             const result = await getPublishers();
//             setPublishers(result);
//         };
//         fetch();
//     }, []);

//     useEffect(() => {
//         if (!startDate && !endDate) {
//             const today = new Date();
//             const lastWeek = new Date();
//             lastWeek.setDate(today.getDate() - 7);
//             setStartDate(lastWeek);
//             setEndDate(today);
//         }
//     }, [startDate, endDate, setStartDate, setEndDate]);

//     return (
//         <div className="sticky top-20 z-30 mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] backdrop-blur-md">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 {/* Date Range Picker */}
//                 <div className="flex flex-col">
//                     <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
//                         Date Range
//                     </label>
//                     <div className="flex items-center gap-2">
//                         <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                             <DatePicker
//                                 selected={startDate}
//                                 onChange={(date) => setStartDate(date)}
//                                 dateFormat="yyyy-MM-dd"
//                                 placeholderText="Start Date"
//                                 className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//                             />
//                         </div>
//                         <span className="text-gray-700 dark:text-gray-300">to</span>
//                         <div className="flex items-center gap-2">
//                             <DatePicker
//                                 selected={endDate}
//                                 onChange={(date) => setEndDate(date)}
//                                 dateFormat="yyyy-MM-dd"
//                                 placeholderText="End Date"
//                                 className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Interval Switcher */}
//                 <div className="flex flex-col">
//                     <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
//                         Interval
//                     </label>
//                     <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
//                         {intervals.map((intv) => (
//                             <button
//                                 key={intv}
//                                 onClick={() => onIntervalChange(intv)}
//                                 className={classNames(
//                                     "px-4 py-1.5 text-sm font-medium transition",
//                                     intv === interval
//                                         ? "bg-white text-gray-900 shadow-sm dark:bg-gray-100"
//                                         : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/[0.02] dark:hover:bg-white/[0.06]"
//                                 )}
//                             >
//                                 {intv.charAt(0).toUpperCase() + intv.slice(1)}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Publisher Dropdown */}
//                 <div className="flex flex-col">
//                     <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
//                         Publisher
//                     </label>
//                     <select
//                         value={selectedPublisher?.id || "ALL"}
//                         onChange={(e) => {
//                             const id = parseInt(e.target.value);
//                             const pub = publishers.find((p) => p.id === id) || null;
//                             setSelectedPublisher(pub);
//                         }}
//                         className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//                     >
//                         <option value="ALL">Aggregate</option>
//                         {publishers.map((publisher) => (
//                             <option key={publisher.id} value={publisher.id}>
//                                 {publisher.publisher_name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Group By Dropdown */}
//                 <div className="flex flex-col">
//                     <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
//                         Group By
//                     </label>
//                     <select
//                         value={selectedGroupBy || "source"}
//                         onChange={(e) => setSelectedGroupBy(e.target.value)}
//                         className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//                     >
//                         {groupByOptions.map((groupBy) => (
//                             <option key={groupBy.value} value={groupBy.value}>
//                                 {groupBy.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//         </div>
//     );
// }