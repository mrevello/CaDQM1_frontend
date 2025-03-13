import React from "react";
import { useTranslation } from "react-i18next";
import { Review } from "../../../../components/Review";
import { a08Validate } from "../../../../utils/validateForm";
import { useParams } from "react-router-dom";

export const A08: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Review
      label={"Interaction with data users"}
      type="interaction"
      validationSchema={a08Validate}
      projectId={Number(projectId)}
    />
  );
};
