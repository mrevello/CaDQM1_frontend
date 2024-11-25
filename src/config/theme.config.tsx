import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
    children: JSX.Element;
};

enum themePalette {
    BACKGROUND = "#f8f9fa",
    NERO = "#222222",
    FONT = "Open Sans",
    GREY = "#93999e64",
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: "1em",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: "small",
            },
            styleOverrides: {
                root: {
                    borderRadius: "0.5em",
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
