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

export default function FilterSortBar({
    // onDateChange,
    interval,
    onIntervalChange,
}: FilterSortBarProps) {
    // const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
    const { selectedPublisher, setSelectedPublisher } = useAdminPublisher();

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
        // <div className="sticky top-20 z-30 mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] backdrop-blur-md">
        <div className="sticky top-20 z-30 mb-6 flex justify-between flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] backdrop-blur-md">

            {/* Date Picker */}
            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Start Date"
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    />
                </div>
                <span className="text-gray-700 dark:text-gray-300">to</span>
                <div className="flex items-center gap-2">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="End Date"
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    />
                </div>
            </div>

            {/* Interval Switcher */}
            <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {intervals.map((intv) => (
                    <button
                        key={intv}
                        onClick={() => onIntervalChange(intv)}
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
            </div>
            {/* Publisher Dropdown */}
            <div className="min-w-[200px]">
                <select
                    value={selectedPublisher?.id || ""}
                    onChange={(e) => {
                        const id = parseInt(e.target.value);
                        const pub = publishers.find((p) => p.id === id) || null;
                        console.log("Publisher Set: ", pub);

                        setSelectedPublisher(pub);
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                    <option value="">Select Publisher</option>
                    {publishers.map((publisher) => (
                        <option key={publisher.id} value={publisher.id}>
                            {publisher.publisher_name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}