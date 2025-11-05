"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { createPublisher } from "@/api/publishersApi";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";

export default function CreatePublisherPage() {
  const router = useRouter();
  const { permissions } = usePermissions();
  const canAdd = !!permissions?.sections.publishers.add;

  const [publisher_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    setBusy(true);
    const created = await createPublisher({ publisher_name, email });
    setBusy(false);
    if (created) router.push("/publishers");
  };

  if (!canAdd) {
    return (
      <div className="p-6">
        <PageBreadcrumb pageTitle="Add Publisher" />
        <div className="text-gray-500">You don’t have permission to add publishers.</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Publisher" />
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1 dark:text-white/90">Publisher Name</label>
          <input
            value={publisher_name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 dark:text-white/90">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.push('/publishers')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

