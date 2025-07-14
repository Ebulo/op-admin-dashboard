import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { getToken } from './authApi';
import { Publisher, PublisherResponse } from '@/types/publisher';

export const getPublishers = async (): Promise<Publisher[]> => {
    const token = getToken();

    if (!token) {
        toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
        return [];
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/admin/publishers_list/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch publishers");
        }

        const pubRes: PublisherResponse = await response.json();
        console.log("pub res --> ", pubRes);

        return pubRes.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        toast.error(error.message || "Something went wrong", { position: "bottom-right" });
        return [];
    }
};
