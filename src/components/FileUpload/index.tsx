import { useDropzone } from "react-dropzone";
import { FileUploadItem, UploadStatus } from "../FileUploadItem";
import { alpha, Link, List, Paper, Typography } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";

export interface FileItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress?: number;
  errorMessage?: string;
}

export interface FileUploadProps {
  dropzoneProps: ReturnType<typeof useDropzone>;
  fileItems: FileItem[];
  onDelete: (id: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  dropzoneProps,
  fileItems,
  onDelete,
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = dropzoneProps;

  return (
    <>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 1,
          textAlign: "center",
          borderStyle: "dashed",
          backgroundColor: isDragActive
            ? alpha(theme.palette.primary.main, 0.08)
            : "transparent",
          borderColor: isDragActive ? theme.palette.primary.main : "grey.400",
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadFileOutlined color="primary" sx={{ mt: 2, mb: 1 }} />
        <Typography variant="body1">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openFileDialog();
            }}
          >
            Click here
          </Link>{" "}
          to upload your file or drag and drop.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          SVG or xlsx
        </Typography>
      </Paper>

      {fileItems.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Files
          </Typography>
          <List dense sx={{ pt: 0 }}>
            {fileItems.map((item) => (
              <FileUploadItem
                key={item.id}
                fileName={item.file.name}
                fileSize={`${Math.round(item.file.size / 1024)} kb`}
                status={item.status}
                progress={item.progress}
                errorMessage={item.errorMessage}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </List>
        </>
      )}
    </>
  );
};
