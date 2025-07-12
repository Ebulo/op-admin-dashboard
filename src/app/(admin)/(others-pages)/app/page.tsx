"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect, useState } from "react";
import { columns } from "./data";
import { getApps } from "@/api/appsApi";
import { App } from "@/types/app";

export default function BasicTables() {
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      const data = await getApps();
      setApps(data);
    };

    fetchApps();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Offers" />
      <BasicTableOne data={apps} columns={columns} />
    </div>
  );
}
