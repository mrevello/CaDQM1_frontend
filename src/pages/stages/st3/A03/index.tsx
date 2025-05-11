import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DQPRoblemsIdentification } from "../../../../components/DQProblemsIdentification";
import { Activity, getActivityTitle } from "../../../../types/activity";

export const A03: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <DQPRoblemsIdentification
      label={t(getActivityTitle(Activity.A08))}
      type="interaction"
      projectId={Number(projectId)}
    />
  );
};
