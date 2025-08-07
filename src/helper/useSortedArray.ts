"use client";

import { useEffect, useState } from "react";

export const useStoredArray = (key: string): string[] => {
    const [value, setValue] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored ? JSON.parse(stored) : []);
    }, [key]);

    return value;
};