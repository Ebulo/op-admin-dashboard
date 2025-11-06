"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import { createApp, CreatedAppWithKeys, CreateAppPayload } from "@/api/appsApi";
import { listPublishers } from "@/api/publishersApi";
import { Publisher } from "@/types/publisher";

function CreateAppForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { permissions } = usePermissions();
  const canAdd = !!permissions?.sections.apps.add;

  const qpPublisherId = useMemo(() => {
    const v = searchParams?.get('publisher_id');
    return v ? Number(v) : undefined;
  }, [searchParams]);

  const [app_name, setAppName] = useState("");
  const [app_link, setAppLink] = useState("");
  const [postback_url, setPostbackUrl] = useState("");
  const [dollar_equivalent, setDollarEq] = useState<number>(0);
  const [app_image_url, setAppImage] = useState<string>("");
  const [allow_decimal, setAllowDecimal] = useState<boolean>(false);
  const [publisherId, setPublisherId] = useState<number | undefined>(qpPublisherId);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<CreatedAppWithKeys | null>(null);

  useEffect(() => {
    listPublishers("").then(setPublishers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    setBusy(true);
    const payload: CreateAppPayload = {
      app_name,
      app_link,
      postback_url,
      dollar_equivalent,
      app_image_url: app_image_url || undefined,
      allow_decimal,
    };
    if (publisherId) payload.publisher = publisherId;
    const res = await createApp(payload, { publisher_id: publisherId });
    setBusy(false);
    if (res) setCreated(res);
  };

  if (!canAdd) {
    return (
      <div className="p-6">
        <PageBreadcrumb pageTitle="Add App" />
        <div className="text-gray-500">You don’t have permission to add apps.</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Add App" />

      {!created ? (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 dark:text-white/90">App Name</label>
              <input
                value={app_name}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 dark:text-white/90">Dollar Equivalent</label>
              <input
                type="number"
                step="0.01"
                value={dollar_equivalent}
                onChange={(e) => setDollarEq(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/90">App Link</label>
              <input
                value={app_link}
                onChange={(e) => setAppLink(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/90">Base Postback URL</label>
              <input
                value={postback_url}
                onChange={(e) => setPostbackUrl(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/90">App Image URL (optional)</label>
              <input
                value={app_image_url}
                onChange={(e) => setAppImage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 dark:text-white/90">Publisher</label>
              <select
                value={publisherId ?? ''}
                onChange={(e) => setPublisherId(e.target.value ? Number(e.target.value) : undefined)}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="" disabled>
                  Select publisher
                </option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-gray-900">
                    {p.publisher_name} (#{p.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input id="allow_decimal" type="checkbox" checked={allow_decimal} onChange={(e) => setAllowDecimal(e.target.checked)} />
              <label htmlFor="allow_decimal" className="text-sm dark:text-white/90">Allow decimal (optional)</label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" type="button" onClick={() => router.push('/app')}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="max-w-2xl space-y-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-semibold mb-2 text-gray-400">App Created</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">App ID</div>
                <div className="font-mono text-gray-400">{created.id}</div>
              </div>
              <div>
                <div className="text-gray-500">Unique App Key</div>
                <div className="font-mono break-all text-gray-400">{created.unique_app_key}</div>
              </div>
              {created.secret_key && (
                <div className="md:col-span-2">
                  <div className="text-gray-500">Secret Key</div>
                  <div className="font-mono break-all text-gray-400">{created.secret_key}</div>
                </div>
              )}
              {created.enc_key && (
                <div className="md:col-span-2">
                  <div className="text-gray-500">Encryption Key</div>
                  <div className="font-mono break-all text-gray-400">{created.enc_key}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/app')}>Done</Button>
            <Button variant="outline" onClick={() => router.push(`/app/${created.id}`)}>View Details</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateAppPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <CreateAppForm />
    </Suspense>
  );
}
