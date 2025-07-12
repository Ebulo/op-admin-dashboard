/* eslint-disable @next/next/no-img-element */
import { Billing } from "@/types/billing";
import dayjs from "dayjs";
import { InvoiceCell } from "./billingUploadCell";
import { JSX } from "react";
import { BadgeCheck, CheckCircle2, CircleAlert, Clock } from "lucide-react";

export const columns = (setReload: () => void) => [
    // Add a serial number column

    {
        header: "Billing Date",
        accessor: "billing_date",
        render: (bill: Billing) => dayjs(bill.billing_date).format("MMM D, YYYY"),
    },
    {
        header: "Billing Period",
        accessor: "billing_period",
        render: (bill: Billing) =>
            dayjs(`01/${bill.billing_period}`, "DD/MM/YYYY").format("MM YYYY"),
    },
    {
        header: "Amount",
        accessor: "amount_usd",
        render: (bill: Billing) => `$${parseFloat(bill.amount_usd).toFixed(2)}`,
    },
    {
        header: "Status",
        accessor: "status",
        render: (bill: Billing) => {
            const colorMap: Record<string, string> = {
                PENDING: "bg-yellow-100 text-yellow-800",
                APPROVED: "bg-blue-100 text-blue-800",
                PAID: "bg-green-100 text-green-800",
            };

            const iconMap: Record<string, JSX.Element> = {
                PENDING: <Clock size={14} className="mr-1" />,
                APPROVED: <BadgeCheck size={14} className="mr-1" />,
                PAID: <CheckCircle2 size={14} className="mr-1" />,
            };

            return (
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorMap[bill.status] || "bg-gray-100 text-gray-800"
                        }`}
                >
                    {iconMap[bill.status] || <CircleAlert size={14} className="mr-1" />}
                    {bill.status}
                </span>
            );
        },
    },
    {
        header: "Invoice",
        accessor: "invoice_file",
        render: (bill: Billing) => <InvoiceCell bill={bill} onUploadSuccess={setReload} />,
    },
];