import { Dialog } from "@mui/material";
import { Accept, useDropzone } from "react-dropzone";
import { useState } from "react";

export const Dropzone = ({
    open,
    onClose,
    onFileSelect,
    title,
    description,
    accept,
}: {
    open: boolean;
    onClose: () => void;
    onFileSelect: (file: File) => void;
    title: string;
    description?: string;
    accept: Accept;
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept,
        maxFiles: 1,
        onDrop: (accepted) => {
            if (accepted.length) setSelectedFile(accepted[0]);
        },
    });

    const handleSubmit = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
            setSelectedFile(null);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                setSelectedFile(null);
                onClose();
            }}
            PaperProps={{
                className:
                    "backdrop-blur-sm bg-white/80 w-full max-w-lg rounded-xl p-6 shadow-lg",
            }}
        >
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>

                <div
                    {...getRootProps()}
                    className="border-dashed border-2 border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                >
                    <input {...getInputProps()} />
                    <p className="text-gray-600">
                        {description || "Drag & drop your file here or click to select a file"}
                    </p>
                    {selectedFile && (
                        <p className="mt-3 text-sm text-green-700 font-medium">
                            Selected: {selectedFile.name}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                    className={`mt-5 w-full px-4 py-2 text-sm font-semibold rounded transition ${selectedFile
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Submit Invoice
                </button>
            </div>
        </Dialog>
    );
};