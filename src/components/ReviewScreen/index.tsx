import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ActivityHandle } from "../../pages/stages/Stagelayout";
import { reviewApi, ReviewBody } from "../../api/review.api";
import { FileUploadDialog } from "../FileUploadDialog";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UploadedFilesList } from "../UploadedFilesList";
import { FileItem } from "../FileUploader";
import { Review, ReviewType } from "../../types/review";

interface ReviewData {
  review: Review;
  files: FileItem[];
}

export interface ReviewProps {
  label: string;
  type: ReviewType;
  projectId: number;
}

export const ReviewScreen: React.FC<ReviewProps> = ({
  label,
  type,
  projectId,
}) => {
  const { t } = useTranslation();

  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [formData, setFormData] = useState<ReviewData>({
    review: {
      id: 0,
      data: "",
      type: type,
    },
    files: [],
  });
  const [errors, setErrors] = useState<{ text?: string }>({});
  const [loading, setLoading] = useState(true);
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);

  const setFiles: React.Dispatch<React.SetStateAction<FileItem[]>> = (
    update
  ) => {
    setFormData((prev) => ({
      ...prev,
      files:
        typeof update === "function"
          ? (update as (prevState: FileItem[]) => FileItem[])(prev.files)
          : update,
    }));
  };

  const validateForm = useCallback(async () => {
    try {
      const reviewBody: ReviewBody = {
        data: formData.review.data,
        type: type,
        project: projectId,
      };

      if (reviewBody.data) {
        if (formData.review.id !== 0) {
          await reviewApi.updateReview(formData.review.id, reviewBody);
        } else {
          await reviewApi.createReview(reviewBody);
        }
      }
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
  }, [formData]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, formData, validateForm]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const review = await reviewApi.getReview(projectId, type);
        if (review) {
          setFormData((prev) => ({ ...prev, review: review }));
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
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>
          <Button
            startIcon={<Add />}
            onClick={() => setFileUploadDialogOpen(true)}
            sx={{ p: 0 }}
          >
            {t("common:add-file")}
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={4}>
            <Grid size={formData.files.length > 0 ? 7 : 12}>
              <TextField
                variant="outlined"
                value={formData.review.data}
                multiline
                fullWidth
                rows={20}
                onChange={(e) => {
                  const newData = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    review: { ...prev.review, data: newData },
                  }));
                  if (errors.text) {
                    setErrors((prev) => ({ ...prev, data: undefined }));
                  }
                }}
                error={!!errors.text}
                helperText={errors.text}
                sx={{
                  "& .MuiInputBase-inputMultiline": { resize: "vertical" },
                }}
              />
            </Grid>

            <Grid size={formData.files.length > 0 ? 5 : 0}>
              <UploadedFilesList
                fileItems={formData.files}
                onDelete={(id) =>
                  setFiles((prev) => prev.filter((item) => item.id !== id))
                }
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        onFileAdded={(newFile) => setFiles((prev) => [...prev, newFile])}
      />
    </>
  );
};
