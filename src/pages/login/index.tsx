import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import { useNotification } from "../../context/notification.context";
import { LoginValidate } from "../../utils/validateForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/login.api";
import * as yup from "yup";
import "../../i18n";
import { useTranslation } from "react-i18next";

type LoginType = {
  username: string;
  password: string;
};

type LoginErrorsType = {
  username?: string;
  password?: string;
};

export const StyledGrid = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const StyledFormPaper = styled(Paper)({
  padding: "4rem 3rem",
});

export const StyledBottomGrid = styled(Grid)({
  justifyContent: "center",
  alignItems: "center",
  marginTop: "2rem",
});

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

      await login.login(
        loginData.username,
        loginData.password
      );
      getSuccess(t("login-successful"));
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

  const handleRegisterClicked = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="sm">
      <StyledGrid>
        <StyledFormPaper>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Typography variant="h5">{t("login")}</Typography>
              <TextField
                name="username"
                label={t("username")}
                fullWidth
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
                onChange={onChangeLoginData}
                value={loginData.password}
                error={!!loginErrors.password}
                helperText={loginErrors.password}
              />
              <Button fullWidth type="submit" variant="contained">
                {t("login")}
              </Button>
            </Grid>
          </Box>
          <StyledBottomGrid container spacing={1}>
            <Typography variant="body1">{t("dont-have-account")}</Typography>
            <Link component="button" onClick={handleRegisterClicked}>
              {t("register")}
            </Link>
          </StyledBottomGrid>
        </StyledFormPaper>
      </StyledGrid>
    </Container>
  );
};
