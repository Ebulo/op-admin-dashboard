// context/AllOtherContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

interface AllOtherContextType {
    selectedGroupBy: string;
    setSelectedGroupBy: (groupBy: string) => void;

    selectedGroupByFields: number[];
    setSelectedGroupByFields: (groupByFields: number[]) => void;
    selectedAppIds: number[];
    setSelectedAppIds: (appIds: number[]) => void;
    selectedCountryCodes: string[];
    setSelectedCountryCodes: (countryCodes: string[]) => void;
    selectedPublisherIds: number[];
    setSelectedPublisherIds: (publisherIds: number[]) => void;
}

const AllOtherContext = createContext<AllOtherContextType | undefined>(undefined);

export const AllOtherDetailProvider = ({ children }: { children: React.ReactNode }) => {
    // let groupByFields = "null";
    // if (typeof window !== "undefined")
    //     groupByFields = (localStorage.getItem("groupByFields") ? JSON.parse(localStorage.getItem("groupByFields") ?? "")[0] : "null") ?? "null";
    const [selectedGroupBy, setSelectedGroupBy] = useState<string>("null");
    const [selectedGroupByFields, setSelectedGroupByFields] = useState<number[]>([]);
    const [selectedAppIds, setSelectedAppIds] = useState<number[]>([]);
    const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>([]);
    const [selectedPublisherIds, setSelectedPublisherIds] = useState<number[]>([]);


    return (
        <AllOtherContext.Provider value={{
            selectedGroupBy, setSelectedGroupBy,
            selectedGroupByFields, setSelectedGroupByFields,
            selectedAppIds, setSelectedAppIds,
            selectedCountryCodes, setSelectedCountryCodes,
            selectedPublisherIds, setSelectedPublisherIds
        }}>
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