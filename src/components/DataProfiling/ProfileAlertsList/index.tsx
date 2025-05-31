import React from "react";
import { Alert, AlertTitle, Box, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { themePalette } from "../../../config/theme.config";

interface AlertData {
  column: string;
  value: string;
}

interface ProfileAlertsListProps {
  alerts: string[];
}

export const ProfileAlertsList: React.FC<ProfileAlertsListProps> = ({
  alerts,
}) => {
  const alertList: AlertData[] = alerts.map((alertStr) => {
    const match = alertStr.match(/\[(.*?)\]\s*(.*)/);
    return {
      column: match ? match[1] : "",
      value: match ? match[2] : alertStr,
    };
  });

  return (
    <Box sx={{ maxHeight: 500, overflow: "auto" }}>
      <Stack spacing={1.5}>
        {alertList.map((alert, index) => (
          <Alert
            key={index}
            severity="warning"
            icon={<ErrorOutlineIcon fontSize="small" />}
          >
            <AlertTitle
              fontSize={14}
              color={themePalette.INFO}
              fontWeight={700}
              m={0}
            >
              {alert.column}
            </AlertTitle>
            <Typography variant="caption">{alert.value}</Typography>
          </Alert>
        ))}
      </Stack>
    </Box>
  );
};
