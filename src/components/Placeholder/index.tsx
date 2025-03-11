import { Box, Typography, Link } from "@mui/material";

interface PlaceholderProps {
  description: string;
  linkText: string;
  onClick: () => void;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  description,
  linkText,
  onClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      p={2}
      mt={4}
    >
      <Typography variant="subtitle2" color="textSecondary">
        {description}
      </Typography>
      <Link
        variant="subtitle2"
        display="flex"
        alignItems="center"
        onClick={onClick}
        sx={{ cursor: "pointer" }}
      >
        {linkText}
      </Link>
    </Box>
  );
};
