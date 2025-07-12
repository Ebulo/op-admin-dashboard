import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ImageUploader from "@/components/form/form-elements/ImageUploader";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add New Advertiser" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">

        </div>
        <div className="space-y-6">
          <ImageUploader title={"Upload Profile"} />
        </div>
      </div>
    </div>
  );
}
