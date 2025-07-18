"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { columns } from "./data";
import { getAdminBillings } from "@/api/billingApi";
import { Billing } from "@/types/billing";
import { RotateCw } from "lucide-react";
import Button from "@/components/ui/button/Button";

const STATUS_OPTIONS = ["ALL", "PENDING", "SUBMITTED", "APPROVED", "PAID"];

export default function BillingTables() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [filtered, setFiltered] = useState<Billing[]>([]);
  // const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SUBMITTED");
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchBillings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminBillings("");
      setBillings(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch billings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchBillings();
      hasFetched.current = true;
    }
  }, [fetchBillings]);

  useEffect(() => {
    // const lower = search.toLowerCase();

    const timeout = setTimeout(() => {
      let filteredData = [...billings];

      if (statusFilter !== "ALL") {
        filteredData = filteredData.filter(
          (b) => b.status.toUpperCase() === statusFilter
        );
      }

      // if (lower.trim()) {
      //   filteredData = filteredData.filter(
      //     (b) =>
      //       b.publisher?.publisher_name?.toLowerCase().includes(lower) ||
      //       b.publisher?.email?.toLowerCase().includes(lower) ||
      //       b.billing_period?.toLowerCase().includes(lower) ||
      //       b.status?.toLowerCase().includes(lower)
      //   );
      // }

      setFiltered(filteredData);
    }, 300);

    return () => clearTimeout(timeout);
  }, [statusFilter, billings]);

  // const handleSearch = (query: string) => setSearch(query);

  return (
    <div>
      <PageBreadcrumb
        pageTitle="All Billings"
        pageActions={
          <div className="flex items-center gap-2">
            {/* <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search billing..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </form> */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-fit rounded-lg border border-gray-200 px-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 ml-2"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "ALL Status" : status}
                </option>
              ))}
            </select>
            <Button onClick={fetchBillings} size="sm">
              <RotateCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        }
      />
      <BasicTableOne
        data={filtered}
        columns={columns(fetchBillings)}
        showSerialNumber={true}
      />
    </div>
  );
}
