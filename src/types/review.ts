import { ReviewApiResponse } from "../api/review.api";

export type Review = {
  id: number;
  data: string;
  type: ReviewType;
};

export type ReviewType = "interaction" | "organization_elements";

export function toReview(response: ReviewApiResponse): Review {
  return {
    ...response,
  };
}
