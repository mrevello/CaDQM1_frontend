import { useDropzone } from "react-dropzone";
import { alpha, Box, Link, Paper, Typography } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export interface FileItem {
  id: string;
  file: File;
  description?: string;
  status: "loading" | "complete" | "error";
  progress?: number;
  errorMessage?: string;
}

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  error,
}) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onFilesSelected,
    noClick: true,
    multiple: false,
  });

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 1,
          textAlign: "center",
          borderStyle: "dashed",
          backgroundColor: isDragActive
            ? alpha(theme.palette.primary.main, 0.08)
            : "transparent",
          borderColor: isDragActive
            ? theme.palette.primary.main
            : error
              ? theme.palette.error.main
              : "grey.400",
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadFileOutlined color="primary" sx={{ mt: 1.5, mb: 1 }} />
        <Typography variant="body2">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            {t("click-here")}
          </Link>{" "}
          {t("upload-or-drag-and-drop")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("file-type")}
        </Typography>
      </Paper>
      {error && (
        <Typography variant="caption" color="error" ml={1.75}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
