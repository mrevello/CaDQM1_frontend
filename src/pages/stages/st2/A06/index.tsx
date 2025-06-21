import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../../context/notification.context';
import { estimationApi } from '../../../../api/estimation.api';

export const A06: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const { projectId } = useParams<{ projectId: string }>();

  const [loadingEstimation, setLoadingEstimation] = useState(false);

  const [estimationId, setEstimationId] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [facts, setFacts] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [manualEstimation, setManualEstimation] = useState('');

  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const fetchEstimation = async () => {
      setLoadingEstimation(true);
      try {
        const estimation = await estimationApi.getEstimation(Number(projectId));

        if (estimation) {
          // setEstimationId(estimation.estimation_id);
          // setWarnings(estimation.estimation.warnings);
          // setFacts(estimation.estimation.facts);
        } else {
          handleRegenerate();
        }
      } catch (err) {
        showError(String(err));
        console.error('Failed to load estimation:', err);
      } finally {
        setLoadingEstimation(false);
      }
    };
    fetchEstimation();
  }, [projectId]);

  const handleRegenerate = async () => {
    if (!prompt.trim()) return;

    setLoadingEstimation(true);
    try {
      const estimation = await estimationApi.regenerateEstimation(Number(projectId), prompt);

      if (estimation) {
        // setEstimationId(estimation.estimation_id);
        // setWarnings(estimation.estimation.warnings);
        // setFacts(estimation.estimation.facts);
        setPrompt('');
      }
    } catch (err) {
      showError(String(err));
      console.error('Failed to regenerate estimation:', err);
    } finally {
      setLoadingEstimation(false);
    }
  };

  const handleDismissWarning = async (warning: string) => {
    if (estimationId) {
      const estimation = await estimationApi.discardEstimation(estimationId, warning, 'warnings');

      console.log('estimation', estimation);

      if (estimation) {
        // setWarnings(estimation.estimation.warnings);
        // setFacts(estimation.estimation.facts);
      }
    }
  };

  const handleDismissFact = async (fact: string) => {
    if (estimationId) {
      const estimation = await estimationApi.discardEstimation(estimationId, fact, 'facts');

      if (estimation) {
        // setWarnings(estimation.estimation.warnings);
        // setFacts(estimation.estimation.facts);
      }
    }
  };

  const handleSaveManualEstimation = async () => {
    if (estimationId) {
      const estimation = await estimationApi.addEstimation(estimationId, manualEstimation);

      if (estimation) {
        // setWarnings(estimation.estimation.warnings);
        // setFacts(estimation.estimation.facts);
        setManualEstimation('');
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {loadingEstimation ? (
        <Box display="flex" width="100%" my={20} justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {warnings.length > 0 && (
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" color="warning.main">
                    Warnings
                  </Typography>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1}>
                  {warnings.map((warning, index) => (
                    <Alert
                      key={`warning-${index}`}
                      severity="warning"
                      onClose={() => handleDismissWarning(warning)}
                    >
                      <Typography variant="body2">{warning}</Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {facts.length > 0 && (
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" color="info.main">
                    Facts
                  </Typography>
                }
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={1}>
                  {facts.map((fact, index) => (
                    <Alert
                      key={`fact-${index}`}
                      severity="info"
                      onClose={() => handleDismissFact(fact)}
                    >
                      <Typography variant="body2">{fact}</Typography>
                    </Alert>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader title="Regenerate Estimation" />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  value={prompt}
                  placeholder={t('prompt-placeholder')}
                  onChange={e => setPrompt(e.target.value)}
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleRegenerate}
                    loading={loadingEstimation}
                  >
                    {loadingEstimation ? 'Regenerating...' : t('regenerate')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
      <Card>
        <CardHeader title="Other Estimation" />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={manualEstimation}
              placeholder="Enter your manual estimation details..."
              onChange={e => setManualEstimation(e.target.value)}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                disabled={!manualEstimation.trim()}
                onClick={() => handleSaveManualEstimation()}
              >
                {t('save')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
