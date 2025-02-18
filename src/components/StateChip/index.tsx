import { useTranslation } from "react-i18next";
import { Chip, styled } from "@mui/material";
import {
  getBackgroundColor,
  getName,
  getTextColor,
  State,
} from "../../types/state";

type StateChipProps = {
  state: State;
};

const CustomChip = styled(Chip)<{ state: State }>(({ state }) => ({
  backgroundColor: getBackgroundColor(state),
  color: getTextColor(state),
  fontWeight: 600,
  textTransform: "uppercase",
  fontSize: 14,
}));

export const StateChip: React.FC<StateChipProps> = ({ state }) => {
  const { t } = useTranslation();
  return <CustomChip label={t(getName(state))} state={state} />;
};
