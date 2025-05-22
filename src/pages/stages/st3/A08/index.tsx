import React from "react";
import { useTranslation } from "react-i18next";
import { ReviewScreen } from "../../../../components/ReviewScreen";
import { useParams } from "react-router-dom";
import { Activity, getActivityTitle } from "../../../../types/activity";

export const A08: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <ReviewScreen
      label={t(getActivityTitle(Activity.A08))}
      type="interaction"
      projectId={Number(projectId)}
    />
  );
};
