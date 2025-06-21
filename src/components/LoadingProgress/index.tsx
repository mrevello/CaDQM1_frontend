import { Box, CircularProgress } from '@mui/material';

export const LoadingProgress = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
      <CircularProgress />
    </Box>
  );
};
