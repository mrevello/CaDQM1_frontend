import React, { useState } from "react";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { ContextComponents } from "../ContextComponentList";
import { ContextComponentsType } from "../../types/contextComponent";

interface ContextComponentDialogProps {
  projectId: number;
  open: boolean;
  onClose: () => void;
}

export const ContextDialog: React.FC<ContextComponentDialogProps> = ({
  projectId,
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={t("context")}
        content={
          <ContextComponents
            projectId={projectId}
            contextComponents={contextComponents}
            setContextComponents={setContextComponents}
          />
        }
        maxWidth="lg"
        minHeight={500}
      />
    </>
  );
};
