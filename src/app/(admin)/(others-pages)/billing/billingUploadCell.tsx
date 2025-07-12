import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Billing } from "@/types/billing";
import { uploadInvoice } from "@/api/billingApi";
import { Dropzone } from "@/components/dropfile/DropFile";

export const InvoiceCell = ({ bill, onUploadSuccess }: { bill: Billing; onUploadSuccess: () => void }) => {
    const [open, setOpen] = useState(false);

    const handleUpload = async (file: File) => {
        const success = await uploadInvoice(bill.id, file);
        if (success) {
            setOpen(false);
            onUploadSuccess();
        }
    };

    return bill.invoice_file ? (
        <a
            href={bill.invoice_file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:underline"
        >
            View Invoice
        </a>
    ) : (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Invoice
            </button>
            {open && (
                <Dropzone
                    open={open}
                    onClose={() => setOpen(false)}
                    onFileSelect={handleUpload}
                    accept={{ "application/pdf": [".pdf"] }}
                    title="Upload Invoice PDF"
                    description="Drag and drop or select a PDF file"
                />
            )}
        </>
    );
};