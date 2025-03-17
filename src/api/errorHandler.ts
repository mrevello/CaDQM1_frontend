// errorHandler.ts
import axios from "axios";

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (!error.response || error.response.status === 404) {
      window.location.href = "/server-error";
    } else {
      throw new Error(
        error.response.data?.error || "An unexpected error occurred."
      );
    }
  } else {
    throw new Error("An unexpected error occurred.");
  }
};
