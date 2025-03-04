import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  actions: React.ReactNode;
  showDividers: boolean;
}

export const GenericDialog: React.FC<GenericDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  content,
  actions,
  showDividers,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { borderRadius: 1 } }}
    >
      <DialogTitle sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{title}</Typography>

            <IconButton onClick={onClose} sx={{ p: 0 }}>
              <Close />
            </IconButton>
          </Box>
          {subtitle && (
            <Typography variant="caption" display="block">
              {subtitle}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      {showDividers && <Divider />}
      <DialogContent>{content}</DialogContent>
      {showDividers && <Divider />}
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};
