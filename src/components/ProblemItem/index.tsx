import { useState } from "react";
import { IconButton, useTheme, Card } from "@mui/material";
import { Problem } from "../../types/problem";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { StyledCardContent } from "../../StyledComponents/StyledComponents";
import { ItemInfo } from "../ItemInfo";
import { EditDeleteMenu } from "../EditDeleteMenu";

interface ProblemItemProps {
  problem: Problem;
  onUpdate: (itemId: number) => void;
  onDelete: (itemId: number) => void;
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
        background: "transparent",
        borderLeft: `4px solid ${theme.palette.info.main}`,
      }}
    >
      <StyledCardContent>
        <ItemInfo label={problem.name} info={problem.description} />

        <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>

        <EditDeleteMenu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          onEditClicked={() => {
            onUpdate(problem.id);
            handleMenuClose();
          }}
          onDeleteClicked={() => {
            onDelete(problem.id);
            handleMenuClose();
          }}
        />
      </StyledCardContent>
    </Card>
  );
};
