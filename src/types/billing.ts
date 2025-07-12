export interface Billing {
    id: number,
    billing_date: string,
    billing_period: string,
    amount_usd: string,
    status: string,
    invoice_file: string | null,
    created_on: string,
    updated_at: string,
    publisher: number,
}

export interface BillingResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Billing[];
}