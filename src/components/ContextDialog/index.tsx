import React, { useState } from "react";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { ContextComponents } from "../ContextComponents";
import { NewContextComponentDialog } from "../NewContextComponentDialog";
import { ContextComponentErrorsType } from "../../types/contextComponent";

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

  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] =
    useState(false);
  const [contextComponentErrors, setContextComponentErrors] =
    useState<ContextComponentErrorsType>({});

  const handleCreateContextComponent = () => {
    setNewContextComponentDialogOpen(true);
  };

  const handleCloseNewContextComponentDialog = () => {
    setContextComponentErrors({});
    setNewContextComponentDialogOpen(false);
  };

  const handleNewContextComponentSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      // Handle new context component submission here
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={t("context")}
        content={
          <ContextComponents
            projectId={projectId}
            onCreate={handleCreateContextComponent}
          />
        }
        transition={true}
        maxWidth="lg"
        minHeight={300}
      />

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
      />
    </>
  );
};
