// // context/DateRangeContext.tsx
// "use client";
// import React, { createContext, useContext, useState, ReactNode } from "react";

// interface DateRangeContextProps {
//     startDate: Date | null;
//     endDate: Date | null;
//     setStartDate: (date: Date | null) => void;
//     setEndDate: (date: Date | null) => void;
// }

// const DateRangeContext = createContext<DateRangeContextProps | undefined>(undefined);

// export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
//     const [startDate, setStartDate] = useState<Date | null>(null);
//     const [endDate, setEndDate] = useState<Date | null>(null);

//     return (
//         <DateRangeContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
//             {children}
//         </DateRangeContext.Provider>
//     );
// };

// export const useDateRange = () => {
//     const context = useContext(DateRangeContext);
//     if (!context) throw new Error("useDateRange must be used within DateRangeProvider");
//     return context;
// };

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DateRangeContextProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
}

const DateRangeContext = createContext<DateRangeContextProps | undefined>(undefined);

const DATE_STORAGE_KEY = "publisher_date_range";

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
    const [startDate, setStartDateState] = useState<Date | null>(null);
    const [endDate, setEndDateState] = useState<Date | null>(null);

    // Load initial values from sessionStorage on mount
    useEffect(() => {
        const stored = sessionStorage.getItem(DATE_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.startDate) setStartDateState(new Date(parsed.startDate));
                if (parsed.endDate) setEndDateState(new Date(parsed.endDate));
            } catch (e) {
                console.error("Failed to parse stored date range:", e);
            }
        }
    }, []);

    // Persist to sessionStorage when either date changes
    useEffect(() => {
        const payload = {
            startDate: startDate?.toISOString() ?? null,
            endDate: endDate?.toISOString() ?? null,
        };
        sessionStorage.setItem(DATE_STORAGE_KEY, JSON.stringify(payload));
    }, [startDate, endDate]);

    return (
        <DateRangeContext.Provider
            value={{
                startDate,
                endDate,
                setStartDate: setStartDateState,
                setEndDate: setEndDateState,
            }}
        >
            {children}
        </DateRangeContext.Provider>
    );
};

export const useDateRange = () => {
    const context = useContext(DateRangeContext);
    if (!context) throw new Error("useDateRange must be used within DateRangeProvider");
    return context;
};