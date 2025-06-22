import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Placeholder } from '../Placeholder';
import { problemsApi } from '../../api/problem.api';
import { Problem } from '../../types/problem';
import { ProblemItem } from '../ProblemItem';
import { AlertDialog } from '../AlertDialog';
import { NewProblemDialog } from '../NewProblemDialog';

interface ProblemListProps {
  projectId: number;
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  onDiscardProblem?: (problem: Problem) => void;
  loading?: boolean;
  handleCreateProblem: () => void;
  handleEditProblem: (problem: Problem) => void;
  handleCloseNewProblemDialog: () => void;
  handleNewProblemSubmit: (formData: Record<string, any>) => Promise<void>;
  newProblemDialogOpen: boolean;
  problemErrors: any;
  selectedEditProblem: Problem | null;
  deleteProblem: (id: number) => Promise<boolean>;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  projectId,
  problems,
  setProblems,
  onDiscardProblem,
  loading = false,
  handleCreateProblem,
  handleEditProblem,
  handleCloseNewProblemDialog,
  handleNewProblemSubmit,
  newProblemDialogOpen,
  problemErrors,
  selectedEditProblem,
  deleteProblem,
}) => {
  const { t } = useTranslation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);

  const handleAddProblem = async (problem: Problem, description: string) => {
    try {
      const createdProblem = await problemsApi.createProblem({
        description,
        project_id: projectId,
      });

      if (createdProblem) {
        setProblems(prevProblems => prevProblems.filter(p => p.id !== problem.id));
        setProblems(prevProblems => [...prevProblems, createdProblem]);
      }
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const confirmDeleteProblem = (problem: Problem) => {
    setProblemToDelete(problem);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (problem: Problem) => {
    try {
      const success = await deleteProblem(problem.id);
      if (success) {
        setProblems(prevProblems => prevProblems.filter(p => p.id !== problem.id));
        setDeleteDialogOpen(false);
        setProblemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const fetchProblems = useCallback(async () => {
    if (!projectId) return;

    try {
      const problemsFromApi = await problemsApi.listProblems(projectId);
      setProblems(problemsFromApi ?? []);
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  }, [projectId, setProblems]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (problems.length === 0) {
    return (
      <Placeholder
        description={t('no-problems-description')}
        linkText={t('add-problem')}
        onClick={handleCreateProblem}
      />
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {problems
          .sort((a, b) => {
            if ((a.isSuggestion ?? false) === (b.isSuggestion ?? false)) {
              return a.id - b.id;
            }
            return (a.isSuggestion ?? false) ? 1 : -1;
          })
          .map(problem => (
            <ProblemItem
              key={problem.id}
              problem={problem}
              onUpdate={handleEditProblem}
              onDelete={() => confirmDeleteProblem(problem)}
              onDiscard={onDiscardProblem}
              onAdd={handleAddProblem}
            />
          ))}
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
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => problemToDelete && handleDelete(problemToDelete)}
      />
    </>
  );
};
