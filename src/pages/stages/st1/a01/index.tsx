import React, { useState, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FileItem, FileUpload } from "../../../../components/FileUpload";

export const A01: React.FC = () => {
  const { t } = useTranslation();

  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [mainFiles, setMainFiles] = useState<FileItem[]>([]);
  const [otherFiles, setOtherFiles] = useState<FileItem[]>([]);

  const mainDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(setMainFiles, acceptedFiles),
    noClick: true,
    multiple: true,
  });

  const otherDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(setOtherFiles, acceptedFiles),
    noClick: true,
    multiple: true,
  });

  const handleDrop = (
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
    acceptedFiles: File[]
  ) => {
    const newItems: FileItem[] = acceptedFiles.map((file) => ({
      id: file.name + "_" + Date.now(),
      file,
      status: "loading",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    newItems.forEach((file) => simulateUpload(file, setFiles));
  };

  const simulateUpload = (
    item: FileItem,
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  ) => {
    const timer = setInterval(() => {
      setFiles((prevItems) =>
        prevItems.map((curr) => {
          if (curr.id === item.id) {
            const newProgress = (curr.progress ?? 0) + 20;
            if (newProgress >= 100) {
              clearInterval(timer);
              return { ...curr, status: "complete", progress: 100 };
            }
            return { ...curr, progress: newProgress };
          }
          return curr;
        })
      );
    }, 5000);
  };

  const handleDeleteFile =
    (setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>) =>
    (id: string) => {
      setFiles((prev) => prev.filter((item) => item.id !== id));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dataset Name:", datasetName);
    console.log("Description:", description);
    console.log("Main Files:", mainFiles);
    console.log("Other Files:", otherFiles);
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2">Dataset Information</Typography>

        <TextField
          label={t("name")}
          variant="outlined"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
        />
        <TextField
          label={t("description")}
          variant="outlined"
          multiline
          maxRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <FileUpload
          dropzoneProps={mainDropzone}
          fileItems={mainFiles}
          onDelete={handleDeleteFile(setMainFiles)}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2">Other Data</Typography>

        <FileUpload
          dropzoneProps={otherDropzone}
          fileItems={otherFiles}
          onDelete={handleDeleteFile(setOtherFiles)}
        />
      </Box>
    </Box>
  );
};
