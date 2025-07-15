import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { App } from "@/types/app";
import { getToken } from './authApi';


export const requestCooldowns = new Map<number, number>(); // appId -> timestamp

export const canRequestAppKey = (appId: number): boolean => {
    const lastRequest = requestCooldowns.get(appId);
    if (!lastRequest) return true;
    const now = Date.now();
    return now - lastRequest > 10 * 60 * 1000; // 10 minutes in ms
};


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


// export const requestAppKeys = async (appId: number): Promise<null> => {
//     const token = getToken();

//     if (!token) {
//         toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
//         return null;
//     }

//     try {
//         const response = await fetch(`${config.apiBaseUrl}/publisher/request-app-keys/${appId}/`, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             toast.error("Couldn't generate try again after sometime", { position: "bottom-right" });
//             throw new Error("Failed to fetch apps");
//         }

//         const data = await response.json();
//         toast.success(data.message, { position: "bottom-right" });
//         return null;
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         toast.error(error.message || "Something went wrong", { position: "bottom-right" });
//         return null;
//     }
// };


export const requestAppKeys = async (appId: number): Promise<boolean> => {
    const now = Date.now();
    const lastRequest = requestCooldowns.get(appId);

    if (lastRequest && now - lastRequest < 10 * 60 * 1000) {
        toast.error("You can only request keys every 10 minutes.", { position: "bottom-right" });
        return false;
    }

    const token = getToken();
    if (!token) {
        toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
        return false;
    }

    try {
        const response = await fetch(`${config.apiBaseUrl}/publisher/request-app-keys/${appId}/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            toast.error("Couldn't generate, try again later", { position: "bottom-right" });
            return false;
        }

        const data = await response.json();
        toast.success(data.message, { position: "bottom-right" });
        requestCooldowns.set(appId, now); // store timestamp
        return true;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        toast.error(message, { position: "bottom-right" });
        return false;
    }
};
