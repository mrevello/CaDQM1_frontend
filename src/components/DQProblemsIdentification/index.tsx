import { Add, Sync } from '@mui/icons-material';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewType } from '../../types/review';
import { ReviewComponent } from '../Review';
import { ProblemList } from '../ProblemList';
import { useDQProblems } from '../../hooks/useDQProblems';
import { NewProblemDialog } from '../NewProblemDialog';
import { AlertDialog } from '../AlertDialog';
import { Stage } from '../../types/stage';

export interface DQPRoblemsIdentificationProps {
  label?: string;
  type?: ReviewType;
  projectId: number;
  stage: Stage;
  showReview?: boolean;
}

export const DQPRoblemsIdentification: React.FC<DQPRoblemsIdentificationProps> = ({
  label,
  type,
  projectId,
  stage,
  showReview = true,
}) => {
  const { t } = useTranslation();

  const {
    problems,
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
    handleAddSuggestionProblem,
    handleDeleteProblem,
    deleteDialogOpen,
    problemToDelete,
    confirmDeleteProblem,
    cancelDeleteProblem,
  } = useDQProblems({ projectId, type, stage });

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

            <Box display="flex" flexDirection="row" gap={2}>
              <Button startIcon={<Add />} onClick={handleCreateProblem} sx={{ p: 0 }}>
                {t('new')}
              </Button>

              {type && (
                <Tooltip title={t('suggest-problems-with-ai')}>
                  <Button startIcon={<Sync />} onClick={handleLoadAnalysis} sx={{ p: 0 }}>
                    {t('suggest-with-ai')}
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box pt={1}>
            <ProblemList
              problems={problems}
              onDiscardProblem={handleDiscardProblem}
              loading={loading}
              handleCreateProblem={handleCreateProblem}
              handleEditProblem={handleEditProblem}
              handleAddSuggestionProblem={handleAddSuggestionProblem}
              handleDeleteProblem={handleDeleteProblem}
            />
          </Box>
        </Box>
      </Box>

      <NewProblemDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
        problem={selectedEditProblem}
      />

      <AlertDialog
        open={deleteDialogOpen}
        title={t('delete-title')}
        description={problemToDelete ? problemToDelete.description : ''}
        onClose={cancelDeleteProblem}
        onConfirm={confirmDeleteProblem}
      />
    </>
  );
};
