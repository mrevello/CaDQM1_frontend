import React from 'react';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ServerError: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" color="error">
        {t('server-error')}
      </Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        {t('server-error-description')}
      </Typography>
    </Container>
  );
};
