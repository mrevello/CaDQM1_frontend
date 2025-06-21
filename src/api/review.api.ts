import { ReviewData } from "../components/ReviewScreen";
import {
  ContextComponentsType,
  emptyContextComponentsType,
  mapAnalysisToComponents,
} from "../types/contextComponent";
import { Review, ReviewType } from "../types/review";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";
import { API_ENDPOINTS } from "../constants";

const endpoint = API_ENDPOINTS.REVIEWS;

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

export type ReviewFile = {
  id: number;
  filename: string;
  description: string;
  file_type: string;
  mime_type: string;
  base64_content: string;
};

export type AnalysisResponse = {
  data: string[];
};

export type ContextAnalysisResponse = Record<string, string[]>;

export const reviewApi = {
  createReview: async (data: ReviewBody): Promise<Review | undefined> => {
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

  uploadFile: async (
    reviewId: number,
    formData: FormData,
    onProgress?: (progress: number) => void
  ) => {
    try {
      const response = await instance.post(
        `${endpoint}${reviewId}/files/upload-only/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              if (onProgress) {
                onProgress(progress);
              }
            }
          },
        }
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  },

  deleteFile: async (reviewId: number, fileId: string) => {
    try {
      const response = await instance.delete(
        `${endpoint}${reviewId}/files/${fileId}/`
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  },

  getReviewFiles: async function (
    projectId: number,
    type: ReviewType
  ): Promise<ReviewFile[]> {
    try {
      const review = await this.getReview(projectId, type);
      if (!review) {
        return [];
      }

      const response = await instance.get(`${endpoint}${review.id}/files/`);
      return response.data as ReviewFile[];
    } catch (error: any) {
      handleApiError(error);
      return [];
    }
  },

  getAnalysis: async function (
    reviewId: number
  ): Promise<AnalysisResponse | undefined> {
    try {
      const response = await instance.get(
        `${endpoint}${reviewId}/files/analyze`
      );

      return {
        data: response.data,
      };
    } catch (error: any) {
      return { data: [] };
    }
  },

  getContextComponentsAnalysis: async function (
    projectId: number,
    type: ReviewType
  ): Promise<ContextComponentsType> {
    try {
      const review = await this.getReview(projectId, type);
      if (!review) {
        return emptyContextComponentsType;
      }

      const response = await instance.post(
        `${endpoint}${review.id}/context-components/`
      );

      return mapAnalysisToComponents(response.data);
    } catch (error: any) {
      return emptyContextComponentsType;
    }
  },

  rejectSuccestion: async function (
    reviewId: number,
    suggestion: string
  ): Promise<AnalysisResponse | undefined> {
    try {
      const body = { suggestion: suggestion };

      const response = await instance.post(
        `${endpoint}${reviewId}/reject-suggestion/`,
        body
      );

      console.log(response.data);

      return {
        data: response.data,
      };
    } catch (error: any) {
      return { data: [] };
    }
  },
};
