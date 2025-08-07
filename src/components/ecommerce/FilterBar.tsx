"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar as CalendarIcon, RotateCw } from "lucide-react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { useDateRange } from "@/context/DateRangeContext";
import {
    format,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IntervalType } from "@/types/other";
import { useAllContext } from "@/context/AllOtherContext";
import FilterPanel from "./FilterOptions";
import Button from "../ui/button/Button";

interface FilterOption {
    label: string;
    value: string;
}

interface SortOption {
    label: string;
    value: string;
}


const intervals: IntervalType[] = [null, "daily", "monthly", "quarterly", "yearly"];
interface FilterSortBarProps {
    filters?: FilterOption[];
    sorts?: SortOption[];
    onFilterChange?: (filter: string) => void;
    onSortChange?: (sort: string) => void;
    onDateChange?: (date: Date) => void;
    callAllApi: () => void;
}


const groupByOptions = [
    { label: "Source", value: "source" },
    { label: "Publisher", value: "publisher" },
    { label: "App", value: "app" },
];


export default function FilterSortBar({
    callAllApi,
}: FilterSortBarProps) {
    const { startDate, endDate, setStartDate, setEndDate } = useDateRange();
    const { selectedGroupBy, setSelectedGroupBy } = useAllContext();

    const [interval, setInterval] = useState<IntervalType>("daily");

    const [showPicker, setShowPicker] = useState(false);

    const handleRangeChange = (ranges: RangeKeyDict) => {
        const { startDate, endDate } = ranges.selection;
        const dateRange = {
            "startDate": startDate,
            "endDate": endDate,
        }
        if (typeof window !== "undefined")
            localStorage.setItem("dateRange", JSON.stringify(dateRange))
        setStartDate(startDate as Date);
        setEndDate(endDate as Date);
        setShowPicker(false);
    };

    const selectionRange = {
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
        key: "selection",
    };

    // const [publishers, setPublishers] = useState<Publisher[]>([]);
    // useEffect(() => {
    //     const fetch = async () => {};
    //     fetch();
    // }, []);

    const refreshContent = useCallback(async () => {
        callAllApi();
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
        <div className="sticky top-20 z-30 mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black/95" style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
            <div className="" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>

                {/* Date Range Picker */}
                <div className="flex flex-col min-w-[150px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Filter
                    </label>
                    <FilterPanel />
                </div>

                {/* Group By Dropdown */}
                <div className="flex flex-col min-w-[150px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Group By
                    </label>
                    <select
                        value={selectedGroupBy || "source"}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (typeof window !== "undefined")
                                localStorage.setItem("groupByFields", JSON.stringify([val]));
                            setSelectedGroupBy(e.target.value)
                        }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        {groupByOptions.map((groupBy) => (
                            <option key={groupBy.value} value={groupBy.value}>
                                {groupBy.label}
                            </option>
                        ))}
                    </select>
                </div>
            </ div>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
            <div className="" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div className="relative min-w-[200px]">
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                        Date Range
                    </label>
                    <button
                        onClick={() => setShowPicker((prev) => !prev)}
                        className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <span>
                            {format(selectionRange.startDate, "dd/MM/yyyy")} - {format(selectionRange.endDate, "dd/MM/yyyy")}
                        </span>
                        <CalendarIcon className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" />
                    </button>

                    {showPicker && (
                        // make width fitcontent
                        <div className="absolute z-50 mt-2 rounded-md border bg-white p-2 shadow-lg">
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleRangeChange}
                                moveRangeOnFirstSelection={false}
                                ranges={[selectionRange]}
                                months={1}
                                direction="horizontal"
                            />
                        </div>
                    )}
                </div>

                {/* Interval Switcher */}
                <div className="flex flex-col min-w-[200px]">
                    <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                        Interval
                    </label>
                    <select
                        value={interval ?? "None"}
                        // onChange={(e) => onIntervalChange(e.target.value as IntervalType)}
                        onChange={(e) => { if (typeof window !== "undefined") localStorage.setItem("interval", e.target.value); setInterval(e.target.value as IntervalType) }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        {intervals.map((intv) => (
                            <option key={intv ?? "not-null"} value={intv ?? "None"}>
                                {!intv ? "None" : (intv?.charAt(0).toUpperCase() + intv!.slice(1))}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add a refresh button */}
                <div className="flex items-end gap-2">
                    <Button onClick={refreshContent} size="xsm">
                        <RotateCw size={16} className={false ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
}
