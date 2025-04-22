import { Box, Tooltip, Typography } from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { useTranslation } from "react-i18next";
import { canContinueToStage, getStageTitle, Stage } from "../../types/stage";
import { getStateColor, State } from "../../types/state";
import { useState } from "react";
import { StageDialog } from "../StagesDialog";
import { ProjectStage } from "../../types/project";
import { StateChip } from "../StateChip";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

type StageTimelineProps = {
  stages: ProjectStage[];
  onProjectStageClick: (stage: Stage) => void;
};

export const StageTimeline: React.FC<StageTimelineProps> = ({
  stages,
  onProjectStageClick,
}) => {
  const { t } = useTranslation("stage");

  const [stage, setStage] = useState<Stage>();
  const [state, setState] = useState<State>();

  const [stagesDialogOpen, setStagesDialogOpen] = useState(false);

  const handleStageSelect = (stage: Stage) => {
    onProjectStageClick(stage);
    setStagesDialogOpen(false);
  };

  return (
    <>
      <Timeline sx={{ p: 0 }}>
        {stages.map((projectStage, index) => (
          <StageTimelineItem
            key={projectStage.stage}
            stage={projectStage.stage}
            state={projectStage.status}
            isLast={index === stages.length - 1}
            isClickable={canContinueToStage(
              projectStage.stage,
              projectStage.status,
              stages
            )}
            onClick={(stage: Stage) => {
              if (canContinueToStage(stage, projectStage.status, stages)) {
                setStage(stage);
                setState(projectStage.status);
                setStagesDialogOpen(true);
              }
            }}
          />
        ))}
      </Timeline>

      <StageDialog
        stages={stage ? [stage] : []}
        title={
          state === State.DONE
            ? t("reopen-stage")
            : state === State.IN_PROGRESS
              ? t("continue-stage")
              : t("start-stage")
        }
        open={stagesDialogOpen}
        onClose={() => setStagesDialogOpen(false)}
        onStageSelect={handleStageSelect}
        onSkip={() => setStagesDialogOpen(false)}
      />
    </>
  );
};

type StageTimelineItemProps = {
  stage: Stage;
  state: State;
  isLast: Boolean;
  isClickable: Boolean;
  onClick: (stage: Stage) => void;
};

const StageTimelineItem: React.FC<StageTimelineItemProps> = ({
  stage,
  state,
  isLast,
  isClickable,
  onClick,
}) => {
  const { t } = useTranslation("state");

  return (
    <TimelineItem
      onClick={() => {
        onClick(stage);
      }}
      sx={
        isClickable
          ? {
              cursor: "pointer",
            }
          : {}
      }
    >
      <TimelineOppositeContent display="none" />

      <TimelineSeparator>
        <TimelineDot color={getStateColor(state)} />
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="textSecondary" fontSize={14}>
            {t(getStageTitle(stage))}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <StateChip state={state} />
            {!isClickable && state !== State.DONE && (
              <Tooltip title={t("stage:start-stage-error")}>
                <ReportProblemIcon color="warning" sx={{ fontSize: 18 }} />
              </Tooltip>
            )}
          </Box>
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};
