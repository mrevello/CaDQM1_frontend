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
  Slide,
  Breakpoint,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";

export interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  showDividers?: boolean;
  maxWidth?: Breakpoint | false;
  minHeight?: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const GenericDialog: React.FC<GenericDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  content,
  actions,
  showDividers = false,
  maxWidth,
  minHeight,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{ sx: { borderRadius: 1, minHeight: { minHeight } } }}
      maxWidth={maxWidth}
    >
      <DialogTitle sx={{ pb: 2, pt: 2, pl: 3, pr: 3 }}>
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
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
