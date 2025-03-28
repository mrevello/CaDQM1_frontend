import { ReviewType } from "../types/review";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "reviews/";

export type ReviewBody = {
  data: string;
  type: "interaction" | "organization_elements";
  created_at?: string;
  project: number;
};

export const reviewApi = {
  createReview: async (data: ReviewBody) => {
    try {
      data.created_at =
        data.created_at ?? new Date().toISOString().split("T")[0];
        console.log(data)
      const response = await instance.post(endpoint, data);

      const reviewData = response.data;
      const review: ReviewType = {
        id: reviewData.id,
        data: reviewData.description,
        type: reviewData.type,
      };
      return review;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getReview: async function (
    projectId: number,
    type: "interaction" | "organization_elements"
  ) {
    try {
      const response = await instance.get(endpoint);
      const reviewData = response.data.filter(
        (p: any) => p.project === projectId
      )[0];

      if (!reviewData) {
        return null;
      } else {
        const review: ReviewType = {
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
