"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React from "react";
// import Buttons from "../../(ui-elements)/buttons/page";
import { advertiserData, columns } from "./data";

export default function BasicTables() {
  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Advertisers" pageActions={<PrimaryButtonWithLeftIcon onClick={() => router.push("/advertiser/create/")} size="sm" Icon={<PlusIcon />}>Add New Advertiser</PrimaryButtonWithLeftIcon>} /> */}
      <PageBreadcrumb pageTitle="Advertisers" />
      <BasicTableOne data={advertiserData} columns={columns} />
    </div>
  );
}
