import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export const A05: React.FC = () => {
  const { t } = useTranslation();

  return <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}></Box>;
};
