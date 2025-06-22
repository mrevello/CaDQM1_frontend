import { useTranslation } from 'react-i18next';
import { Chip, styled } from '@mui/material';
import { getBackgroundColor, getName, getTextColor, State } from '../../types/state';

type StateChipProps = {
  state: State;
  textResource?: string;
};

const CustomChip = styled(Chip)<{ state: State }>(({ state }) => ({
  backgroundColor: getBackgroundColor(state),
  color: getTextColor(state),
  fontWeight: 600,
  textTransform: 'capitalize',
  fontSize: 12,
}));

export const StateChip: React.FC<StateChipProps> = ({ state, textResource = getName(state) }) => {
  const { t } = useTranslation();
  return (
    <CustomChip
      label={t(textResource)}
      state={state}
      clickable={false}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    />
  );
};
