"use client";

/* eslint-disable @next/next/no-img-element */
import { Publisher } from "@/types/publisher";
import { deletePublisher } from "@/api/publishersApi";
import { SectionPerms } from "@/types/permissions";
import Link from "next/link";

export const columns = (
  perms: SectionPerms,
  onReload: () => void,
) => [
    {
      header: "Publisher Name",
      accessor: "publisher_name",
      render: (p: Publisher) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>{p.publisher_name}</span>
          <span style={{ fontSize: "0.85em", color: "#7a7a7a" }}>{p.email}</span>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Actions",
      accessor: "id",
      render: (p: Publisher) => (
        <div className="flex items-center gap-2 justify-end">
          {perms.change && (
            <Link
              href={`/publishers/${p.id}`}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Edit
            </Link>
          )}
          {perms.delete && (
            <button
              onClick={async () => {
                const ok = confirm("Delete this publisher?");
                if (!ok) return;
                const success = await deletePublisher(p.id);
                if (success) onReload();
              }}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];
