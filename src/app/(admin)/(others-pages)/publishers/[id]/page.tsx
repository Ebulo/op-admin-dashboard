"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { getPublisher, updatePublisher } from "@/api/publishersApi";
import { useParams, useRouter } from "next/navigation";
import { Publisher } from "@/types/publisher";
import { usePermissions } from "@/context/PermissionsContext";

export default function PublisherDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { permissions } = usePermissions();
  const canChange = !!permissions?.sections.publishers.change;
  const canView = !!permissions?.sections.publishers.view;

  const [item, setItem] = useState<Publisher | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return;
    getPublisher(id).then(setItem);
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !canChange) return;
    setBusy(true);
    const ok = await updatePublisher(item.id, { publisher_name: item.publisher_name, email: item.email });
    setBusy(false);
    if (ok) router.push('/publishers');
  };

  if (!canView) {
    return (
      <div className="p-6">
        <PageBreadcrumb pageTitle="Publisher" />
        <div className="text-gray-500">You don’t have permission to view this publisher.</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Publisher" />
      {!item ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form onSubmit={handleSave} className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm mb-1 dark:text-white/90">Publisher Name</label>
            <input
              value={item.publisher_name}
              onChange={(e) => setItem({ ...(item as Publisher), publisher_name: e.target.value })}
              disabled={!canChange}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 dark:text-white/90">Email</label>
            <input
              type="email"
              value={item.email}
              onChange={(e) => setItem({ ...(item as Publisher), email: e.target.value })}
              disabled={!canChange}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
            />
          </div>
          <div className="flex gap-2">
            {canChange && (
              <Button type="submit" disabled={busy}>
                {busy ? "Saving..." : "Save"}
              </Button>
            )}
            <Button variant="outline" type="button" onClick={() => router.push('/publishers')}>
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

