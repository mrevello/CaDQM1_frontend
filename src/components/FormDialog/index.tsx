import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface TextFieldConfig {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  helperText?: string;
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
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  dialogContentText,
  textFieldConfigs,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description"
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          onSubmit(formJson);
        },
      }}
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {dialogContentText && (
          <DialogContentText id="form-dialog-description">
            {dialogContentText}
          </DialogContentText>
        )}
        {textFieldConfigs.map((field) => (
          <TextField key={field.id} margin="dense" fullWidth {...field} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button type="submit" autoFocus variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
