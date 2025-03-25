import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TextFieldConfig {
  id: string;
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "date" | "email";
  defaultValue?: string | number;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  title: string;
  dialogContentText?: string;
  textFieldConfigs: TextFieldConfig[];
  confirmTextResource?: string;
  cancelTextResource?: string;
  onFieldChange?: (name: string, value: any) => void;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  dialogContentText,
  textFieldConfigs,
  confirmTextResource = "confirm",
  cancelTextResource = "cancel",
  onFieldChange,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      const initialData = textFieldConfigs.reduce(
        (acc, field) => {
          if (field.defaultValue !== undefined) {
            acc[field.name] = field.defaultValue;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      setFormData(initialData);
    }
  }, [open, textFieldConfigs]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (onFieldChange) {
      onFieldChange(name, value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const dialogContent = (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2.5}
    >
      {textFieldConfigs.map((field) =>
        field.type === "select" ? (
          <FormControl fullWidth key={field.id}>
            <Select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              fullWidth
              sx={{ fontSize: 16 }}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box key={field.id}>
            <TextField
              fullWidth
              {...field}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </Box>
        )
      )}
    </Box>
  );

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={dialogContentText}
      content={dialogContent}
      showDividers={true}
      actions={
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={onClose} sx={{ mr: 1 }}>
            {t(cancelTextResource)}
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={() => onSubmit(formData)}
          >
            {t(confirmTextResource)}
          </Button>
        </Box>
      }
    />
  );
};
