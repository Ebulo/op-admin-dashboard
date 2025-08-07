"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getToken, logout } from "@/api/authApi";
import { config } from "@/config/config";
import { fetchDataWithAuth } from "@/api/statsAPI";
import { CompletedStats, MonthlyRevenue, PublisherStats } from "@/types/stats";


// GLOBAL CACHE
// let cachedStats: PublisherStats | null = null;
// let cachedRevenue: MonthlyRevenue = {};
// let cachedCompleted: CompletedStats = {};
let cachedKey: string | null = null;

// HELPER
function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    );
}

// MAIN HOOK
export const usePublisherAnalytics = () => {
    const getLocalArray = (key: string): string[] => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    };

    // const [interval, setInterval] = useState<IntervalType>("daily");
    const interval = localStorage.getItem("interval")?.toString();
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState<PublisherStats | null>(null);
    const [revenue, setRevenue] = useState<MonthlyRevenue>({});
    const [completed, setCompleted] = useState<CompletedStats>({});

    const formatDate = (d: Date | null) => d?.toISOString().split("T")[0] ?? "";

    const callAllApi = async () => {
        const selectedGroupByFields = getLocalArray("groupByFields");
        const selectedAppIds = getLocalArray("appIds");
        const selectedCountryCodes = getLocalArray("countryCodes");
        const selectedPublisherIds = getLocalArray("publisherIds");
        const interval = localStorage.getItem("interval")?.toString();
        const dateRangeRaw = localStorage.getItem("dateRange") ?? "";

        let startDate = null;
        let endDate = null;

        if (dateRangeRaw) {
            const dateRange = JSON.parse(dateRangeRaw);

            startDate = new Date(dateRange.startDate);
            endDate = new Date(dateRange.endDate);

            console.log("Parsed Dates:", startDate, endDate);
        }

        const key = `${interval}-${formatDate(startDate)}-${formatDate(endDate)}-${selectedPublisherIds.join(",")}-${selectedAppIds.join(",")}-${selectedCountryCodes.join(",")}-${selectedGroupByFields.join(",")}`;

        const shouldFetch = key !== cachedKey;
        console.log("Hey here is the logs of everything!");

        if (!shouldFetch) return;

        const token = getToken();
        if (!token) {
            toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
            logout();
            return;
        }

        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const publishersParam = selectedPublisherIds.length > 0
                    ? `&publishers=${selectedPublisherIds.join(",")}`
                    : "&all_publishers=true";

                const appsParam = selectedAppIds.length > 0
                    ? `&apps=${selectedAppIds.join(",")}`
                    : "";

                const countriesParam = selectedCountryCodes.length > 0
                    ? `&countries=${selectedCountryCodes.join(",")}`
                    : "";

                const groupByParam = selectedGroupByFields.length > 0
                    ? `&group_by=${selectedGroupByFields.join(",")}`
                    : "&group_by=source";

                const dateParams =
                    startDate && endDate
                        ? `&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`
                        : "";

                const queryParams = `?interval=${interval}${dateParams}${publishersParam}${appsParam}${countriesParam}${groupByParam}`;

                const [fetchedStats, fetchedRevenue, fetchedCompleted] = await Promise.all([
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/stats/${queryParams}`),
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/revenue/${queryParams}`),
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/completed_postbacks/${queryParams}`),
                ]);

                // Cache globally
                // cachedStats = fetchedStats;
                // cachedRevenue = fetchedRevenue;
                // cachedCompleted = fetchedCompleted;
                cachedKey = key;

                // Set locally
                setStats(fetchedStats);
                setRevenue(fetchedRevenue);
                setCompleted(fetchedCompleted);
                // if (!shouldFetch) {
                //     if (cachedStats && cachedRevenue && cachedCompleted) {
                //         setStats(cachedStats);
                //         setRevenue(cachedRevenue);
                //         setCompleted(cachedCompleted);
                //     }
                //     return;
                // }
            } catch (err: unknown) {
                if (isErrorWithMessage(err)) {
                    if (err.message === "Unauthorized") {
                        logout();
                    } else {
                        toast.error(err.message || "Failed to fetch analytics.", { position: "bottom-right" });
                    }
                } else {
                    toast.error("An unexpected error occurred.", { position: "bottom-right" });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }

    useEffect(() => {
        callAllApi();
    }, []);

    useEffect(() => {
        console.log("Updated stats", stats);
        console.log("Updated revenue", revenue);
        console.log("Updated completed", completed);
    }, [stats, revenue, completed]);

    return {
        stats,
        revenue,
        completed,
        loading,
        interval,
        callAllApi,
    };
};