import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { getToken } from './authApi';
import { Billing, BillingResponse } from '@/types/billing';

export const getAdminBillings = async (search = "", filters = {}): Promise<Billing[]> => {
    const token = getToken();
    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return [];
    }

    const params = new URLSearchParams();

    if (search) params.append("search", search);
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.append(key, value as string);
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/admin/billings/?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch billings");
        }

        const data: BillingResponse = await response.json();

        console.log("Data --> ", data.results);

        return data.results;
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message || "Something went wrong");
        } else {
            toast.error("Something went wrong");
        }
        return [];
    }
};

export const updateBillingStatus = async (id: number, status: "APPROVED" | "PAID"): Promise<boolean> => {
    const token = getToken();
    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return false;
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/admin/billings/${id}/`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err?.detail || "Failed to update billing");
        }

        toast.success("Billing updated successfully.");
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

// export const uploadInvoice = async (id: number, file: File): Promise<boolean> => {
//     const token = getToken();
//     if (!token) {
//         toast.error("Not authenticated. Please sign in.");
//         return false;
//     }

//     const formData = new FormData();
//     formData.append("invoice_file", file);

//     try {
//         const response = await fetch(`${config.apiBaseUrl}/pub/billing/${id}/upload-invoice/`, {
//             method: "PATCH",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             body: formData,
//         });

//         if (!response.ok) {
//             const errData = await response.json();
//             throw new Error(errData.error || "Failed to upload invoice");
//         }

//         toast.success("Invoice uploaded successfully.");
//         return true;
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             toast.error(error.message || "Something went wrong");
//         } else {
//             toast.error("Something went wrong");
//         }
//         return false;
//     }
// };
