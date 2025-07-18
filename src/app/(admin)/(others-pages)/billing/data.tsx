import { Billing } from "@/types/billing";
import { BadgeCheck, CheckCircle2, CircleAlert, Clock, XCircle } from "lucide-react";
import { updateBillingStatus } from "@/api/billingApi";
import { JSX } from "react";

export const columns = (setReload: () => void) => [
    {
        header: "BID",
        accessor: "bid",
        render: (bill: Billing) => bill.bid || "N/A",
    },
    {
        header: "Publisher",
        accessor: "publisher_name",
        render: (bill: Billing) => bill.publisher.publisher_name || "N/A",
    },
    {
        header: "Billing Period",
        accessor: "billing_period",
        render: (bill: Billing) => bill.billing_period,
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
            const colorMap: Record<"PENDING" | "SUBMITTED" | "APPROVED" | "PAID", string> = {
                PENDING: "bg-yellow-100 text-yellow-800",
                SUBMITTED: "bg-yellow-200 text-yellow-900",
                APPROVED: "bg-blue-100 text-blue-800",
                PAID: "bg-green-100 text-green-800",
            };

            const iconMap: Record<"PENDING" | "SUBMITTED" | "APPROVED" | "PAID", JSX.Element> = {
                PENDING: <Clock size={14} className="mr-1" />,
                SUBMITTED: <Clock size={14} className="mr-1" />,
                APPROVED: <BadgeCheck size={14} className="mr-1" />,
                PAID: <CheckCircle2 size={14} className="mr-1" />,
            };

            type StatusType = "PENDING" | "SUBMITTED" | "APPROVED" | "PAID";

            return (
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorMap[bill.status as StatusType] || "bg-gray-100 text-gray-800"
                        }`}
                >
                    {iconMap[bill.status as StatusType] || <CircleAlert size={14} className="mr-1" />}
                    {bill.status}
                </span>
            );
        },
    },
    {
        header: "View Invoice",
        accessor: "invoice_file",
        render: (bill: Billing) => {
            return (
                bill.invoice_file ?
                    <a
                        href={bill.invoice_file}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}
                    >
                        View Invoice
                    </a> : <></>
            );
        },
    },

    {
        header: "Actions",
        accessor: "id",
        render: (bill: Billing) => {
            const handleStatusChange = async (nextStatus: "APPROVED" | "PAID" | "PENDING") => {
                const confirmed = confirm(`Are you sure you want to mark this as ${nextStatus}?`);
                if (!confirmed) return;

                const success = await updateBillingStatus(bill.id, nextStatus);
                if (success) setReload();
            };

            if (bill.status === "PAID") {
                return <span className="text-gray-400 italic">No actions</span>;
            }

            if (bill.status === "SUBMITTED") {
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleStatusChange("APPROVED")}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleStatusChange("PENDING")}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>
                );
            }

            if (bill.status === "APPROVED") {
                return (
                    <button
                        onClick={() => handleStatusChange("PAID")}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                        Mark Paid
                    </button>
                );
            }

            return <span className="text-gray-400 italic">No actions</span>;
        }
    }
];
