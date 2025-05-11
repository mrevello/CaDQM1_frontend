import { useState } from "react";
import {
  IconButton,
  useTheme,
  Card,
  Tooltip,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Problem } from "../../types/problem";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import {
  StyledCardContent,
  WhiteCard,
} from "../../StyledComponents/StyledComponents";
import { EditDeleteMenu } from "../EditDeleteMenu";

interface ProblemItemProps {
  problem: Problem;
  onUpdate: (problem: Problem) => void;
  onDelete: (problem: Problem) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  onUpdate,
  onDelete,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${theme.palette.info.main}`,
      }}
    >
      <StyledCardContent>
        <Tooltip title={problem.description} placement="bottom-start">
          <Typography
            variant="body2"
            fontSize="14px"
            // fontWeight="bold"
            flex={1}
          >
            {problem.description}
          </Typography>
        </Tooltip>

        <>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>

          <EditDeleteMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onEditClicked={() => {
              onUpdate(problem);
              handleMenuClose();
            }}
            onDeleteClicked={() => {
              onDelete(problem);
              handleMenuClose();
            }}
          />
        </>
      </StyledCardContent>
    </Card>
  );
};
