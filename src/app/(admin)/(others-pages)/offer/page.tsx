import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React from "react";
// import Buttons from "../../(ui-elements)/buttons/page";
import { PrimaryButtonWithLeftIcon } from "@/components/ui/button/Buttons";
import { PlusIcon } from "@/icons";
import { columns, offerData } from "./data";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Offers" pageActions={<PrimaryButtonWithLeftIcon size="sm" Icon={<PlusIcon />}>Create Offer</PrimaryButtonWithLeftIcon>} />
      <BasicTableOne data={offerData} columns={columns} />
    </div>
  );
}
