import React from 'react';
import { GenericDialog } from '../Dialog';
import { useTranslation } from 'react-i18next';
import { ProblemList } from '../ProblemList';
import { useDQProblems } from '../../hooks/useDQProblems';
import { NewProblemDialog } from '../NewProblemDialog';
import { AlertDialog } from '../AlertDialog';
import { Stage } from '../../types/stage';

interface ProblemsDialogProps {
  projectId: number;
  stage: Stage;
  open: boolean;
  onClose: () => void;
}

export const ProblemsDialog: React.FC<ProblemsDialogProps> = ({
  projectId,
  stage,
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const {
    problems,
    handleCreateProblem,
    handleCloseNewProblemDialog,
    handleNewProblemSubmit,
    problemErrors,
    selectedEditProblem,
    newProblemDialogOpen,
    handleEditProblem,
    deleteDialogOpen,
    problemToDelete,
    cancelDeleteProblem,
    confirmDeleteProblem,
    handleDeleteProblem,
    handleAddSuggestionProblem,
  } = useDQProblems({ projectId, stage });

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={t('problems')}
        content={
          <ProblemList
            problems={problems}
            handleCreateProblem={handleCreateProblem}
            handleEditProblem={handleEditProblem}
            handleDeleteProblem={handleDeleteProblem}
            handleAddSuggestionProblem={handleAddSuggestionProblem}
          />
        }
        maxWidth="lg"
        minHeight={500}
      />

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
