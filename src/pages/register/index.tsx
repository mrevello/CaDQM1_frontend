import {
  Box,
  Button,
  Container,
  Link,
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
import { StyledGrid, StyledFormPaper, StyledBottomGrid } from "../login";

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

  const handleLoginClicked = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <StyledGrid>
        <StyledFormPaper>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Typography variant="h4">{t("register")}</Typography>
              <TextField
                name="username"
                label={t("username")}
                fullWidth
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
                onChange={onChangeRegisterData}
                value={registerData.password}
                error={!!registerErrors.password}
                helperText={registerErrors.password}
              />
              <TextField
                name="email"
                label={t("email")}
                fullWidth
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
                onChange={onChangeRegisterData}
                value={registerData.description}
                error={!!registerErrors.description}
                helperText={registerErrors.description}
              />
              <Button fullWidth type="submit" variant="contained">
                {t("register")}
              </Button>
            </Grid>
          </Box>
          <StyledBottomGrid container spacing={1}>
            <Typography variant="body1">{t("already-have-account")}</Typography>
            <Link component="button" onClick={handleLoginClicked}>
              {t("login")}
            </Link>
          </StyledBottomGrid>
        </StyledFormPaper>
      </StyledGrid>
    </Container>
  );
};
