export interface PostbackReview {
  id: number;
  app_name: string;
  app_id?: number;
  app_image_url?: string | null;
  offer_key: string;
  offer_name: string;
  offer_image?: string | null;
  task_type?: string;
  status: string;
  user_email?: string;
  created_on: string;
  updated_at: string;
  evidence_image_url?: string | null;
}

export interface PostbackReviewResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PostbackReview[];
}
