import React from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Box,
} from "@mui/material";
import { GenericDialog } from "../Dialog";
import { getStageDescription, getStageLabel, getStageTitle, Stage } from "../../types/stage";
import { useTranslation } from "react-i18next";

interface StageDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  dialogContentText?: string;
  onStageSelect: (stage: Stage) => void;
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
  open,
  onClose,
  title,
  dialogContentText,
  onStageSelect,
}) => {
  const stages = [Stage.ST2, Stage.ST3];

  const dialogContent = (
    <Box display="flex" flexDirection="column" gap={2} mt={2} mb={2}>
      {stages.map((stage) => (
        <StageItem key={stage} stage={stage} onSelect={onStageSelect} />
      ))}
    </Box>
  );

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={dialogContentText}
      content={dialogContent}
    />
  );
};
