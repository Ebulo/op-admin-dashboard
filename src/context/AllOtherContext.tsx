// context/AllOtherContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

interface AllOtherContextType {
    selectedGroupBy: string;
    setSelectedGroupBy: (groupBy: string) => void;
}

const AllOtherContext = createContext<AllOtherContextType | undefined>(undefined);

export const AllOtherDetailProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedGroupBy, setSelectedGroupBy] = useState<string>("source");

    return (
        <AllOtherContext.Provider value={{ selectedGroupBy, setSelectedGroupBy }}>
            {children}
        </AllOtherContext.Provider>
    );
};

export const useAllContext = () => {
    const context = useContext(AllOtherContext);
    console.log("Publisher Context: ", context);

    if (!context) {
        throw new Error("useAdminPublisher must be used within AdminPublisherProvider");
    }
    return context;
};