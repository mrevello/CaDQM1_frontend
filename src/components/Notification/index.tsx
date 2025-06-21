import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";
import React from "react";

type NotificationProps = {
    open: boolean,
    msg: string,
    severity: AlertColor,
    handleClose: () => void,
    autoHideDuration?: number
}

export const Notification: React.FC<NotificationProps> = ({ open, msg, severity, handleClose, autoHideDuration = 4000 }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={autoHideDuration}
            open={open}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={severity}>
                <Typography>{msg}</Typography>
            </Alert>
        </Snackbar>
    )
}
