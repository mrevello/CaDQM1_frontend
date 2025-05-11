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
  additionalTitleButtons?: React.ReactNode;
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
  additionalTitleButtons,
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
      <DialogTitle sx={{ py: 2, px: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{title}</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              {additionalTitleButtons}
              <IconButton onClick={onClose} sx={{ p: 0 }}>
                <Close />
              </IconButton>
            </Box>
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
