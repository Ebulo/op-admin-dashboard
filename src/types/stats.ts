// TYPES
export interface PublisherStats {
    publisher_email: string;
    postback_counts: Record<string, number>;
    total_revenue_usd: number;
    total_live_offers: number;
}

export interface RevenueEntry {
    period: string;
    total_revenue_usd: number;
}

export interface CompletedEntry {
    period: string;
    completed_count: number;
}

export interface RevenueEntry {
    period: string;
    total_revenue_usd: number;
}

export interface MonthlyRevenue {
    [source: string]: RevenueEntry[];
}

export interface CompletedStats {
    [source: string]: CompletedEntry[];
}

// export type MonthlyRevenue = RevenueEntry[];
// export type CompletedStats = CompletedEntry[];
