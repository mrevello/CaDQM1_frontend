import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { CheckCircleRounded } from "@mui/icons-material";

export type UploadStatus = "loading" | "complete" | "error";

interface FileUploadItemProps {
  fileName: string;
  fileSize?: string;
  status: UploadStatus;
  errorMessage?: string;
  onDelete?: () => void;
  progress?: number;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  fileName,
  fileSize = "",
  status,
  errorMessage,
  onDelete,
  progress,
}) => {
  return (
    <ListItem
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      <UploadFileOutlinedIcon color="primary" sx={{ ml: 1 }} />

      <Box sx={{ flex: 1 }}>
        <Typography variant="body1">{fileName}</Typography>

        {status === "error" ? (
          <Box sx={{ color: "error.main", mt: 0.5 }}>
            <Typography variant="body2" fontWeight="bold">
              Upload failed.
            </Typography>
            <Typography variant="body2">
              {errorMessage || "Unknown error"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {fileSize && (
              <>
                <Typography variant="body2" color="text.secondary">
                  {fileSize}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
              </>
            )}
            {status === "loading" && (
              <Typography variant="body2" color="text.secondary">
                Loading
              </Typography>
            )}
            {status === "complete" && (
              <Typography variant="body2" color="text.secondary">
                Complete
              </Typography>
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

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {status === "loading" && <CircularProgress size={22} />}
        {status === "complete" && <CheckCircleRounded color="success" />}
        {status === "error" && <ErrorOutlineIcon color="error" />}

        {onDelete && (
          <IconButton edge="end" onClick={onDelete} aria-label="delete">
            <GridDeleteIcon />
          </IconButton>
        )}
      </Box>
    </ListItem>
  );
};
