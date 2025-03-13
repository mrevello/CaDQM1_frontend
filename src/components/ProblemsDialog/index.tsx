import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { Placeholder } from "../Placeholder";
import { ProblemBody, problemsApi } from "../../api/problem.api";
import { Problem, ProblemErrorsType } from "../../types/problem";
import { ProblemItem } from "../ProblemItem";
import { NewProblemDialog } from "../NewProblemDialog";
import { ProblemValidate } from "../../utils/validateForm";
import { useNotification } from "../../context/notification.context";
import * as yup from "yup";

interface ProblemsDialogProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

export const ProblemsDialog: React.FC<ProblemsDialogProps> = ({
  projectId,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const { getSuccess, getError } = useNotification();

  const [problems, setProblems] = useState<Problem[]>([]);

  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

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
      console.log("project ", projectId);
      console.log("number project ", Number(projectId));

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
      console.log("error", error);

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
  useEffect(() => {
    console.log("project id", projectId);
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

  const dialogContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {problems.length > 0 ? (
        problems.map((problem, index) => (
          <ProblemItem
            key={index}
            problem={problem}
            onUpdate={(problemId) => {}}
            onDelete={(problemId) => {}}
          />
        ))
      ) : (
        <Placeholder
          description={"No problems identified yet."}
          linkText={"Identify problem"}
          onClick={handleCreateProblem}
        />
      )}
    </Box>
  );

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={"Quality problems"}
        content={dialogContent}
        transition={true}
        maxWidth="lg"
        minHeight={500}
      />

      <NewProblemDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
      />
    </>
  );
};
