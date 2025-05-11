import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Stage } from "../../../../types/stage";
import { ContextReview } from "../../../../components/ContextReview";
import { Activity, getActivityTitle } from "../../../../types/activity";

export const A07: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <ContextReview
      label={t(getActivityTitle(Activity.A08))}
      type="interaction"
      projectId={Number(projectId)}
      stage={Stage.ST3}
    />
  );
};
