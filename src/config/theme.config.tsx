import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
  children: JSX.Element;
};

export enum themePalette {
  BACKGROUND = "#f8f9fa",
  NERO = "#222222",
  FONT = "Open Sans",
  GRAY = "#908b8b",
  WHITE = "#ffffff",
  SUCCESS = "#00a68a",
  WARNING = "#ff8a00",
  ERROR = "#ff0055",
  INFO = "#0083ff",
}

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: themePalette.BACKGROUND,
    },
    primary: {
      main: themePalette.NERO,
    },
    success: {
      main: themePalette.SUCCESS,
    },
    warning: {
      main: themePalette.WARNING,
    },
    error: {
      main: themePalette.ERROR,
    },
    info: {
      main: themePalette.INFO,
    },
  },
  typography: {
    fontFamily: themePalette.FONT,
    fontSize: 16,
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            fontWeight: 700,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: "0",
          backgroundColor: themePalette.WHITE,
          boxShadow: "none",
          color: themePalette.NERO,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          p: 4,
          backgroundColor: themePalette.GRAY,
          textTransform: "none",
        },
      },
    },
  },
});

export const ThemeConfig: React.FC<ThemeProp> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
