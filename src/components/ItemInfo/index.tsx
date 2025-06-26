import { Box, Tooltip, Typography } from '@mui/material';

interface ItemInfoProps {
  label: string;
  info: string;
}

export const ItemInfo: React.FC<ItemInfoProps> = ({ label, info }) => {
  return (
    <Box flex={1}>
      <Typography variant="subtitle1" fontWeight="bold" fontSize="12px">
        {label}
      </Typography>
      <Tooltip title={info} placement="bottom-start">
        <Typography variant="body2" fontSize="14px" color="text.secondary">
          {info}
        </Typography>
      </Tooltip>
    </Box>
  );
};
