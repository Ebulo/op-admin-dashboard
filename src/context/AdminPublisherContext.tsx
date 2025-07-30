// context/AdminPublisherContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { Publisher } from "@/types/publisher";

interface AdminPublisherContextType {
    selectedPublisher: Publisher | null;
    setSelectedPublisher: (publisher: Publisher | null) => void;
    // allPublisher: string;
    // setAllPublisher: (publisher: string) => void;
}

const AdminPublisherContext = createContext<AdminPublisherContextType | undefined>(undefined);

export const AdminPublisherProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    // const [allPublisher, setAllPublisher] = useState<string>("true");
    return (
        <AdminPublisherContext.Provider value={{ selectedPublisher, setSelectedPublisher }}>
            {children}
        </AdminPublisherContext.Provider>
    );
};

export const useAdminPublisher = () => {
    const context = useContext(AdminPublisherContext);
    console.log("Publisher Context: ", context);
    if (!context) {
        throw new Error("useAdminPublisher must be used within AdminPublisherProvider");
    }
    return context;
};