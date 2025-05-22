import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContextReview } from "../../../../components/ContextReview";
import { Stage } from "../../../../types/stage";

export const A04: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <ContextReview
      label={t("organization-elements")}
      type="organization_elements"
      projectId={Number(projectId)}
      stage={Stage.ST1}
    />
  );
};
