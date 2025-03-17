import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  "&:last-child": {
    paddingBottom: 0,
  },
  padding: "16px !important",
}));
