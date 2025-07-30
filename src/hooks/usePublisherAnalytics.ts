"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getToken, logout } from "@/api/authApi";
import { config } from "@/config/config";
import { IntervalType } from "@/types/other";
import { useDateRange } from "@/context/DateRangeContext";
import { fetchDataWithAuth } from "@/api/statsAPI";
import { CompletedStats, MonthlyRevenue, PublisherStats } from "@/types/stats";
import { useAdminPublisher } from "@/context/AdminPublisherContext";
import { useAllContext } from "@/context/AllOtherContext";


// GLOBAL CACHE
let cachedStats: PublisherStats | null = null;
let cachedRevenue: MonthlyRevenue = {};
let cachedCompleted: CompletedStats = {};
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
    const { startDate, endDate } = useDateRange();
    const { selectedPublisher } = useAdminPublisher();
    const { selectedGroupBy } = useAllContext();
    const [interval, setInterval] = useState<IntervalType>("daily");
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState<PublisherStats | null>(cachedStats);
    const [revenue, setRevenue] = useState<MonthlyRevenue>(cachedRevenue);
    const [completed, setCompleted] = useState<CompletedStats>(cachedCompleted);

    const formatDate = (d: Date | null) => d?.toISOString().split("T")[0] ?? "";
    // const key = `${interval}-${formatDate(startDate)}-${formatDate(endDate)}`;
    // const shouldFetch = key !== cachedKey;
    const key = `${interval}-${formatDate(startDate)}-${formatDate(endDate)}-${selectedPublisher?.id || "self"}-${selectedGroupBy || "source"}`;
    const shouldFetch = key !== cachedKey;

    useEffect(() => {
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
                const publisherParam = selectedPublisher?.id ? `&publisher_id=${selectedPublisher.id}` : "";
                const allPublisherParam = selectedPublisher?.id == null ? `&all_publishers=${true}` : "&all_publishers=false";
                const groupByParam = `&group_by=${selectedGroupBy || "source"}`;
                const dateParams =
                    startDate && endDate
                        ? `&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`
                        : "";

                const [fetchedStats, fetchedRevenue, fetchedCompleted] = await Promise.all([
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/stats/?interval=${interval}${dateParams}${publisherParam}${allPublisherParam}`),
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/revenue/?interval=${interval}${dateParams}${publisherParam}${allPublisherParam}${groupByParam}`),
                    fetchDataWithAuth(`${config.apiBaseUrl}/admin/completed_postbacks/?interval=${interval}${dateParams}${publisherParam}${allPublisherParam}${groupByParam}`),
                ]);

                // Cache globally
                cachedStats = fetchedStats;
                cachedRevenue = fetchedRevenue;
                cachedCompleted = fetchedCompleted;
                cachedKey = key;

                // Set locally
                setStats(fetchedStats);
                setRevenue(fetchedRevenue);
                setCompleted(fetchedCompleted);
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
    }, [interval, startDate, endDate, selectedPublisher, selectedGroupBy]);

    return {
        stats,
        revenue,
        completed,
        loading,
        interval,
        setInterval,
    };
};

