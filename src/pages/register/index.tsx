import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import { useNotification } from "../../context/notification.context";
import { RegisterValidate } from "../../utils/validateForm";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { register } from "../../api/register";
import "../../i18n";
import { useTranslation } from "react-i18next";

type RegisterType = {
  username: string;
  password: string;
  email?: string;
  description?: string;
};

type RegisterErrorsType = {
  username?: string;
  password?: string;
  email?: string;
  description?: string;
};

export const Register: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { getSuccess, getError } = useNotification();

  const [registerData, setRegisterData] = useState<RegisterType>({
    username: "",
    password: "",
    email: "",
    description: "",
  });

  const [registerErrors, setRegisterErrors] = useState<RegisterErrorsType>({});

  const onChangeRegisterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setRegisterErrors({ ...registerErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await RegisterValidate.validate(registerData, { abortEarly: false });

      setRegisterErrors({});

      await register.register(
        registerData.username,
        registerData.password,
        registerData.email || "",
        registerData.description || ""
      );

      getSuccess(t("registration-successful"));
      navigate("/login");
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const errors: RegisterErrorsType = {};
        error.inner.forEach((validationError) => {
          errors[validationError.path as keyof RegisterType] =
            validationError.message;
        });
        setRegisterErrors(errors);
      } else if (error instanceof Error && error.message) {
        if (error.message.includes("nombre de usuario ya existe")) {
          setRegisterErrors({ username: error.message });
        } else {
          getError(error.message || t("registration-failed"));
        }
      } else {
        getError(t("unexpected-error"));
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid>
          <Paper sx={{ pl: 8, pr: 8, pt: 6, pb: 6 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                {t("register")}
              </Typography>
              <TextField
                name="username"
                label={t("username")}
                fullWidth
                sx={{ mt: 2, mb: 1.5 }}
                onChange={onChangeRegisterData}
                value={registerData.username}
                error={!!registerErrors.username}
                helperText={registerErrors.username}
              />
              <TextField
                name="password"
                label={t("password")}
                type="password"
                fullWidth
                sx={{ mt: 1.5, mb: 1.5 }}
                onChange={onChangeRegisterData}
                value={registerData.password}
                error={!!registerErrors.password}
                helperText={registerErrors.password}
              />
              <TextField
                name="email"
                label={t("email")}
                fullWidth
                sx={{ mt: 1.5, mb: 1.5 }}
                onChange={onChangeRegisterData}
                value={registerData.email}
                error={!!registerErrors.email}
                helperText={registerErrors.email}
              />
              <TextField
                name="description"
                label={t("description")}
                fullWidth
                rows={2}
                multiline
                sx={{ mt: 1.5, mb: 1.5 }}
                onChange={onChangeRegisterData}
                value={registerData.description}
                error={!!registerErrors.description}
                helperText={registerErrors.description}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 3 }}
              >
                {t("register")}
              </Button>
            </Box>
            <Typography
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              variant="body1"
            >
              {t("already-have-account")}
              <Link
                component="button"
                sx={{ ml: 1 }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                {t("login")}
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
