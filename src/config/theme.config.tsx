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
      color: themePalette.TEXT,
    },
    caption: {
      opacity: 0.8,
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
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          border: `0.1px solid ${theme.palette.divider}`,
        }),
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
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontSize: "1rem",
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem",
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "0.9rem",
            opacity: 0.7,
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontSize: 1,
          "& .MuiInputBase-root": {
            fontSize: "1rem",
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "0.9rem",
            opacity: 0.7,
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem",
          },
          "& .MuiSelect-select": {
            fontSize: "1rem",
          },
        },
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
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "32px 24px 40px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "16px 16px 0px 24px",
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 16,
          "&.Mui-disabled": {
            fontSize: 14,
            fontWeight: 500,
          },
          "& .MuiListItemText-root .MuiTypography-root": {
            fontSize: "inherit",
            fontWeight: "inherit",
          },
          "&.Mui-disabled .MuiListItemText-root .MuiTypography-root": {
            fontSize: "inherit",
            fontWeight: "inherit",
          },
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
