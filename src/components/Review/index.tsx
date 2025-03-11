import { Box, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ActivityHandle } from "../../pages/stages/Stagelayout";

export interface ReviewProps {
  label: string;
  validationSchema: any;
}

export const Review: React.FC<ReviewProps> = ({
  label,
  validationSchema,
}) => {
  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [formData, setFormData] = useState({ text: "" });
  const [errors, setErrors] = useState<{ text?: string }>({});

  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [formData, validationSchema]);

  useEffect(() => {
    if (activityRef && activityRef.current) {
      activityRef.current.validateForm = validateForm;
    }
  }, [activityRef, validateForm]);

  return (
    <Box component="form" display="flex" flexDirection="column" gap={2}>
      <Typography variant="subtitle2">{label}</Typography>
      <TextField
        variant="outlined"
        value={formData.text}
        multiline
        rows={16}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, text: e.target.value }));
          if (errors.text) {
            setErrors((prev) => ({ ...prev, text: undefined }));
          }
        }}
        error={!!errors.text}
        helperText={errors.text}
        sx={{
          "& .MuiInputBase-inputMultiline": {
            resize: "vertical",
          },
        }}
      />
    </Box>
  );
};
