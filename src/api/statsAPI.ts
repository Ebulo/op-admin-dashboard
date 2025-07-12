import { getToken, logout } from "./authApi";

export const fetchDataWithAuth = async (url: string) => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
        logout();
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `API error: ${res.status}`);
    }

    return res.json();
};