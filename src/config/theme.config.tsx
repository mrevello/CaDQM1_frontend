import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
  children: JSX.Element;
};

export enum themePalette {
  BACKGROUND = "#f8f9fa",
  BACKGROUND_GRAY = "#091E420F",
  BACKGROUND_INFO = "#e9f2ff",
  BACKGROUND_SUCCESS = "#dcfff1",
  ERROR = "#ff0055",
  GRAY = "#44546F",
  INFO = "#0055cc",
  SUCCESS = "#216e4e",
  TEXT = "#353036",
  WARNING = "#ff8a00",
}

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: themePalette.BACKGROUND,
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontSize: 16,
    button: {
      fontWeight: 700,
    },
    allVariants: {
      color: themePalette.TEXT
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
          backgroundColor: "white",
          boxShadow: "none",
          color: themePalette.TEXT,
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
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          padding: "4px 16px",
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
