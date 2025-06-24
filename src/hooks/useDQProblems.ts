import { useState, useCallback } from 'react';
import { problemsApi } from '../api/problem.api';
import { Problem, ProblemErrorsType } from '../types/problem';
import { ReviewType } from '../types/review';
import { reviewApi } from '../api/review.api';
import { ProblemValidate } from '../utils/validateForm';
import * as yup from 'yup';
import { Stage } from '../types/stage';

interface UseDQProblemsProps {
  projectId: number;
  type?: ReviewType;
  stage?: Stage;
}

export const useDQProblems = ({ projectId, type, stage }: UseDQProblemsProps) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState<boolean>(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});
  const [selectedEditProblem, setSelectedEditProblem] = useState<Problem | null>(null);
  const [reviewId, setReviewId] = useState<number>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);

  const fetchProblems = useCallback(async () => {
    try {
      setLoadingProblems(true);
      const problemsFromApi = await problemsApi.listProblems(projectId);
      setProblems(problemsFromApi ?? []);
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoadingProblems(false);
    }
  }, [projectId]);

  const fetchReview = useCallback(async () => {
    if (!type) return;

    try {
      const review = await reviewApi.getReview(projectId, type);
      setReviewId(review?.id);
    } catch (err) {
      console.error('Error fetching review:', err);
    }
  }, [projectId, type]);

  const fetchAnalysis = useCallback(async () => {
    if (!reviewId) return;

    try {
      setLoadingAnalysis(true);
      const response = await reviewApi.getAnalysis(reviewId);
      if (response) {
        const suggestedProblems: Problem[] = response.data.map(suggestion => ({
          id: Date.now() + Math.random(),
          description: suggestion,
          date: new Date(),
          isSuggestion: true,
        }));
        setProblems(prev => [...prev, ...suggestedProblems]);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  }, [reviewId]);

  const createProblem = useCallback(
    async (description: string, projectId: number, stage?: Stage) => {
      try {
        setLoadingProblems(true);
        const createdProblem = await problemsApi.createProblem(description, projectId, stage);
        if (createdProblem) {
          setProblems(prev => [...prev, createdProblem]);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error creating problem:', error);
        return false;
      } finally {
        setLoadingProblems(false);
      }
    },
    [projectId]
  );

  const updateProblem = useCallback(
    async (id: number, description: string, projectId: number) => {
      try {
        setLoadingProblems(true);

        const updatedProblem = await problemsApi.updateProblem(id, description, projectId);
        if (updatedProblem) {
          setProblems(prev => {
            return prev.map(problem =>
              problem.id === id ? { ...problem, ...updatedProblem } : problem
            );
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating problem:', error);
        return false;
      } finally {
        setLoadingProblems(false);
      }
    },
    [projectId]
  );

  const deleteProblem = useCallback(async (id: number) => {
    try {
      setLoadingProblems(true);
      const response = await problemsApi.deleteProblem(id);
      if (response?.success) {
        setProblems(prev => prev.filter(problem => problem.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting problem:', error);
      return false;
    } finally {
      setLoadingProblems(false);
    }
  }, []);

  const handleCreateProblem = useCallback(() => {
    setProblemErrors({});
    setSelectedEditProblem(null);
    setNewProblemDialogOpen(true);
  }, []);

  const handleEditProblem = useCallback((problem: Problem) => {
    setSelectedEditProblem(problem);
    setNewProblemDialogOpen(true);
  }, []);

  const handleCloseNewProblemDialog = useCallback(() => {
    setProblemErrors({});
    setSelectedEditProblem(null);
    setNewProblemDialogOpen(false);
  }, []);

  const handleNewProblemSubmit = useCallback(
    async (formData: Record<string, any>) => {
      try {
        await ProblemValidate.validate(formData, { abortEarly: false });
        setProblemErrors({});

        const { description } = formData;

        let success;
        if (selectedEditProblem) {
          success = await updateProblem(selectedEditProblem.id, description, projectId);
        } else {
          success = await createProblem(description, projectId, stage);
        }

        if (success) {
          handleCloseNewProblemDialog();
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errors: ProblemErrorsType = {};
          error.inner.forEach(validationError => {
            errors.description = validationError.message;
          });
          setProblemErrors(errors);
        } else {
          console.error('Error submitting problem:', error);
          handleCloseNewProblemDialog();
        }
      }
    },
    [createProblem, updateProblem, selectedEditProblem, projectId, handleCloseNewProblemDialog]
  );

  const handleDiscardProblem = useCallback(
    async (problem: Problem) => {
      if (!reviewId) {
        console.error('Error: No review ID available');
        return;
      }

      try {
        await reviewApi.rejectSuccestion(reviewId, problem.description);
        setProblems(prev => prev.filter(p => p !== problem));
      } catch (error) {
        console.error('Error discarding problem:', error);
      }
    },
    [reviewId]
  );

  const handleAddSuggestionProblem = useCallback(
    async (problem: Problem, description: string) => {
      try {
        const createdProblem = await problemsApi.createProblem(description, projectId, stage);

        if (createdProblem) {
          setProblems(prevProblems => prevProblems.filter(p => p.id !== problem.id));
          setProblems(prevProblems => [...prevProblems, createdProblem]);
        }
      } catch (error) {
        console.error('Error adding problem:', error);
      }
    },
    [projectId]
  );

  const handleDeleteProblem = useCallback((problem: Problem) => {
    setProblemToDelete(problem);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteProblem = useCallback(() => {
    if (problemToDelete) {
      deleteProblem(problemToDelete.id);
      setDeleteDialogOpen(false);
      setProblemToDelete(null);
    }
  }, [problemToDelete, deleteProblem]);

  const cancelDeleteProblem = useCallback(() => {
    setDeleteDialogOpen(false);
    setProblemToDelete(null);
  }, []);

  return {
    problems,
    loading: loadingProblems || loadingAnalysis,
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
  };
};
