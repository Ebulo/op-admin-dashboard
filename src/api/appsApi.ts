import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { App } from "@/types/app";
import { getToken } from './authApi';


export const getApps = async (search = "", filters = {}): Promise<App[]> => {
    const token = getToken();

    if (!token) {
        toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
        return [];
    }

    const params = new URLSearchParams();

    if (search) params.append("search", search);
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.append(key, value as string);
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/admin/apps/?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch apps");
        }

        const data: App[] = await response.json();
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        toast.error(error.message || "Something went wrong", { position: "bottom-right" });
        return [];
    }
};