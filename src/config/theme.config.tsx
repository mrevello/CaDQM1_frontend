import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
  children: JSX.Element;
};

export enum themePalette {
  BACKGROUND = "#f8f9fa",
  BACKGROUND_GRAY = "#091E420F",
  BACKGROUND_INFO = "#e9f2ff",
  BACKGROUND_SUCCESS = "#C6F6D5",
  BACKGROUND_WARNING = "#FEEBC8",
  BACKGROUND_PURPLE = "#E5DEFF",
  BACKGROUND_PRIMARY = "#F7FAFC",
  BACKGROUND_SECONDARY = "#EDF2F7",
  BACKGROUND_ERROR = "#FED7D7",
  ERROR = "#E53E3E",
  GRAY = "#6b7280",
  GRAY_TEXT = "#44546F",
  INFO = "#0055cc",
  SUCCESS = "#216e4e",
  TEXT = "#353036",
  WARNING = "#F59E0B",
  PURPLE = "#9B87F5",
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
          background: themePalette.BACKGROUND,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 22,
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
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontSize: "1rem",
            paddingRight: "8px",
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
            fontSize: 16,
            paddingRight: "8px",
          },
          "& .MuiInputLabel-root": {
            fontSize: 16,
          },
          "& .MuiInputBase-input::placeholder": {
            fontSize: "0.9rem",
            opacity: 0.7,
          },
          "& .MuiSelect-select": {
            fontSize: 16,
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
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          padding: "12px 16px",
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
