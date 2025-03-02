import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const A02: React.FC = () => {
  const { t } = useTranslation();

  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      onSubmit={handleSubmit}
    >
      <Typography variant="subtitle2">Organization elements</Typography>
      <TextField
        variant="outlined"
        value={text}
        multiline
        rows={10}
        onChange={(e) => setText(e.target.value)}
      />
    </Box>
  );
};
