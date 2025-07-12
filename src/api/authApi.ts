"use client";
import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/config/names";
import { LoginDetails, LoginResponse } from "@/types/auth";
import Cookies from "js-cookie";

export const login = async ({ email, password }: LoginDetails): Promise<void> => {
    const url = `${config.apiBaseUrl}/loginofferprodash/`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        toast.error("Unexpectedly Failed to Login");
        throw new Error(`Login failed: ${res.statusText}`);
    }

    const data: LoginResponse = await res.json();

    // Store in localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);

    // Store in cookies for middleware access (expires in e.g. 1 day)
    Cookies.set(ACCESS_TOKEN_KEY, data.access, { expires: 1 });
    Cookies.set(REFRESH_TOKEN_KEY, data.refresh, { expires: 1 });

    toast.success("Login Successfull");

    window.location.href = "/";
};

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    window.location.href = "/signin";
};

export const getToken = (): string | null | undefined => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY);
    }
    return Cookies.get(ACCESS_TOKEN_KEY); // Fallback to cookies if on server, though js-cookie might also be client-only
};

export const getRefreshToken = (): string | null | undefined => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY) || Cookies.get(REFRESH_TOKEN_KEY);
    }
    return Cookies.get(REFRESH_TOKEN_KEY); // Fallback to cookies if on server
};