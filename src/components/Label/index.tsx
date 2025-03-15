import { Typography } from "@mui/material";

interface LabelProps {
  text: string;
}

export const Label: React.FC<LabelProps> = ({ text }) => {
  return (
    <Typography variant="caption" fontWeight={500}>
      {text}
    </Typography>
  );
};
