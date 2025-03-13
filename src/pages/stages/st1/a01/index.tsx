import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { FileItem, FileUpload } from "../../../../components/FileUpload";
import { a01Validate } from "../../../../utils/validateForm";
import { ActivityHandle } from "../../Stagelayout";

type A01Type = {
  name: string;
  description: string;
  mainFiles: FileItem[];
  otherFiles?: FileItem[];
};

type A01ErrorsType = {
  name?: string;
  description?: string;
  mainFiles?: string;
};

export const A01: React.FC = () => {
  const { t } = useTranslation();
  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [a01Data, setA01Data] = useState<A01Type>({
    name: "",
    description: "",
    mainFiles: [],
  });
  const [errors, setErrors] = useState<A01ErrorsType>({});

  // Create a ref for the description field
  const descriptionRef = useRef<HTMLInputElement>(null);

  const setMainFiles: React.Dispatch<React.SetStateAction<FileItem[]>> = (
    update
  ) => {
    setA01Data((prev) => ({
      ...prev,
      mainFiles:
        typeof update === "function"
          ? (update as (prevState: FileItem[]) => FileItem[])(prev.mainFiles)
          : update,
    }));
  };

  const setOtherFiles: React.Dispatch<React.SetStateAction<FileItem[]>> = (
    update
  ) => {
    setA01Data((prev) => ({
      ...prev,
      otherFiles:
        typeof update === "function"
          ? (update as (prevState: FileItem[]) => FileItem[])(
              prev.otherFiles || []
            )
          : update,
    }));
  };

  const mainDropzone = useDropzone({
    onDrop: (acceptedFiles) => {
      if (errors.mainFiles) {
        setErrors((prev) => ({ ...prev, mainFiles: undefined }));
      }
      handleDrop(setMainFiles, acceptedFiles);
    },
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

  const validateForm = useCallback(async () => {
    try {
      await a01Validate.validate(a01Data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      console.log("error", err);
      if (err.inner) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [a01Data]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, a01Data, validateForm]);

  return (
    <Box component="form" display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="subtitle2">Dataset Information</Typography>

        <TextField
          label={t("name")}
          variant="outlined"
          value={a01Data.name}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={!!errors.name}
          helperText={errors.name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              descriptionRef.current?.focus();
            }
          }}
        />

        <TextField
          label={t("description")}
          variant="outlined"
          multiline
          maxRows={3}
          value={a01Data.description}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, description: e.target.value }));
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          error={!!errors.description}
          helperText={errors.description}
          // Attach the ref to the description field
          inputRef={descriptionRef}
        />

        <FileUpload
          dropzoneProps={mainDropzone}
          fileItems={a01Data.mainFiles}
          onDelete={handleDeleteFile(setMainFiles)}
          error={errors.mainFiles}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle2">Other Data</Typography>
        <FileUpload
          dropzoneProps={otherDropzone}
          fileItems={a01Data.otherFiles || []}
          onDelete={handleDeleteFile(setOtherFiles)}
        />
      </Box>
    </Box>
  );
};
