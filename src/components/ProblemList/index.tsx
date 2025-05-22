import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
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

interface ProblemListProps {
  projectId: number;
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  projectId,
  problems,
  setProblems,
}) => {
  const { t } = useTranslation(["common", "problem"]);
  const { getError } = useNotification();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedEditProblem, setSelectedEditProblem] =
    useState<Problem | null>(null);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);

  const handleCreateProblem = () => {
    setSelectedEditProblem(null);
    setDialogOpen(true);
  };

  const handleEditProblem = (problem: Problem) => {
    setSelectedEditProblem(problem);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProblemErrors({});
    setDialogOpen(false);
    setSelectedEditProblem(null);
  };

  const handleDialogSubmit = async (formData: Record<string, any>) => {
    try {
      await ProblemValidate.validate(formData, { abortEarly: false });
      setProblemErrors({});

      if (selectedEditProblem) {
        const updatedData: Partial<ProblemBody> = {
          description: formData.description,
        };
        const updatedProblem = await problemsApi.updateProblem(
          selectedEditProblem.id,
          updatedData,
          projectId
        );
        if (updatedProblem) {
          setProblems((prev) =>
            prev.map((problem) =>
              problem.id === selectedEditProblem.id
                ? { ...problem, ...updatedProblem }
                : problem
            )
          );
        }
      } else {
        const newProblemData: ProblemBody = {
          description: formData.description,
          project_id: Number(projectId),
        };
        const createdProblem = await problemsApi.createProblem(newProblemData);
        if (createdProblem) {
          setProblems((prev) => [...prev, createdProblem]);
        }
      }
      handleCloseDialog();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors: ProblemErrorsType = {};
        error.inner.forEach((validationError) => {
          errors.description = validationError.message;
        });
        setProblemErrors(errors);
      } else {
        getError(String(error));
        handleCloseDialog();
      }
    }
  };

  const createProblem = async (problem: Problem) => {
    try {
      const newProblemData: ProblemBody = {
        description: problem.description,
        project_id: Number(projectId),
      };
      const createdProblem = await problemsApi.createProblem(newProblemData);
      if (createdProblem) {
        setProblems((prev) => [...prev, createdProblem]);
      }
    } catch (error) {
      getError(String(error));
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
      <Box display="flex" flexDirection="column" gap={1.5}>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemItem
              key={problem.id}
              problem={problem}
              onUpdate={() => handleEditProblem(problem)}
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

      <NewProblemDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        errors={problemErrors}
        problem={selectedEditProblem}
      />

      <AlertDialog
        open={deleteDialogOpen}
        title={t("problem:delete-problem-alert-title")}
        description={problemToDelete ? problemToDelete.description : ""}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
