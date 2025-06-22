import { Add, Sync } from '@mui/icons-material';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewType } from '../../types/review';
import { ReviewComponent } from '../Review';
import { ProblemList } from '../ProblemList';
import { useDQProblems } from '../../hooks/useDQProblems';

export interface DQPRoblemsIdentificationProps {
  label?: string;
  type?: ReviewType;
  projectId: number;
  showReview?: boolean;
}

export const DQPRoblemsIdentification: React.FC<DQPRoblemsIdentificationProps> = ({
  label,
  type,
  projectId,
  showReview = true,
}) => {
  const { t } = useTranslation();

  const {
    problems,
    setProblems,
    loading,
    fetchProblems,
    fetchReview,
    fetchAnalysis,
    newProblemDialogOpen,
    problemErrors,
    selectedEditProblem,
    handleCreateProblem,
    handleCloseNewProblemDialog,
    handleNewProblemSubmit,
    handleEditProblem,
    handleDiscardProblem,
    deleteProblem,
  } = useDQProblems({ projectId, type });

  useEffect(() => {
    fetchProblems();
    fetchReview();
  }, [projectId, fetchProblems, fetchReview]);

  const handleLoadAnalysis = async () => {
    await fetchAnalysis();
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        {showReview && type && <ReviewComponent label={label} type={type} projectId={projectId} />}
        <Box display="inline-flex" flexDirection="column" flex={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="divider"
            pb={1}
          >
            <Typography variant="subtitle2">{t('problems')}</Typography>

            <Box display="flex" flexDirection="row" gap={1}>
              <Button startIcon={<Add />} onClick={handleCreateProblem} sx={{ p: 0 }}>
                {t('new')}
              </Button>
              {type && (
                <Tooltip title={t('suggest-problems-with-ai')}>
                  <IconButton onClick={handleLoadAnalysis} sx={{ p: 0 }} size="small">
                    <Sync fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box pt={1}>
            <ProblemList
              projectId={Number(projectId)}
              problems={problems}
              setProblems={setProblems}
              onDiscardProblem={handleDiscardProblem}
              loading={loading}
              handleCreateProblem={handleCreateProblem}
              handleEditProblem={handleEditProblem}
              handleCloseNewProblemDialog={handleCloseNewProblemDialog}
              handleNewProblemSubmit={handleNewProblemSubmit}
              newProblemDialogOpen={newProblemDialogOpen}
              problemErrors={problemErrors}
              selectedEditProblem={selectedEditProblem}
              deleteProblem={deleteProblem}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
