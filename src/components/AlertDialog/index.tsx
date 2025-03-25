import React from "react";
import { DialogContentText, Button, Box } from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmTextResource?: string;
  cancelTextResource?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmTextResource = "confirm",
  cancelTextResource = "cancel",
}) => {
  const { t } = useTranslation();

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={title}
      content={
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      }
      actions={
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={onClose} sx={{ mr: 1 }}>
            {t(cancelTextResource)}
          </Button>
          <Button
            type="submit"
            autoFocus
            variant="contained"
            onClick={onConfirm}
          >
            {t(confirmTextResource)}
          </Button>
        </Box>
      }
    />
  );
};
