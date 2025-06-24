import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Placeholder } from '../Placeholder';
import { Problem } from '../../types/problem';
import { ProblemItem } from '../ProblemItem';

interface ProblemListProps {
  problems: Problem[];
  onDiscardProblem?: (problem: Problem) => void;
  loading?: boolean;
  handleCreateProblem: () => void;
  handleEditProblem: (problem: Problem) => void;
  handleAddSuggestionProblem: (problem: Problem, description: string) => void;
  handleDeleteProblem: (problem: Problem) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onDiscardProblem,
  loading = false,
  handleCreateProblem,
  handleEditProblem,
  handleAddSuggestionProblem,
  handleDeleteProblem,
}) => {
  const { t } = useTranslation();

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
              onDelete={handleDeleteProblem}
              onDiscard={onDiscardProblem}
              onAddSuggestion={handleAddSuggestionProblem}
            />
          ))}
      </Box>
    </>
  );
};
