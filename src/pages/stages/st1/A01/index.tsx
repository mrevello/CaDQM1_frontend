import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { a01Validate } from "../../../../utils/validateForm";
import { ActivityHandle } from "../../Stagelayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { dataAtHand, DataAtHandBody } from "../../../../api/dataAtHand.api";

type A01Type = {
  name: string;
  description: string;
  url: string;
  user: string;
  password: string;
};

type A01ErrorsType = {
  name?: string;
  description?: string;
  url?: string;
  user?: string;
  password?: string;
};

export const A01: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [a01Data, setA01Data] = useState<A01Type>({
    name: "",
    description: "",
    url: "",
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState<A01ErrorsType>({});

  const descriptionRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateForm = useCallback(async () => {
    try {
      await a01Validate.validate(a01Data, { abortEarly: false });
      setErrors({});

      const newDataAtHand: DataAtHandBody = {
        name: a01Data.name,
        description: a01Data.description,
        url_db: a01Data.url,
        user_db: a01Data.user,
        pass_db: a01Data.password,
        project: Number(projectId),
      };
      console.log(newDataAtHand);
      await dataAtHand.createDataAtHand(newDataAtHand);

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
  }, [a01Data, projectId]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, a01Data, validateForm]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const renderGridRow = (label: string, input: React.ReactNode) => (
    <Grid container spacing={2}>
      <Grid size={3}>
        <Typography variant="subtitle2">{label}</Typography>
      </Grid>
      <Grid size={9}>{input}</Grid>
    </Grid>
  );

  return (
    <Box component="form" display="flex" flexDirection="column" gap={2}>
      {renderGridRow(
        t("name"),
        <TextField
          fullWidth
          variant="outlined"
          value={a01Data.name}
          placeholder={t("dataset-name")}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={!!errors.name}
          helperText={errors.name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              descriptionRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t("description"),
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={a01Data.description}
          placeholder={t("dataset-description")}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, description: e.target.value }));
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
          error={!!errors.description}
          helperText={errors.description}
          inputRef={descriptionRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              urlRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t("url"),
        <TextField
          fullWidth
          variant="outlined"
          value={a01Data.url}
          placeholder={t("database-url")}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, url: e.target.value }));
            if (errors.url) {
              setErrors((prev) => ({ ...prev, url: undefined }));
            }
          }}
          error={!!errors.url}
          helperText={errors.url}
          inputRef={urlRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              userRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t("user"),
        <TextField
          fullWidth
          variant="outlined"
          value={a01Data.user}
          placeholder={t("database-user")}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, user: e.target.value }));
            if (errors.user) {
              setErrors((prev) => ({ ...prev, user: undefined }));
            }
          }}
          error={!!errors.user}
          helperText={errors.user}
          inputRef={userRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              passwordRef.current?.focus();
            }
          }}
        />
      )}

      {renderGridRow(
        t("password"),
        <TextField
          fullWidth
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          placeholder={t("database-password")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          variant="outlined"
          value={a01Data.password}
          onChange={(e) => {
            setA01Data((prev) => ({ ...prev, password: e.target.value }));
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          error={!!errors.password}
          helperText={errors.password}
          inputRef={passwordRef}
        />
      )}
    </Box>
  );
};
