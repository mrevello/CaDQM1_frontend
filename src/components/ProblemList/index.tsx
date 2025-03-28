import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Placeholder } from "../Placeholder";
import { ProblemBody, problemsApi } from "../../api/problem.api";
import { Problem, ProblemErrorsType } from "../../types/problem";
import { ProblemItem } from "../ProblemItem";
import { ProblemValidate } from "../../utils/validateForm";
import { useNotification } from "../../context/notification.context";
import * as yup from "yup";
import { NewProblemDialog } from "../NewProblemDialog";
import { AlertDialog } from "../AlertDialog";
import { Add } from "@mui/icons-material";

interface ProblemListProps {
  projectId: number;
  showNew?: boolean;
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  projectId,
  showNew = false,
  problems,
  setProblems,
}) => {
  const { t } = useTranslation(["common", "problem"]);
  const { getError } = useNotification();

  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);

  const handleCreateProblem = () => {
    setNewProblemDialogOpen(true);
  };

  const handleCloseNewProblemDialog = () => {
    setProblemErrors({});
    setNewProblemDialogOpen(false);
  };

  const handleNewProblemSubmit = async (formData: Record<string, any>) => {
    try {
      await ProblemValidate.validate(formData, { abortEarly: false });
      setProblemErrors({});

      const newProblemData: ProblemBody = {
        name: formData.name,
        description: formData.description,
        project_id: Number(projectId),
      };

      const createdProblem = await problemsApi.createProblem(newProblemData);
      if (createdProblem) {
        setProblems((prev) => [...prev, createdProblem]);
      }
      handleCloseNewProblemDialog();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: ProblemErrorsType = {};
        error.inner.forEach((validationError) => {
          errors[validationError.path as keyof Problem] =
            validationError.message;
        });
        setProblemErrors(errors);
      } else {
        getError(String(error));
        handleCloseNewProblemDialog();
      }
    }
  };

  const handleUpdateProblem = async (
    id: number,
    updatedData: Partial<ProblemBody>
  ) => {
    try {
      const updatedProblem = await problemsApi.updateProblem(id, updatedData);
      if (updatedProblem) {
        setProblems((prev) =>
          prev.map((problem) =>
            problem.id === id ? { ...problem, ...updatedProblem } : problem
          )
        );
      }
    } catch (error) {
      getError("Failed to update problem.");
    }
  };

  const confirmDeleteProblem = (problem: Problem) => {
    setProblemToDelete(problem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (problemToDelete) {
      try {
        await problemsApi.deleteProblem(problemToDelete.id);
        setProblems((prev) =>
          prev.filter((problem) => problem.id !== problemToDelete.id)
        );
      } catch (error) {
        getError("Failed to delete problem.");
      }
    }
    setDeleteDialogOpen(false);
    setProblemToDelete(null);
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchProblems = async () => {
      try {
        const problemsFromApi = await problemsApi.listProblems(projectId);
        setProblems(problemsFromApi ?? []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [projectId]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {problems.length > 0 && showNew && (
          <Box display="flex" justifyContent="flex-end">
            <Button startIcon={<Add />} onClick={handleCreateProblem}>
              {t("common:new")}
            </Button>
          </Box>
        )}
        <Box display="flex" flexDirection="column" gap={1.5}>
          {problems.length > 0 ? (
            problems.map((problem) => (
              <ProblemItem
                key={problem.id}
                problem={problem}
                // onUpdate={(updatedData) =>
                //   handleUpdateProblem(problem.id, updatedData)
                // }
                onUpdate={() => {}}
                onDelete={() => confirmDeleteProblem(problem)}
              />
            ))
          ) : (
            <Placeholder
              description={t("problem:problems-placeholder")}
              linkText={t("problem:identify-problem")}
              onClick={handleCreateProblem}
            />
          )}
        </Box>
      </Box>
      <NewProblemDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
      />
      <AlertDialog
        open={deleteDialogOpen}
        title={t("problem:delete-problem-alert-title")}
        description={
          problemToDelete
            ? t("problem:delete-problem-alert-description", {
                name: problemToDelete.name,
              })
            : ""
        }
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
