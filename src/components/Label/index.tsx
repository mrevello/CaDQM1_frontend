import React, { useState } from "react";
import { Typography, Box, IconButton, Menu } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { themePalette } from "../../config/theme.config";

interface LabelProps {
  text: string;
  color?: string;
  fontWeight?: number;
  infoMenuContent?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  text,
  color = themePalette.GRAY,
  fontWeight = 550,
  infoMenuContent,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography fontSize={14} fontWeight={fontWeight} color={color}>
        {text}
      </Typography>
      {infoMenuContent && (
        <>
          <IconButton onClick={handleClick} size="small">
            <InfoOutlineIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Menu
            id="info-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Box p={2}>{infoMenuContent}</Box>
          </Menu>
        </>
      )}
    </Box>
  );
};
