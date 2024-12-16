import React, { useContext, useState } from "react";
import { Notification } from "../components/Notification";
import { AlertColor } from "@mui/material";

type ContextProps = {
    getSuccess: (msg: string) => void
    getError: (msg: string) => void
}

const NotificationContext = React.createContext<ContextProps | null>(null)

export const NotificationProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const [msg, setMsg] = useState("")
    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState<AlertColor>("info")

    const handleClose = () => {
        setOpen(false)
    }

    const getSuccess = (msg: string) => {
        setSeverity("success")
        setOpen(true)
        setMsg(msg)
    }

    const getError = (msg: string) => {
        setSeverity("error")
        setOpen(true)
        setMsg(msg)
    }

    const value = {
        getSuccess,
        getError
    }

    return (
        <NotificationContext.Provider value={value}>
            <Notification handleClose={handleClose} open={open} msg={msg} severity={severity} />
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) throw new Error("There is no context")
    return context
}