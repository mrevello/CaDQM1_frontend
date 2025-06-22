import React from 'react';
import { GenericDialog } from '../Dialog';
import { useTranslation } from 'react-i18next';
import { ProblemList } from '../ProblemList';
import { useDQProblems } from '../../hooks/useDQProblems';

interface ProblemsDialogProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

export const ProblemsDialog: React.FC<ProblemsDialogProps> = ({ projectId, open, onClose }) => {
  const { t } = useTranslation();

  const {
    problems,
    setProblems,
    handleCreateProblem,
    handleCloseNewProblemDialog,
    handleNewProblemSubmit,
    problemErrors,
    selectedEditProblem,
    newProblemDialogOpen,
    handleEditProblem,
    deleteProblem,
  } = useDQProblems({ projectId });

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t('problems')}
      content={
        <ProblemList
          projectId={Number(projectId)}
          problems={problems}
          setProblems={setProblems}
          handleCreateProblem={handleCreateProblem}
          handleEditProblem={handleEditProblem}
          handleCloseNewProblemDialog={handleCloseNewProblemDialog}
          handleNewProblemSubmit={handleNewProblemSubmit}
          newProblemDialogOpen={newProblemDialogOpen}
          problemErrors={problemErrors}
          selectedEditProblem={selectedEditProblem}
          deleteProblem={deleteProblem}
        />
      }
      maxWidth="lg"
      minHeight={500}
    />
  );
};
