import React, { useState } from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { GenericDialog } from "../Dialog";
import { getStageDescription, getStageTitle, Stage } from "../../types/stage";
import { useTranslation } from "react-i18next";
import { PDFSelectionDialog } from "../PDFSelectionDialog";
import { Project } from "../../types/project";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface StageDialogProps {
  project: Project;
  stages: Stage[];
  open: boolean;
  onClose: () => void;
  title: string;
  dialogContentText?: string;
  onStageSelect: (stage: Stage) => void;
  onSkip: () => void;
  showExportButton?: boolean;
}

interface StageItemProps {
  stage: Stage;
  onSelect?: (stage: Stage) => void;
}

const StageItem: React.FC<StageItemProps> = ({ stage, onSelect }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (onSelect) {
      onSelect(stage);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        boxShadow: "initial",
        border: 0.1,
        borderColor: "divider",
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" fontSize="14px">
            {t(getStageTitle(stage))}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t(getStageDescription(stage))}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const StageDialog: React.FC<StageDialogProps> = ({
  project,
  stages,
  open,
  onClose,
  title,
  dialogContentText,
  onStageSelect,
  onSkip,
  showExportButton = false,
}) => {
  const { t } = useTranslation();
  const [showPDFDialog, setShowPDFDialog] = useState(false);

  const handlePDFDialogClose = () => {
    setShowPDFDialog(false);
  };

  const dialogContent = (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      {stages.map((stage) => (
        <StageItem key={stage} stage={stage} onSelect={onStageSelect} />
      ))}
    </Box>
  );

  const dialogActions = <Button onClick={onSkip}>{t("skip")}</Button>;

  const additionalTitleButtons = showExportButton ? (
    <Tooltip title={t("generate-stage-report")}>
      <IconButton onClick={() => setShowPDFDialog(true)} size="small">
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  ) : null;

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={title}
        subtitle={dialogContentText}
        content={dialogContent}
        actions={dialogActions}
        additionalTitleButtons={additionalTitleButtons}
      />
      <PDFSelectionDialog
        open={showPDFDialog}
        onClose={handlePDFDialogClose}
        project={project}
      />
    </>
  );
};
