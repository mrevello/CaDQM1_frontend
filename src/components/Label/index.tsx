import { Typography } from "@mui/material";

interface LabelProps {
  text: string;
  color?: string;
}

export const Label: React.FC<LabelProps> = ({ text, color }) => {
  return (
    <Typography variant="caption" fontWeight={500} color={color}>
      {text}
    </Typography>
  );
};
