"use client";
import { useEffect, useRef, useState } from "react";
import { Search, Filter } from "lucide-react";
import classNames from "classnames";
import { Publisher } from "@/types/publisher";
import { getPublishers } from "@/api/pubLists";
// import { useAdminPublisher } from "@/context/AdminPublisherContext";
import { useAllContext } from "@/context/AllOtherContext";
import { App } from "@/types/app";
import { getApps } from "@/api/appsApi";

const filterCategories = [
    { key: "publisher", label: "Publisher" },
    { key: "app", label: "App" },
    { key: "country", label: "Country" },
    { key: "source", label: "Source" },
];

export default function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("publisher");
    const [search, setSearch] = useState("");

    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [apps, setApps] = useState<App[]>([]);
    // const apps = [
    //     { id: 1, app_name: "CaptchaGo" },
    //     { id: 2, app_name: "Brainy" },
    // ];
    const countries = ["IN", "US"];
    const sources = ["offerpro", "offer18", "mega_offer"];

    const [selected, setSelected] = useState<{ [key: string]: string[] }>({
        publisher: [],
        app: [],
        country: [],
        source: [],
    });

    const {
        setSelectedPublisherIds,
        setSelectedAppIds,
        setSelectedCountryCodes,
    } = useAllContext();

    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load publishers
    useEffect(() => {
        if (selectedCategory === "publisher") {
            getPublishers().then(setPublishers);
        }
        if (selectedCategory == "app") {
            getApps().then(setApps);
        }
    }, [selectedCategory]);

    const getOptions = () => {
        if (selectedCategory === "publisher") {
            return publishers
                .filter((p) =>
                    p.publisher_name.toLowerCase().includes(search.toLowerCase())
                )
                .map((p) => p.publisher_name);
        }
        if (selectedCategory === "app") {
            return apps
                .filter((app) =>
                    app.app_name.toLowerCase().includes(search.toLowerCase())
                )
                .map((app) => app.app_name);
        }
        if (selectedCategory === "country") {
            return countries.filter((c) =>
                c.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedCategory === "source") {
            return sources.filter((c) =>
                c.toLowerCase().includes(search.toLowerCase())
            );
        }
        return [];
    };

    // const toggleValue = (val: string) => {
    //     const current = selected[selectedCategory];
    //     const updated = current.includes(val)
    //         ? current.filter((v) => v !== val)
    //         : [...current, val];

    //     const updatedSelected = { ...selected, [selectedCategory]: updated };
    //     setSelected(updatedSelected);

    //     // Sync with context
    //     if (selectedCategory === "publisher") {
    //         const ids = publishers
    //             .filter((p) => updated.includes(p.publisher_name))
    //             .map((p) => p.id);
    //         alert(`Yo did you change app? ${selectedCategory} ${ids} ${current} ${updated}`);
    //         setSelectedPublisherIds(ids);
    //     }
    //     if (selectedCategory === "app") {
    //         const ids = apps
    //             .filter((a) => updated.includes(a.name))
    //             .map((a) => a.id);
    //         alert(`Yo did you change app? ${selectedCategory} ${ids}`);
    //         setSelectedAppIds(ids);
    //     }
    //     if (selectedCategory === "country") {
    //         alert(`Yo did you change app? ${selectedCategory} ${updated}`);
    //         setSelectedCountryCodes(updated);
    //     }
    // };

    const toggleValue = (val: string) => {
        const current = selected[selectedCategory];
        const updated = current.includes(val)
            ? current.filter((v) => v !== val)
            : [...current, val];

        const updatedSelected = { ...selected, [selectedCategory]: updated };
        setSelected(updatedSelected);

        if (selectedCategory === "publisher") {
            const ids = publishers
                .filter((p) => updated.includes(p.publisher_name))
                .map((p) => p.id);
            localStorage.setItem("publisherIds", JSON.stringify(ids));
        }
        if (selectedCategory === "app") {
            const ids = apps
                .filter((a) => updated.includes(a.app_name))
                .map((a) => a.id);
            localStorage.setItem("appIds", JSON.stringify(ids));
        }
        if (selectedCategory === "country") {
            localStorage.setItem("countryCodes", JSON.stringify(updated));
        }
        if (selectedCategory === "source") {
            localStorage.setItem("sources", JSON.stringify(updated));
        }
    };

    // const clearAll = () => {
    //     setSelected({
    //         publisher: [],
    //         app: [],
    //         country: [],
    //     });
    //     setSelectedPublisherIds([]);
    //     setSelectedAppIds([]);
    //     setSelectedCountryCodes([]);
    // };
    const clearAll = () => {
        const empty = {
            publisher: [],
            app: [],
            country: [],
        };
        setSelected(empty);
        localStorage.setItem("publisherIds", JSON.stringify([]));
        localStorage.setItem("appIds", JSON.stringify([]));
        localStorage.setItem("countryCodes", JSON.stringify([]));
        localStorage.setItem("sources", JSON.stringify([]));
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium",
                    isOpen
                        ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20"
                        : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                )}
            >
                <Filter className="w-4 h-4" />
                Filter
                <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    {Object.values(selected).reduce((a, b) => a + b.length, 0)}
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-[700px] rounded-lg border bg-white shadow-xl dark:bg-black dark:border-gray-700">
                    <div className="flex h-[300px]">
                        {/* Sidebar filter categories */}
                        <div className="w-[180px] border-r p-3 dark:border-gray-700">
                            {filterCategories.map((item) => (
                                <button
                                    key={item.key}
                                    className={classNames(
                                        "w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition dark:text-gray-300",
                                        selectedCategory === item.key
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30"
                                            : "hover:bg-gray-100 dark:hover:bg-white/[0.05]"
                                    )}
                                    onClick={() => {
                                        setSelectedCategory(item.key);
                                        setSearch("");
                                    }}
                                >
                                    {item.label}
                                    {selected[item.key] && selected[item.key].length > 0 && (
                                        <span className="ml-2 rounded-full bg-gray-300 px-2 text-xs dark:bg-gray-600 text-white">
                                            {selected[item.key].length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Options panel */}
                        <div className="flex-1 p-4">
                            <div className="mb-2 flex items-center border rounded-md px-2 py-1 dark:border-gray-700">
                                <Search className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100"
                                />
                            </div>

                            <div className="h-[180px] overflow-y-auto text-sm pr-2">
                                {getOptions().map((val) => (
                                    <div
                                        key={val}
                                        onClick={() => toggleValue(val)}
                                        className={classNames(
                                            "cursor-pointer rounded-md px-3 py-2 mb-1 hover:bg-gray-100 dark:hover:bg-white/[0.08]  dark:text-gray-300",
                                            selected[selectedCategory].includes(val)
                                                ? "bg-blue-100 dark:bg-blue-800/40 text-blue-800"
                                                : ""
                                        )}
                                    >
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(selected).flatMap(([key, values]) =>
                                values.map((val) => (
                                    <span
                                        key={`${key}-${val}`}
                                        className="flex items-center gap-1 rounded-full bg-blue-40 px-3 py-1 text-xs text-blue-800 dark:bg-blue-800/40"
                                    >
                                        {key}: {val}
                                        <button
                                            className="ml-1 text-xs"
                                            onClick={() => {
                                                const updated = selected[key].filter((v) => v !== val);
                                                const newSelected = { ...selected, [key]: updated };
                                                setSelected(newSelected);

                                                // Sync again
                                                if (key === "publisher") {
                                                    const ids = publishers
                                                        .filter((p) => updated.includes(p.publisher_name))
                                                        .map((p) => p.id);
                                                    setSelectedPublisherIds(ids);
                                                    localStorage.setItem("publisherIds", JSON.stringify(ids));
                                                }
                                                if (key === "app") {
                                                    const ids = apps
                                                        .filter((a) => updated.includes(a.app_name))
                                                        .map((a) => a.id);
                                                    setSelectedAppIds(ids);
                                                    localStorage.setItem("appIds", JSON.stringify(ids));
                                                }
                                                if (key === "country") {
                                                    setSelectedCountryCodes(updated);
                                                    localStorage.setItem("countryCodes", JSON.stringify(updated));

                                                }
                                                if (key === "source") {
                                                    // setSelectedCountryCodes(updated);
                                                    localStorage.setItem("sources", JSON.stringify(updated));
                                                }
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white"
                                onClick={clearAll}
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
