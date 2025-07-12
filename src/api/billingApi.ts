import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { getToken } from './authApi';
import { Billing } from '@/types/billing';

export const getBillings = async (): Promise<Billing[]> => {
    const token = getToken();

    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return [];
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/pub/billing/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch apps");
        }

        const data: Billing[] = await response.json();
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        toast.error(error.message || "Something went wrong");
        return [];
    }
};

export const uploadInvoice = async (id: number, file: File): Promise<boolean> => {
    const token = getToken();
    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return false;
    }

    const formData = new FormData();
    formData.append("invoice_file", file);

    try {
        const response = await fetch(`${config.apiBaseUrl}/pub/billing/${id}/upload-invoice/`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to upload invoice");
        }

        toast.success("Invoice uploaded successfully.");
        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || "Something went wrong");
        } else {
            toast.error("Something went wrong");
        }
        return false;
    }
};

export const createBilling = async (billing_period: string, amount: number, file: File): Promise<boolean> => {
    const token = getToken();
    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return false;
    }

    const formData = new FormData();
    formData.append("invoice_file", file);
    formData.append("billing_period", billing_period);
    formData.append("amount_usd", amount.toString());

    try {
        const response = await fetch(`${config.apiBaseUrl}/pub/billing/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to upload invoice");
        }

        toast.success("Billing created successfully.");
        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || "Something went wrong");
        } else {
            toast.error("Something went wrong");
        }
        return false;
    }
};