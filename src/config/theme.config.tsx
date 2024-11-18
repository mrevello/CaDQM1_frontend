import { createTheme, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import React from "react";

type ThemeProp = {
    children: JSX.Element
};

enum themePalette {
    BACKGROUND = "#f8f9fa",
    BLUE = "#004987",
    FONT = "Open Sans",
    TEXT = "#212529"
};

const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: themePalette.BACKGROUND
        },
        primary: {
            main: themePalette.BLUE
        }
    },
    typography: {
        fontFamily: themePalette.FONT,
        fontSize: 16
    },
    components: {
        MuiButton: {
            defaultProps: {
                style: {
                    textTransform: "none"
                }
            }
        }
    }
});

export const ThemeConfig: React.FC<ThemeProp> = ({ children }) => {
    return <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>;
};