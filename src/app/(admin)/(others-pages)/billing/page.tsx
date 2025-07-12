"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect, useState, useCallback } from "react";
import { columns } from "./data";
import { getBillings } from "@/api/billingApi";
import { Billing } from "@/types/billing";
import { RotateCw } from "lucide-react"; // or any icon you prefer
import Button from "@/components/ui/button/Button";

export default function BillingTables() {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBillings = useCallback(async () => {
    setLoading(true);
    const data = await getBillings();
    setBillings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBillings();
  }, [fetchBillings]);

  return (
    <div>
      <PageBreadcrumb
        pageTitle="My Billings"
        pageActions={
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchBillings}
              size="sm"
            >
              <RotateCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

        }
      />
      <BasicTableOne data={billings} columns={columns(fetchBillings)} showSerialNumber={true} />
    </div>
  );
}
