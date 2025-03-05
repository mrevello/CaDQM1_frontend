import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Problem } from "../../types/problem";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

interface ProblemItemProps {
  problem: Problem;
  onDelete: (itemId: string) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      display="flex"
      alignItems="center"
      gap={2}
      p={2}
      sx={{
        backgroundColor: isHovered ? "grey.200" : "transparent",
        borderRadius: 1,
        transition: "background-color 0.2s ease-in-out",
        cursor: "pointer",
      }}
    >
      <Box display="flex" flexDirection="column" flex={1}>
        <Typography variant="subtitle2" fontSize="14px">
          {problem.name}
        </Typography>
        <Typography variant="body2">{problem.description}</Typography>
      </Box>
      {isHovered && (
        <IconButton
          size="small"
          onClick={() => onDelete(problem.id)}
          sx={{ p: 0 }}
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
