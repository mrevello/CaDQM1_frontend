import { Box, Tooltip, Typography } from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { canContinueToStage, getStageTitle, Stage, stageOrder } from '../../types/stage';
import { getStateColor, State } from '../../types/state';
import { useMemo, useState } from 'react';
import { StageDialog } from '../StagesDialog';
import { Project, ProjectStage } from '../../types/project';
import { StateChip } from '../StateChip';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const computeStages = (stages: ProjectStage[]): ProjectStage[] => {
  const requiredStages = [
    Stage.ST1,
    Stage.ST2,
    Stage.ST3,
    Stage.ST4,
    Stage.ST5,
    Stage.ST6,
  ] as const;
  const mappedStages = [...stages];

  for (const required of requiredStages) {
    if (!mappedStages.some(ms => ms.stage === required)) {
      mappedStages.push({
        id: Math.random(),
        stage: required,
        status: State.TO_DO,
      });
    }
  }

  const orderMap: Record<Stage, number> = stageOrder.reduce(
    (acc: Record<Stage, number>, stage: Stage, idx: number) => {
      acc[stage] = idx;
      return acc;
    },
    {} as Record<Stage, number>
  );

  return mappedStages.sort((a, b) => orderMap[a.stage] - orderMap[b.stage]);
};

type StageTimelineProps = {
  project: Project;
  stageClickable: boolean;
  onProjectStageClick?: (stage: Stage) => void;
};

export const StageTimeline: React.FC<StageTimelineProps> = ({
  project,
  stageClickable = true,
  onProjectStageClick,
}) => {
  const { t } = useTranslation();

  const stages = useMemo<ProjectStage[]>(() => {
    return computeStages(project.stages);
  }, [project.stages]);

  const [stage, setStage] = useState<Stage>();
  const [state, setState] = useState<State>();

  const [stagesDialogOpen, setStagesDialogOpen] = useState(false);

  const handleStageSelect = (stage: Stage) => {
    onProjectStageClick?.(stage);
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
            canContinueToStage={canContinueToStage(projectStage.stage, projectStage.status, stages)}
            isClickable={
              stageClickable && canContinueToStage(projectStage.stage, projectStage.status, stages)
            }
            onClick={(stage: Stage) => {
              if (stageClickable) {
                if (canContinueToStage(stage, projectStage.status, stages)) {
                  setStage(stage);
                  setState(projectStage.status);
                  setStagesDialogOpen(true);
                }
              }
            }}
          />
        ))}
      </Timeline>

      <StageDialog
        project={project}
        stages={stage ? [stage] : []}
        title={
          state === State.DONE
            ? t('reopen-stage')
            : state === State.IN_PROGRESS
              ? t('continue-stage')
              : t('start-stage')
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
  isLast: boolean;
  canContinueToStage: boolean;
  isClickable: boolean;
  onClick: (stage: Stage) => void;
};

const StageTimelineItem: React.FC<StageTimelineItemProps> = ({
  stage,
  state,
  isLast,
  canContinueToStage,
  isClickable,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <TimelineItem
      onClick={() => {
        onClick(stage);
      }}
      sx={
        isClickable
          ? {
              cursor: 'pointer',
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
            {!isClickable && !canContinueToStage && state !== State.DONE && (
              <Tooltip title={t('start-stage-error')}>
                <ReportProblemIcon color="warning" sx={{ fontSize: 18 }} />
              </Tooltip>
            )}
          </Box>
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};
