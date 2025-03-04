import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";
import React from "react";

type NotificationProps = {
    open: boolean,
    msg: string,
    severity: AlertColor,
    handleClose: () => void
}

export const Notification: React.FC<NotificationProps> = ({ open, msg, severity, handleClose }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={4000}
            open={open}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={severity}>
                <Typography>{msg}</Typography>
            </Alert>
        </Snackbar>
    )
}
