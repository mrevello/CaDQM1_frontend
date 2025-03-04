import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { GenericDialog } from "../Dialog";

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
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  title: string;
  dialogContentText?: string;
  textFieldConfigs: TextFieldConfig[];
  confirmText?: string;
  cancelText?: string;
  onFieldChange?: (name: string, value: any) => void;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  dialogContentText,
  textFieldConfigs,
  confirmText = "Save",
  cancelText = "Cancel",
  onFieldChange,
}) => {
  const initialFormData = textFieldConfigs.reduce(
    (acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    },
    {} as Record<string, any>
  );

  const [formData, setFormData] =
    useState<Record<string, any>>(initialFormData);

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {textFieldConfigs.map((field) =>
        field.type === "select" ? (
          <FormControl fullWidth key={field.id}>
            {/* <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {field.labelText}
            </Typography> */}
            <Select
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              fullWidth
              sx={{fontSize:"1rem"}}
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
            {/* <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {field.labelText}
            </Typography> */}
            <TextField
              fullWidth
              {...field}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </Box>
        )
      )}
    </Box>
  );

  const dialogActions = (
    <>
      <Button variant="outlined" onClick={onClose}>
        {cancelText}
      </Button>
      <Button type="submit" autoFocus variant="contained">
        {confirmText}
      </Button>
    </>
  );

  return (
    <form onSubmit={handleSubmit}>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={title}
        subtitle={dialogContentText}
        content={dialogContent}
        actions={dialogActions}
        showDividers={true}
      />
    </form>
  );
};
