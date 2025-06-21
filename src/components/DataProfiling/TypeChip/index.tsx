import { alpha, Chip } from '@mui/material';

interface TypeChipProps {
  type: string;
  color: string;
  backgroundColor: string;
}
export const TypeChip: React.FC<TypeChipProps> = ({ type, color, backgroundColor }) => {
  return (
    <Chip
      label={type.toLowerCase()}
      size="small"
      sx={{
        padding: '2px 4px',
        fontSize: 'small',
        fontWeight: 500,
        color: color,
        backgroundColor: alpha(backgroundColor, 0.8),
      }}
    />
  );
};
