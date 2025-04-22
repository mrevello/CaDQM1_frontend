import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  Breadcrumbs,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import i18n, { availableLanguages } from "../i18n";
import { getPhaseTitle, Phase, phases } from "../types/phase";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

export const NavBar: React.FC = () => {
  const { t } = useTranslation(["common", "language", "phase"]);
  const { projectId } = useParams<{ projectId: string }>();

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

  const selectedPhase = Phase.P1;
  const showBreadcrumbs = projectId != undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <StyledToolbar>
          <Box display="flex" flexDirection="row" gap={2} alignItems="center">
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

            {showBreadcrumbs && (
              <Breadcrumbs separator=">" aria-label="breadcrumb" sx={{ ml: 1 }}>
                {phases.map((phase, index) => (
                  <Link component="button" key={phase} onClick={() => {}}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      component="span"
                      fontWeight={phase === selectedPhase ? "bold" : "normal"}
                    >
                      {t(getPhaseTitle(phase))}
                    </Typography>
                  </Link>
                ))}
              </Breadcrumbs>
            )}
          </Box>

          <IconButton aria-controls="menu-appbar" onClick={handleMenu}>
            <Avatar />
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
            <MenuItem onClick={handleLogout}>{t("common:logout")}</MenuItem>
          </Menu>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
};
