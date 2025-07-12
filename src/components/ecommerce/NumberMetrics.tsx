// components/ecommerce/NumberMetrics.tsx
"use client";
import React from "react";
// import Badge from "../ui/badge/Badge";
// import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { BoxIconLine, GroupIcon } from "@/icons";

export const NumberMetrics = ({
  totalRevenueUsd,
  totalPostbacks,
  revenueGrowth = 0.0,
  postbacksGrowth = 0.0,
}: {
  totalRevenueUsd: number;
  totalPostbacks: number;
  revenueGrowth?: number;
  postbacksGrowth?: number;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricCard
        title="Total Revenue"
        value={totalRevenueUsd}
        icon={<GroupIcon />}
        metric="$"
        growth={revenueGrowth}
        positive
      />
      <MetricCard
        title="Total Offers Completed"
        value={totalPostbacks}
        icon={<BoxIconLine />}
        growth={postbacksGrowth}
        positive={false}
      />
    </div>
  );
};

const MetricCard = ({
  title,
  metric,
  value,
  icon,
  // growth,
  // positive,
}: {
  title: string;
  metric?: string;
  value: number;
  icon: React.ReactNode;
  growth: number;
  positive: boolean;
}) => {
  // const BadgeIcon = positive ? ArrowUpIcon : ArrowDownIcon;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {metric ?? ""} {" "} {value.toLocaleString()}
          </h4>
        </div>
        {/* <Badge color={positive ? "success" : "error"}>
          <BadgeIcon />
          {Math.abs(growth)}%
        </Badge> */}
      </div>
    </div>
  );
};