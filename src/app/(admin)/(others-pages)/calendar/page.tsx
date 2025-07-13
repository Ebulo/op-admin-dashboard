import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import CalendarWrapper from '@/components/calendar/CalendarWrapper';

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <CalendarWrapper />
    </div>
  );
}
