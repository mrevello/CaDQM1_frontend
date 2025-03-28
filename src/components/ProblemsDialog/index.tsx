import React, { useState } from "react";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { ProblemList } from "../ProblemList";
import { Problem } from "../../types/problem";

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
  const { t } = useTranslation("problem");
  const [problemList, setProblemList] = useState<Problem[]>([]);

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={t("problem:problems")}
        content={
          <ProblemList
            projectId={Number(projectId)}
            problems={problemList}
            setProblems={setProblemList}
          />
        }
        maxWidth="lg"
        minHeight={500}
      />
    </>
  );
};
