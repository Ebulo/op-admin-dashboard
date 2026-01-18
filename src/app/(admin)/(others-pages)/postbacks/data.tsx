/* eslint-disable @next/next/no-img-element */
import { PostbackReview } from "@/types/postback";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "N/A";
  }
  return date.toLocaleString();
};

export const columns = ({
  canChange,
  onApprove,
  onDecline,
  onViewEvidence,
  approvingId,
  decliningId,
}: {
  canChange: boolean;
  onApprove: (postback: PostbackReview) => void;
  onDecline: (postback: PostbackReview) => void;
  onViewEvidence: (postback: PostbackReview) => void;
  approvingId: number | null;
  decliningId: number | null;
}) => [
    {
      header: "Postback",
      accessor: "id",
      render: (postback: PostbackReview) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-800 dark:text-white/90">
            #{postback.id}
          </span>
          {/* <span className="text-xs text-gray-500">
          {postback.task_type || "Review Queue"}
        </span> */}
        </div>
      ),
    },
    {
      header: "App",
      accessor: "app_name",
      render: (postback: PostbackReview) => (
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img
              src={postback.app_image_url || "/images/error/snoopy_404.svg"}
              alt={postback.app_name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/error/snoopy_404.svg";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-white/90">
              {postback.app_name}
            </span>
            {postback.app_id ? (
              <span className="text-xs text-gray-500">App ID: {postback.app_id}</span>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      header: "Offer",
      accessor: "offer_name",
      render: (postback: PostbackReview) => (
        <div className="flex min-w-[240px] items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img
              src={postback.offer_image || "/images/error/snoopy_404.svg"}
              alt={postback.offer_name}
              className="h-full w-full object-contain bg-white"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/error/snoopy_404.svg";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="max-w-[280px] whitespace-normal font-semibold text-gray-800 dark:text-white/90">
              {postback.offer_name}
            </span>
            <span className="text-xs text-gray-500">
              Key: {postback.offer_key || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   header: "Status",
    //   accessor: "status",
    //   render: (postback: PostbackReview) => {
    //     const statusClasses =
    //       postback.status === "SUBMITTED"
    //         ? "bg-yellow-100 text-yellow-800"
    //         : "bg-gray-100 text-gray-800";
    //     return (
    //       <span
    //         className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusClasses}`}
    //       >
    //         {postback.status}
    //       </span>
    //     );
    //   },
    // },
    {
      header: "Submitted",
      accessor: "created_on",
      render: (postback: PostbackReview) => (
        <span className="text-gray-700 dark:text-gray-300">
          {formatDate(postback.created_on)}
        </span>
      ),
    },
    {
      header: "Evidence",
      accessor: "evidence_image_url",
      render: (postback: PostbackReview) => {
        if (!postback.evidence_image_url) {
          return <span className="text-xs text-gray-500">No image</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewEvidence(postback)}
              className="h-10 w-10 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              <img
                src={postback.evidence_image_url}
                alt="Evidence"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/images/error/snoopy_404.svg";
                }}
              />
            </button>
            <button
              onClick={() => onViewEvidence(postback)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Zoom
            </button>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id",
      render: (postback: PostbackReview) => {
        if (!canChange) {
          return <span className="text-gray-400 italic">No actions</span>;
        }

        const isLoading = approvingId === postback.id;
        const isDeclining = decliningId === postback.id;
        return (
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecline(postback)}
                disabled={isDeclining || isLoading}
                className="text-sm border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1 rounded disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeclining ? "Declining..." : "Decline"}
              </button>
              <button
                onClick={() => onApprove(postback)}
                disabled={isLoading || isDeclining}
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        );
      },
    },
  ];
