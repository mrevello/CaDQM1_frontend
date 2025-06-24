import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams } from 'react-router-dom';
import { useNotification } from '../../../../context/notification.context';
import { estimationApi } from '../../../../api/estimation.api';
import { Estimation } from '../../../../types/estimation';
import { LoadingProgress } from '../../../../components/LoadingProgress';
import { Sync } from '@mui/icons-material';
import { ActivityHandle } from '../../Stagelayout';

export const A06: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const { projectId } = useParams<{ projectId: string }>();
  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [loading, setLoading] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const [estimation, setEstimation] = useState<Estimation>();

  const [manualEstimation, setManualEstimation] = useState(estimation?.text || '');

  const handleRegenerate = useCallback(async () => {
    setLoadingSuggestion(true);
    try {
      const estimation: Estimation = await estimationApi.regenerateEstimation(Number(projectId));

      if (estimation) {
        setEstimation(estimation);
        setManualEstimation(estimation.text);
      }
    } catch (err) {
      showError(String(err));
      console.error('Failed to regenerate estimation:', err);
    } finally {
      setLoadingSuggestion(false);
    }
  }, [projectId, showError]);

  useEffect(() => {
    const fetchEstimation = async () => {
      setLoading(true);
      try {
        const estimation = await estimationApi.getEstimation(Number(projectId));

        if (estimation) {
          setEstimation(estimation);
          setManualEstimation(estimation.text);
        }
      } catch (err) {
        showError(String(err));
        console.error('Failed to load estimation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEstimation();
  }, [projectId, handleRegenerate, showError]);

  const handleDismissWarning = async (warning: string) => {
    if (estimation) {
      const updatedEstimation = await estimationApi.discardEstimation(
        estimation.id,
        warning,
        'warnings'
      );

      if (updatedEstimation) {
        setEstimation(updatedEstimation);
      }
    }
  };

  const handleDismissFact = async (fact: string) => {
    if (estimation) {
      const updatedEstimation = await estimationApi.discardEstimation(estimation.id, fact, 'facts');

      if (updatedEstimation) {
        setEstimation(updatedEstimation);
      }
    }
  };

  const validateForm = useCallback(async () => {
    try {
      if (estimation) {
        const updatedEstimation = await estimationApi.addEstimation(
          Number(projectId),
          manualEstimation
        );

        if (updatedEstimation) {
          setEstimation(updatedEstimation);
          setManualEstimation('');
        }
        return true;
      }
      showError('No estimation found');
      return false;
    } catch (err) {
      showError(String(err));
      return false;
    }
  }, [showError, manualEstimation, estimation]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, validateForm]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="subtitle2">{t('estimation')}</Typography>
        <Tooltip title={t('suggest-estimation-with-ai')}>
          <Button startIcon={<Sync />} onClick={handleRegenerate} sx={{ p: 0 }}>
            {t('suggest-with-ai')}
          </Button>
        </Tooltip>
      </Box>

      {loading ? (
        <LoadingProgress />
      ) : (
        <TextField
          fullWidth
          multiline
          rows={estimation?.warnings ? 4 : 10}
          variant="outlined"
          value={manualEstimation}
          placeholder="Enter your manual estimation details..."
          onChange={e => setManualEstimation(e.target.value)}
          sx={{
            '& .MuiInputBase-inputMultiline': { resize: 'vertical' },
          }}
        />
      )}

      {loadingSuggestion ? (
        <LoadingProgress />
      ) : (
        <>
          {estimation?.warnings && (
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" color="warning.main">
                    {t('warnings')}
                  </Typography>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1}>
                  {estimation.warnings?.map((warning, index) => (
                    <Alert
                      key={`warning-${index}`}
                      severity="warning"
                      onClose={() => handleDismissWarning(warning)}
                    >
                      <Typography variant="body2" fontSize={14}>
                        {warning}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {estimation?.facts && (
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" color="info.main">
                    {t('information')}
                  </Typography>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1}>
                  {estimation.facts?.map((fact, index) => (
                    <Alert
                      key={`fact-${index}`}
                      severity="info"
                      onClose={() => handleDismissFact(fact)}
                    >
                      <Typography variant="body2" fontSize={14}>
                        {fact}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};
