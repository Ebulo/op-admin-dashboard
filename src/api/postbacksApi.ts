import { toast } from "react-hot-toast";
import { config } from "@/config/config";
import { getToken } from "./authApi";
import { PostbackReviewResponse } from "@/types/postback";

type ReviewQueueParams = {
  page?: number;
  limit?: number;
  noPagination?: boolean;
};

const emptyResponse = (): PostbackReviewResponse => ({
  count: 0,
  next: null,
  previous: null,
  results: [],
});

export const getReviewQueue = async (
  params: ReviewQueueParams = {}
): Promise<PostbackReviewResponse> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return emptyResponse();
  }

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.noPagination) searchParams.set("no_pagination", "true");

  try {
    const res = await fetch(
      `${config.apiBaseUrl}/admin/postbacks/review/${searchParams.toString() ? `?${searchParams}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || "Failed to fetch review queue");
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }
    if (Array.isArray(data?.results)) {
      return data as PostbackReviewResponse;
    }
    return emptyResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    toast.error(message, { position: "bottom-right" });
    return emptyResponse();
  }
};

export const approvePostback = async (
  postbackId: number,
  opts: { aiCheck?: boolean } = {}
): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return false;
  }

  const searchParams = new URLSearchParams();
  if (opts.aiCheck) searchParams.set("ai_check", "true");

  try {
    const res = await fetch(
      `${config.apiBaseUrl}/admin/postbacks/review/approve/${searchParams.toString() ? `?${searchParams}` : ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postback_id: postbackId }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || err?.detail || "Failed to approve postback");
    }

    const payload = await res.json().catch(() => ({}));
    const message =
      typeof payload?.message === "string" ? payload.message : "Postback approved";
    toast.success(message, { position: "bottom-right" });
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    toast.error(message, { position: "bottom-right" });
    return false;
  }
};

export const declinePostback = async (
  postbackId: number,
  declineReason?: string
): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return false;
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}/admin/postbacks/review/decline/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postback_id: postbackId,
        ...(declineReason ? { decline_reason: declineReason } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || err?.detail || "Failed to decline postback");
    }

    const payload = await res.json().catch(() => ({}));
    const message =
      typeof payload?.message === "string" ? payload.message : "Postback declined";
    toast.success(message, { position: "bottom-right" });
    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    toast.error(message, { position: "bottom-right" });
    return false;
  }
};
