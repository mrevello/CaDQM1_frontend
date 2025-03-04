import { Box, IconButton, Typography } from "@mui/material";
import { Problem } from "../../types/problem";
import DeleteIcon from "@mui/icons-material/Delete";

interface ProblemItemProps {
  problem: Problem;
  onDelete: (idemId: string) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  onDelete,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2" flex={1}>
          {problem.name}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onDelete(problem.id)}
          sx={{ p: 0 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="body2">{problem.description}</Typography>
    </Box>
  );
};
