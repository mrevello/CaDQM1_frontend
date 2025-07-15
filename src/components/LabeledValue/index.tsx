import { Link, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Label } from '../Label';

interface LabeledValueProps {
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
}

export const LabeledValue: React.FC<LabeledValueProps> = ({ label, value, onClick }) => {
  return (
    <Grid container spacing={0.5} direction="column">
      <Grid>
        <Label text={label} />
      </Grid>
      <Grid>
        {onClick ? (
          <Link variant="body2" onClick={onClick} component="div">
            {value !== undefined ? value : '-'}
          </Link>
        ) : (
          <Typography variant="body2" component="div">
            {value !== undefined ? value : '-'}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
