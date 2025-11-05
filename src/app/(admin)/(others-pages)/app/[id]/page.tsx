"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { getApp, updateApp } from "@/api/appsApi";
import { useParams, useRouter } from "next/navigation";
import { App } from "@/types/app";
import { usePermissions } from "@/context/PermissionsContext";

export default function AppDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { permissions } = usePermissions();
  const canChange = !!permissions?.sections.apps.change;
  const canView = !!permissions?.sections.apps.view;

  const [item, setItem] = useState<App | null>(null);
  const [busy, setBusy] = useState(false);

  const id = useMemo(() => Number(params.id), [params.id]);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    getApp(id).then(setItem);
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !canChange) return;
    setBusy(true);
    const ok = await updateApp(item.id, {
      app_name: item.app_name,
      app_link: item.app_link,
      postback_url: item.postback_url,
      dollar_equivalent: item.dollar_equivalent,
      app_image_url: item.app_image_url,
    });
    setBusy(false);
    if (ok) router.push('/app');
  };

  if (!canView) {
    return (
      <div className="p-6">
        <PageBreadcrumb pageTitle="App" />
        <div className="text-gray-500">You don’t have permission to view this app.</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="App Details" />
      {!item ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form onSubmit={handleSave} className="max-w-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 dark:text-white/40">App Name</label>
              <input
                value={item.app_name}
                onChange={(e) => setItem({ ...(item as App), app_name: e.target.value })}
                disabled={!canChange}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-white/40">Dollar Equivalent</label>
              <input
                type="number"
                step="0.01"
                value={item.dollar_equivalent}
                onChange={(e) => setItem({ ...(item as App), dollar_equivalent: Number(e.target.value) })}
                disabled={!canChange}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/40">App Link</label>
              <input
                value={item.app_link}
                onChange={(e) => setItem({ ...(item as App), app_link: e.target.value })}
                disabled={!canChange}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/40">Base Postback URL</label>
              <input
                value={item.postback_url}
                onChange={(e) => setItem({ ...(item as App), postback_url: e.target.value })}
                disabled={!canChange}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/40">App Image URL</label>
              <input
                value={item.app_image_url}
                onChange={(e) => setItem({ ...(item as App), app_image_url: e.target.value })}
                disabled={!canChange}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 disabled:opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-white/40">Unique App Key</label>
              <input
                value={item.unique_app_key}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-white/5 dark:text-white/90"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-white/40">Publisher ID</label>
              <input
                value={item.publisher}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-white/5 dark:text-white/90"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {canChange && (
              <Button type="submit" disabled={busy}>
                {busy ? "Saving..." : "Save"}
              </Button>
            )}
            <Button variant="outline" type="button" onClick={() => router.push('/app')}>
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

