import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const RightSide = styled(Grid)({
  display: "flex",
  alignItems: "center",
});

export const NavBar: React.FC = () => {
  const { t } = useTranslation();

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

          <RightSide>
            <LanguageSwitcher />
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
            </Menu>
          </RightSide>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
