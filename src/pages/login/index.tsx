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
import { LoginValidate } from "../../utils/validateForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/login";
import * as yup from "yup";
import "../../i18n";
import { useTranslation } from "react-i18next";
import { ACCESS_TOKEN } from "../../utils/constants";

type LoginType = {
  username: string;
  password: string;
};

type LoginErrorsType = {
  username?: string;
  password?: string;
};

export const Login: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { getSuccess, getError } = useNotification();

  const [loginData, setLoginData] = useState<LoginType>({
    username: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState<LoginErrorsType>({});

  const onChangeLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginErrors({ ...loginErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await LoginValidate.validate(loginData, { abortEarly: false });

      setLoginErrors({});

      const accessToken = await login.login(
        loginData.username,
        loginData.password
      );
      getSuccess(t("login-successful"));
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      navigate("/");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: LoginErrorsType = {};
        error.inner.forEach((validationError) => {
          errors[validationError.path as keyof LoginType] =
            validationError.message;
        });
        setLoginErrors(errors);
      } else {
        // Server error
        getError(t("login-failed"));
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
                {t("login")}
              </Typography>
              <TextField
                name="username"
                label={t("username")}
                fullWidth
                sx={{ mt: 2, mb: 1.5 }}
                onChange={onChangeLoginData}
                value={loginData.username}
                error={!!loginErrors.username}
                helperText={loginErrors.username}
              />
              <TextField
                name="password"
                label={t("password")}
                type="password"
                fullWidth
                sx={{ mt: 1.5, mb: 1.5 }}
                onChange={onChangeLoginData}
                value={loginData.password}
                error={!!loginErrors.password}
                helperText={loginErrors.password}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 3 }}
              >
                {t("login")}
              </Button>
            </Box>
            <Typography
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              variant="body1"
            >
              {t("dont-have-account")}
              <Link
                component="button"
                sx={{ ml: 1 }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                {t("register")}
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
