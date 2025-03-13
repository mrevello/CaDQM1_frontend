import React, { useEffect, useState } from "react";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { ContextComponents } from "../ContextComponents";
import { NewContextComponentDialog } from "../NewContextComponentDialog";
import {
  ContextComponentErrorsType,
  ContextComponentsType,
} from "../../types/contextComponent";
import { contextApi } from "../../api/context.api";

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
  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

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
      const { type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }

      const response = await contextApi.createContextComponent(
        type,
        data,
        projectId
      );

      if (response) {
        handleCloseNewContextComponentDialog(); // Close dialog after success
      }
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  useEffect(() => {
    console.log("project id", projectId);
    if (!projectId) return;

    const fetchContextComponents = async () => {
      try {
        const contextFromApi = await contextApi.listContextComponents(
          Number(projectId)
        );
        setContextComponents(contextFromApi);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchContextComponents();
  }, [projectId]);

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
            contextComponents={contextComponents}
          />
        }
        transition={true}
        maxWidth="lg"
        minHeight={500}
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
