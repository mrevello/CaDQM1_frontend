import { Review, ReviewType } from "../types/review";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "reviews/";

export type ReviewBody = {
  data: string;
  type: ReviewType;
  created_at?: string;
  project: number;
};

export type ReviewApiResponse = {
  id: number;
  data: string;
  type: ReviewType;
};

export const reviewApi = {
  createReview: async (data: ReviewBody) => {
    try {
      data.created_at =
        data.created_at ?? new Date().toISOString().split("T")[0];
      const response = await instance.post(endpoint, data);

      const reviewData = response.data;
      const review: Review = {
        id: reviewData.id,
        data: reviewData.description,
        type: reviewData.type,
      };
      return review;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  updateReview: async (reviewId: number, data: Partial<ReviewBody>) => {
    try {
      data.created_at =
        data.created_at ?? new Date().toISOString().split("T")[0];
      const response = await instance.put(`${endpoint}${reviewId}/`, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getReview: async function (projectId: number, type: ReviewType) {
    try {
      const response = await instance.get(endpoint);
      const reviewData = response.data.filter(
        (r: any) => r.project === projectId && r.type === type
      )[0];

      if (!reviewData) {
        return null;
      } else {
        const review: ReviewApiResponse = {
          id: reviewData.id,
          data: reviewData.data,
          type: reviewData.type,
        };
        return review;
      }
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
