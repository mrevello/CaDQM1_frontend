import React from "react";
import { useTranslation } from "react-i18next";
import { Review } from "../../../../components/Review";
import { a08Validate } from "../../../../utils/validateForm";

export const A08: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Review
      label={"Interaction with data users"}
      validationSchema={a08Validate}
    />
  );
};
