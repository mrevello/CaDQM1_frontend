import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import i18n, { availableLanguages } from "../i18n";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

export const NavBar: React.FC = () => {
  const { t } = useTranslation(["language", "login"]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
    handleClose();
  };

  const userInitial = "U";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <StyledToolbar>
          <Typography
            variant="h6"
            noWrap
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            CaDQM
          </Typography>

          <IconButton
            size="large"
            aria-controls="menu-appbar"
            onClick={handleMenu}
          >
            <Avatar sx={{ fontWeight: 500 }}>{userInitial}</Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                minWidth: "200px",
              },
            }}
          >
            <MenuItem disabled>Language</MenuItem>
            {availableLanguages.map((language) => {
              const isSelected = i18n.language === language.code;
              return (
                <MenuItem
                  key={language.code}
                  onClick={() => {
                    i18n.changeLanguage(language.code);
                    handleClose();
                  }}
                  sx={{
                    ...(isSelected && {
                      color: "primary.main",
                      fontWeight: 700,
                    }),
                  }}
                >
                  {t(`language:${language.labelCode}`)}
                </MenuItem>
              );
            })}
            <Divider />
            <MenuItem onClick={handleLogout}>{t("login:logout")}</MenuItem>
          </Menu>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
