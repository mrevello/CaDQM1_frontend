import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ActivityHandle } from "../../pages/stages/Stagelayout";
import { reviewApi } from "../../api/review.api";

export interface ReviewProps {
  label: string;
  type: "interaction" | "organization_elements";
  validationSchema: any;
  projectId: number;
}

export const Review: React.FC<ReviewProps> = ({
  label,
  type,
  validationSchema,
  projectId,
}) => {
  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [formData, setFormData] = useState({ text: "" });
  const [errors, setErrors] = useState<{ text?: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const validateAndSendForm = useCallback(async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      console.log("submitting")
      const reviewBody = {
        data: formData.text,
        type: type,
        project: projectId,
      };
      await reviewApi.createReview(reviewBody);

      return true;
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [formData, validationSchema]);

  useEffect(() => {
    if (activityRef && activityRef.current) {
      activityRef.current.validateForm = validateAndSendForm;
    }
  }, [activityRef, validateAndSendForm]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const review = await reviewApi.getReview(projectId, type);
        if (review) {
          setFormData({ text: review.data });
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [projectId, type]);
  return (
    <Box component="form" display="flex" flexDirection="column" gap={2}>
      <Typography variant="subtitle2">{label}</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TextField
          variant="outlined"
          value={formData.text}
          multiline
          rows={16}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, text: e.target.value }));
            if (errors.text) {
              setErrors((prev) => ({ ...prev, text: undefined }));
            }
          }}
          error={!!errors.text}
          helperText={errors.text}
          sx={{
            "& .MuiInputBase-inputMultiline": {
              resize: "vertical",
            },
          }}
        />
      )}
    </Box>
  );
};
