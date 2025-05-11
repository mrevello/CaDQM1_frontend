import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ContextComponentsType } from "../../../types/contextComponent";
import { Stage } from "../../../types/stage";
import { GenericDialog } from "../../Dialog";
import { ContextComponents } from "../ContextComponents";

interface ContextComponentDialogProps {
  projectId: number;
  version?: string;
  stage: Stage;
  open: boolean;
  onClose: () => void;
}

export const ContextDialog: React.FC<ContextComponentDialogProps> = ({
  projectId,
  version,
  stage,
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

  const handleOpenInNewTab = () => {
    window.open(`/projects/${projectId}/context`, "_blank");
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t("context")}
      subtitle={version && `version ${version}`}
      content={
        <ContextComponents
          projectId={projectId}
          contextComponents={contextComponents}
          setContextComponents={setContextComponents}
          showActions={true}
          stage={stage}
        />
      }
      maxWidth="lg"
      minHeight={500}
      additionalTitleButtons={
        <Tooltip title="Open in a new tab">
          <IconButton onClick={handleOpenInNewTab} sx={{ p: 0, mr: 1 }}>
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
    />
  );
};
