import React from "react";
import { useTranslation } from "react-i18next";
import { a02Validate } from "../../../../utils/validateForm";
import { Review } from "../../../../components/Review";
import { useParams } from "react-router-dom";

export const A02: React.FC = () => {
  const { t } = useTranslation();

  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Review
      label={t("organization-elements")}
      type="organization_elements"
      validationSchema={a02Validate}
      projectId={Number(projectId)}
    />
  );
};
