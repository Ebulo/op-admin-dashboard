/* eslint-disable @next/next/no-img-element */
import { requestAppKeys } from "@/api/appsApi";
import { OpenLink } from "@/icons";
import { Send } from "lucide-react";

interface App {
    id: number,
    app_name: string,
    app_image_url: string,
    app_link: string,
    postback_url: string,
    dollar_equivalent: number,
    unique_app_key: string,
    created_on: string,
    updated_at: string,
    publisher: number,
}

export const columns = [
    {
        header: "App Name",
        accessor: "app_name",
        render: (app: App) => (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "50px", height: "50px", overflow: "hidden", borderRadius: "8px", border: "2px solid #5339ECAA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                        src={app.app_image_url}
                        alt={app.app_name}
                        style={{ objectFit: "cover", width: "96%", height: "96%", borderRadius: "6px" }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop if fallback fails
                            target.src = "/images/error/snoopy_404.svg"; // Path to your fallback image
                        }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "bold" }}>{app.app_name}</span>
                    <span style={{ fontSize: "0.8em", color: "#888" }}>{app.unique_app_key}</span>
                </div>
            </div>
        ),
    },
    {
        header: "App Link",
        accessor: "app_link",
        render: (app: App) => (
            <a href={app.app_link} style={{ padding: "2px 6px", borderRadius: "10px", background: "#8884", display: 'flex', alignItems: "center", justifyContent: "center", width: "140px", fontSize: "12px", margin: "10px" }}>Open App Page <div style={{ marginLeft: "5px" }}>
                <OpenLink />
            </div></a>
        ),
    },
    { header: "Base Postback URL", accessor: "postback_url" },
    { header: "Dollar Equivalent", accessor: "dollar_equivalent" },
    {
        header: "Request Keys",
        accessor: "app_link",
        render: (app: App) => (
            <div className="flex justify-end">
                <button
                    onClick={() => requestAppKeys(app.id)}
                    className="min-w-[140px] flex items-center justify-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-1 py-2 rounded"
                >
                    <Send size={16} />
                    Send Keys
                </button>
            </div>
        ),
    }
];