import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { Placeholder } from "../Placeholder";
import { problemsApi } from "../../api/problem.api";
import { Problem } from "../../types/problem";
import { ProblemItem } from "../ProblemItem";

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

  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    console.log("project id", projectId)
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
      {/* {problems.length > 0 && (
        <Box display="flex" justifyContent="flex-end">
          <Button startIcon={<Add />} onClick={handleCreateProblem}>
            New
          </Button>
        </Box>
      )} */}

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
          description={t("No problems identified yet.")}
          linkText={t("Identify problem")}
          onClick={() => {}}
          // onClick={handleCreateProblem}
        />
      )}
    </Box>
  );

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={"Quality problems"}
      content={dialogContent}
      transition={true}
      maxWidth="lg"
      minHeight={300}
    />
  );
};
