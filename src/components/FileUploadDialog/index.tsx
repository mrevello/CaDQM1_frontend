import { Box, Button, TextField } from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FileItem, FileUploader } from "../FileUploader";
import { UploadedFilesList } from "../UploadedFilesList";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileAdded: (file: FileItem) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFileAdded,
}) => {
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [errors, setErrors] = useState<{
    files?: string;
  }>({});

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setSelectedFile({
        id: `${file.name}_${Date.now()}`,
        file,
        status: "complete",
      });
      setErrors((prev) => ({ ...prev, files: undefined }));
    }
  };

  const resetState = () => {
    setDescription("");
    setSelectedFile(null);
    setErrors({});
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!selectedFile) newErrors.files = t("mandatory-field");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedFile) {
      onFileAdded({ ...selectedFile, description });
      resetState();
      onClose();
    }
  };

  useEffect(() => {
    if (!open) resetState();
  }, [open]);

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t("add-file")}
      content={
        <Box display="flex" flexDirection="column" gap={2}>
          {selectedFile ? (
            <UploadedFilesList
              fileItems={[selectedFile]}
              onDelete={() => setSelectedFile(null)}
            />
          ) : (
            <FileUploader onFilesSelected={handleDrop} error={errors.files} />
          )}
          <TextField
            name="description"
            label={t("description")}
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
      }
      showDividers
      actions={
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t("confirm")}
          </Button>
        </Box>
      }
    />
  );
};
