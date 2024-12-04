import { createTheme, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
    children: JSX.Element
};

enum themePalette {
    BACKGROUND = "#f8f9fa",
    NERO = "#222222",
    FONT = "Open Sans",
    GREY = "#93999e64",
    WHITE = "#ffffff",
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
            styleOverrides: {
                root: {
                    borderRadius: "1em",
                },
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
