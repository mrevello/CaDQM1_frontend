import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DQPRoblemsIdentification } from "../../../../components/DQProblemsIdentification";

export const A03: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <DQPRoblemsIdentification
      label={t("interaction")}
      type="interaction"
      projectId={Number(projectId)}
      showReview={false}
    />
  );
};
