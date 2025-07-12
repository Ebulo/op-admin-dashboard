import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { App } from "@/types/app";
import { getToken } from './authApi';


export const getApps = async (): Promise<App[]> => {
    const token = getToken();

    if (!token) {
        toast.error("Not authenticated. Please sign in.");
        return [];
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/integration_apps/`, {
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
        toast.error(error.message || "Something went wrong");
        return [];
    }
};