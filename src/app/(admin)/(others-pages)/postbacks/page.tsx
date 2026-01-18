"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { RotateCw } from "lucide-react";
import { columns } from "./data";
import { getReviewQueue, approvePostback, declinePostback } from "@/api/postbacksApi";
import { PostbackReview } from "@/types/postback";
import { usePermissions } from "@/context/PermissionsContext";

const REVIEW_TASK_TYPE = "Review And Earn";
const REVIEW_STATUS = "SUBMITTED";

export default function PostbacksReviewPage() {
  const { permissions, loading: permLoading } = usePermissions();
  const canView = permissions?.sections.postbacks.view;
  const canChange = permissions?.sections.postbacks.change;
  const [postbacks, setPostbacks] = useState<PostbackReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [decliningId, setDecliningId] = useState<number | null>(null);
  const [aiCheck, setAiCheck] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "decline";
    postback: PostbackReview;
  } | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [imageModal, setImageModal] = useState<{ url: string; title: string } | null>(
    null
  );
  const [zoom, setZoom] = useState(1);

  const assignedAppIds = useMemo(() => {
    if (permissions?.assigned_apps?.length) {
      return permissions.assigned_apps.map((app) => app.id);
    }
    if (permissions?.assigned_app_ids?.length) {
      return permissions.assigned_app_ids;
    }
    return [];
  }, [permissions]);

  const assignedAppIdSet = useMemo(() => new Set(assignedAppIds), [assignedAppIds]);

  const useLocalPagination = assignedAppIds.length > 0;

  const fetchAllPostbacks = useCallback(async () => {
    setLoading(true);
    const data = await getReviewQueue({ noPagination: true });
    setPostbacks(data.results);
    setTotalCount(data.count);
    setLoading(false);
  }, []);

  const fetchPagedPostbacks = useCallback(async (pageNumber: number, pageSize: number) => {
    setLoading(true);
    const data = await getReviewQueue({ page: pageNumber, limit: pageSize });
    setPostbacks(data.results);
    setTotalCount(data.count);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!permLoading && canView && useLocalPagination) {
      fetchAllPostbacks();
    }
  }, [permLoading, canView, useLocalPagination, fetchAllPostbacks]);

  useEffect(() => {
    if (!permLoading && canView && !useLocalPagination) {
      fetchPagedPostbacks(page, limit);
    }
  }, [permLoading, canView, useLocalPagination, page, limit, fetchPagedPostbacks]);

  useEffect(() => {
    setPage(1);
  }, [search, assignedAppIds]);

  const filteredPostbacks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return postbacks.filter((postback) => {
      const taskType = (postback.task_type || "").toLowerCase();
      if (
        (taskType && taskType !== REVIEW_TASK_TYPE.toLowerCase()) ||
        (postback.status || "").toUpperCase() !== REVIEW_STATUS
      ) {
        return false;
      }

      if (
        assignedAppIdSet.size > 0 &&
        (!postback.app_id || !assignedAppIdSet.has(postback.app_id))
      ) {
        return false;
      }

      if (!query) return true;
      const idMatch = String(postback.id).includes(query);
      return (
        idMatch || postback.app_name.toLowerCase().includes(query)
      );
    });
  }, [postbacks, search, assignedAppIdSet]);

  const totalItems = useLocalPagination ? filteredPostbacks.length : totalCount;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const paginatedPostbacks = useMemo(() => {
    if (!useLocalPagination) return filteredPostbacks;
    const start = (page - 1) * limit;
    return filteredPostbacks.slice(start, start + limit);
  }, [filteredPostbacks, limit, page, useLocalPagination]);

  const confirmProcessing =
    confirmAction &&
    (approvingId === confirmAction.postback.id ||
      decliningId === confirmAction.postback.id);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (useLocalPagination) {
      fetchAllPostbacks();
    } else {
      fetchPagedPostbacks(page, limit);
    }
  }, [fetchAllPostbacks, fetchPagedPostbacks, limit, page, useLocalPagination]);

  const openApproveModal = useCallback(
    (postback: PostbackReview) => {
      if (!canChange) return;
      if (postback.status.toUpperCase() !== REVIEW_STATUS) return;
      setConfirmAction({ type: "approve", postback });
      setDeclineReason("");
    },
    [canChange]
  );

  const openDeclineModal = useCallback(
    (postback: PostbackReview) => {
      if (!canChange) return;
      if (postback.status.toUpperCase() !== REVIEW_STATUS) return;
      setConfirmAction({ type: "decline", postback });
      setDeclineReason("");
    },
    [canChange]
  );

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return;
    const target = confirmAction.postback;

    if (confirmAction.type === "approve") {
      setApprovingId(target.id);
      const success = await approvePostback(target.id, { aiCheck });
      setApprovingId(null);
      if (success) {
        setConfirmAction(null);
        handleRefresh();
      }
      return;
    }

    setDecliningId(target.id);
    const success = await declinePostback(target.id, declineReason.trim());
    setDecliningId(null);
    if (success) {
      setConfirmAction(null);
      setDeclineReason("");
      handleRefresh();
    }
  }, [aiCheck, confirmAction, declineReason, handleRefresh]);

  const handleViewEvidence = useCallback((postback: PostbackReview) => {
    if (!postback.evidence_image_url) return;
    setZoom(1);
    setImageModal({
      url: postback.evidence_image_url,
      title: `Postback #${postback.id} evidence`,
    });
  }, []);

  return (
    <div>
      <PageBreadcrumb
        pageTitle="Postback Reviews"
        pageActions={
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <form>
                <div className="relative">
                  <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                    <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by postback ID or app name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px] 2xl:w-[380px]"
                  />
                </div>
              </form>
              <Button onClick={handleRefresh} size="sm" className="h-11">
                <RotateCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
          </div>
        }
      />
      {!permLoading && !canView ? (
        <div className="text-gray-500">You don’t have permission to review postbacks.</div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-2">
              {/* <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                {REVIEW_TASK_TYPE} • {REVIEW_STATUS}
              </span> */}
              {assignedAppIds.length > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                  Assigned apps: {assignedAppIds.join(", ")}
                </span>
              )}
              {search.trim() && (
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                  {useLocalPagination ? "Searching all results" : "Search is page-only"}
                </span>
              )}
            </div>
            <span>
              Showing {Math.min(totalItems, (page - 1) * limit + 1)}-
              {Math.min(totalItems, page * limit)} of {totalItems}
            </span>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading review queue...</div>
          ) : filteredPostbacks.length === 0 ? (
            <div className="text-gray-500">No submitted review postbacks found.</div>
          ) : (
            <>
              {totalItems > 0 && (
                <div className="mb-3 flex flex-wrap items-center justify-start gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={aiCheck}
                      onChange={(e) => setAiCheck(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    Run AI check
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Rows</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                    >
                      {[25, 50, 100, 120].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <BasicTableOne
                data={paginatedPostbacks}
                columns={columns({
                  canChange: !!canChange,
                  onApprove: openApproveModal,
                  onDecline: openDeclineModal,
                  onViewEvidence: handleViewEvidence,
                  approvingId,
                  decliningId,
                })}
                showSerialNumber={true}
              />
              {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    Page {page} of {totalPages}
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(next) =>
                      setPage(Math.max(1, Math.min(totalPages, next)))
                    }
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => {
          setConfirmAction(null);
          setDeclineReason("");
        }}
        className="max-w-[520px] m-4"
      >
        {confirmAction && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
              {confirmAction.type === "approve" ? "Approve postback" : "Decline postback"}
            </h3>
            <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Postback #{confirmAction.postback.id}</span>
                <span className="text-xs text-gray-500">{confirmAction.postback.status}</span>
              </div>
              <div className="mt-2">
                <div className="text-xs uppercase text-gray-500">App</div>
                <div className="font-semibold">{confirmAction.postback.app_name}</div>
              </div>
              <div className="mt-2">
                <div className="text-xs uppercase text-gray-500">Offer</div>
                <div className="font-semibold">{confirmAction.postback.offer_name}</div>
                <div className="text-xs text-gray-500">
                  Key: {confirmAction.postback.offer_key || "N/A"}
                </div>
              </div>
              {confirmAction.postback.evidence_image_url && (
                <button
                  onClick={() => handleViewEvidence(confirmAction.postback)}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View evidence
                </button>
              )}
            </div>
            {confirmAction.type === "decline" && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Decline reason (optional)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. blurry screenshot"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConfirmAction(null);
                  setDeclineReason("");
                }}
                disabled={!!confirmProcessing}
              >
                Cancel
              </Button>
              <button
                onClick={handleConfirmAction}
                disabled={!!confirmProcessing}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${confirmAction.type === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {confirmProcessing
                  ? confirmAction.type === "approve"
                    ? "Approving..."
                    : "Declining..."
                  : confirmAction.type === "approve"
                    ? "Approve"
                    : "Decline"}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={!!imageModal}
        onClose={() => setImageModal(null)}
        className="max-w-[1100px] w-full m-4"
      >
        {imageModal && (
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                  Evidence Preview
                </h3>
                <p className="text-xs text-gray-500">{imageModal.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((prev) => Math.max(1, Number((prev - 0.25).toFixed(2))))}
                  className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.25}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <button
                  onClick={() => setZoom((prev) => Math.min(4, Number((prev + 0.25).toFixed(2))))}
                  className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
            <div className="mt-4 max-h-[70vh] overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <img
                src={imageModal.url}
                alt="Evidence zoom"
                style={{ width: `${zoom * 100}%`, height: "auto", maxWidth: "none" }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
