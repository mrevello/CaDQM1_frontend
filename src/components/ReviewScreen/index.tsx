import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ActivityHandle } from "../../pages/stages/Stagelayout";
import { reviewApi, ReviewBody, ReviewFile } from "../../api/review.api";
import { FileUploadDialog } from "../FileUploadDialog";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UploadedFilesList } from "../UploadedFilesList";
import { FileItem } from "../FileUploader";
import { Review, ReviewType } from "../../types/review";
import { AlertDialog } from "../AlertDialog";

export interface ReviewData {
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

  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<string>();

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

  const handleFileUpload = useCallback(
    async (fileItem: FileItem) => {
      if (!formData.review.id) return;

      try {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === fileItem.id
              ? { ...item, status: "loading", progress: 0 }
              : item
          )
        );

        const form = new FormData();
        form.append("file", fileItem.file);
        if (fileItem.description) {
          form.append("description", fileItem.description);
        }
        if (fileItem.type) {
          form.append("file_type", fileItem.type);
        }

        await reviewApi.uploadFile(formData.review.id, form, (progress) => {
          setFiles((prev) =>
            prev.map((item) =>
              item.id === fileItem.id ? { ...item, progress } : item
            )
          );
        });

        setFiles((prev) =>
          prev.map((item) =>
            item.id === fileItem.id
              ? { ...item, status: "complete", progress: 100 }
              : item
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === fileItem.id
              ? {
                  ...item,
                  status: "error",
                  errorMessage:
                    error instanceof Error ? error.message : "Upload failed",
                  progress: 0,
                }
              : item
          )
        );
      }
    },
    [formData.review.id]
  );

  const handleFileAdded = useCallback(
    (newFile: FileItem) => {
      setFiles((prev) => [...prev, newFile]);
      handleFileUpload(newFile);
    },
    [handleFileUpload]
  );

  const handleDeleteFile = useCallback(async () => {
    try {
      if (formData.review && fileIdToDelete) {
        await reviewApi.deleteFile(formData.review?.id, fileIdToDelete);
        setFiles((prev) => prev.filter((f) => f.id !== fileIdToDelete));
      }
    } catch (error: any) {
      // handleApiError(error);
    }
  }, [formData.review, setFiles]);

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

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      const fetchReview = async () => {
        try {
          setLoading(true);
          let review = await reviewApi.getReview(projectId, type);
          console.log("review", review);

          if (!review) {
            const reviewBody: ReviewBody = {
              data: "",
              type: type,
              project: projectId,
            };
            review = await reviewApi.createReview(reviewBody);
          }
          if (review) {
            setFormData((prev) => ({ ...prev, review: review }));
          }

          const filesResponse = await reviewApi.getReviewFiles(
            Number(projectId),
            type
          );
          const mappedFiles = await Promise.all(
            filesResponse.map(async (file: ReviewFile) => {
              try {
                const byteCharacters = atob(file.base64_content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: file.mime_type });

                return {
                  id: file.id.toString(),
                  file: new File([blob], file.filename, {
                    type: file.mime_type,
                  }),
                  description: file.description || "",
                  status: "complete" as const,
                  type: file.file_type,
                };
              } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
                return {
                  id: file.id.toString(),
                  file: new File([""], file.filename, { type: file.mime_type }),
                  description: file.description || "",
                  status: "error" as const,
                  errorMessage: "Failed to process file",
                };
              }
            })
          );

          console.log(mappedFiles);
          setFiles(mappedFiles);
        } catch (error) {
          console.error("Failed to fetch review:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchReview();
    }
    mountedRef.current = true;
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
            {t("add-file")}
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
                onDelete={(id: string) => {
                  setFileIdToDelete(id);
                  setDeleteFileDialogOpen(true);
                }}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        onFileAdded={handleFileAdded}
      />

      <AlertDialog
        open={deleteFileDialogOpen}
        title="Delete File?"
        description={"Are you sure you want to delete it?"}
        onClose={() => setDeleteFileDialogOpen(false)}
        onConfirm={handleDeleteFile}
      />
    </>
  );
};
