import React from "react";
import {
  IconButton,
  Typography,
  LinearProgress,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  UploadFileOutlined,
  ErrorOutline,
  CheckCircleRounded,
  Close,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export type UploadStatus = "loading" | "complete" | "error";

interface FileUploadItemProps {
  fileName: string;
  fileSize?: string;
  description?: string;
  status: UploadStatus;
  errorMessage?: string;
  onDelete?: () => void;
  progress?: number;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  fileName,
  fileSize = "",
  description,
  status,
  errorMessage,
  onDelete,
  progress,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      gap={3}
      border={1}
      borderColor="divider"
      borderRadius={1}
    >
      <UploadFileOutlined color="primary" sx={{ ml: 1 }} />

      <Box flex={1} minWidth={0}>
        <Typography
          variant="body2"
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {fileName}
        </Typography>

        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}

        {status === "error" ? (
          <Box color="error.main" mt={0.5}>
            <Typography variant="body2" fontWeight="bold">
              {t("upload-failed")}
            </Typography>
            <Typography variant="body2">
              {errorMessage || "Unknown error"}
            </Typography>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            {fileSize && (
              <>
                <Typography variant="caption">{fileSize}</Typography>
                <Typography variant="caption">•</Typography>
              </>
            )}
            {status === "loading" && (
              <Typography variant="caption">{t("loading")}</Typography>
            )}
            {status === "complete" && (
              <Typography variant="caption">{t("complete")}</Typography>
            )}
          </Box>
        )}

        {status === "loading" && (
          <LinearProgress
            variant={progress != null ? "determinate" : "indeterminate"}
            value={progress}
            sx={{ mt: 1, mr: 3 }}
          />
        )}
      </Box>

      <Box display="flex" alignItems="center">
        {status === "loading" && <CircularProgress size={20} />}
        {status === "complete" && (
          <CheckCircleRounded fontSize="small" color="success" />
        )}
        {status === "error" && <ErrorOutline fontSize="small" color="error" />}
        {onDelete && (
          <IconButton edge="end" onClick={onDelete} aria-label="delete">
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
