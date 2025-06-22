import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, SpeedDial, SpeedDialAction } from '@mui/material';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ActivityHeader } from '../../../components/ActivityHeader';
import { getStageActivities, Stage } from '../../../types/stage';
import { Activity } from '../../../types/activity';
import { ActivityStepper } from '../../../components/ActivityStepper';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import { KeyboardArrowUpOutlined } from '@mui/icons-material';
import { StageDialog } from '../../../components/StagesDialog';
import { ContextDialog } from '../../../components/Context/ContextDialog';
import { ProblemsDialog } from '../../../components/ProblemsDialog';
import { link, ProjectStage, Project } from '../../../types/project';
import { projectsApi } from '../../../api/projects.api';
import { State } from '../../../types/state';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants';
import { TimelineDialog } from '../../../components/TimelineDialog';

export interface ActivityHandle {
  validateForm: () => Promise<boolean>;
}

export const StageLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const activityRef = useRef<ActivityHandle>(null);

  const stageFromPath = location.pathname.split('/')[3].toUpperCase() as Stage;

  const [stage, setStage] = useState<Stage>(stageFromPath);
  const [nextAvailableStages, setNextAvailableStages] = useState<Stage[]>([]);
  const activities = React.useMemo(() => getStageActivities(stage), [stage]);

  const lastSegment = location.pathname.split('/').pop()?.toLowerCase() || '';
  const selectedActivity: Activity = React.useMemo(() => {
    const found = activities.find(act => act.toLowerCase() === lastSegment);
    return found ?? activities[0];
  }, [lastSegment, activities]);

  const [stagesDialogOpen, setStagesDialogOpen] = useState(false);
  const [contextDialogOpen, setContextDialogOpen] = useState(false);
  const [problemsDialogOpen, setProblemsDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const project = await projectsApi.getProject(Number(projectId));
        if (!project) {
          console.warn('No project data returned');
          return;
        }
        setProject(project);

        const hasStage =
          project.stages?.some(
            (ps: ProjectStage) => ps.stage === stage && ps.status === State.IN_PROGRESS
          ) ?? false;

        if (projectId && stage && !hasStage) {
          await projectsApi.updateStage(Number(projectId), stage, State.IN_PROGRESS);
        }
      } catch (error) {
        console.error('Error during project fetch or stage update:', error);
      }
    };

    fetchAndUpdate();
  }, [projectId, stage]);

  const continueToStage = (nextStage: Stage) => {
    setStage(nextStage);
    const newActivities = getStageActivities(nextStage);

    if (newActivities.length > 0 && projectId) {
      navigate(link(projectId, nextStage, newActivities[0]));
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleSelectActivity = async (next: Activity) => {
    if (activityRef.current) {
      const isValid = await activityRef.current.validateForm();
      if (!isValid) return;
    }

    if (!activities.includes(next)) {
      // check if the stage is completed for the project
      if (stage === Stage.ST1) {
        setNextAvailableStages([Stage.ST2, Stage.ST3]);
      } else if (stage === Stage.ST2) {
        setNextAvailableStages([Stage.ST3]);
      } else if (stage === Stage.ST3) {
        setNextAvailableStages([Stage.ST2]);
      }
      setStagesDialogOpen(true);
    } else {
      if (projectId) {
        navigate(link(projectId, stage, next));
      }
    }
  };

  const handleStageSelect = async (nextStage: Stage) => {
    try {
      await projectsApi.updateStage(Number(projectId), stage, State.DONE);
      continueToStage(nextStage);
    } catch (error) {
      console.error('Error updating stage:', error);
    }
    setStagesDialogOpen(false);
  };

  const handleSkip = async () => {
    try {
      await projectsApi.updateStage(Number(projectId), stage, State.DONE);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Error updating stage on skip:', error);
    }
    setStagesDialogOpen(false);
  };

  const actions = [
    {
      icon: <AddOutlinedIcon />,
      name: t('view-context'),
      onClick: () => setContextDialogOpen(true),
    },
    {
      icon: <PriorityHighOutlinedIcon />,
      name: t('view-dq-problems'),
      onClick: () => setProblemsDialogOpen(true),
    },
    {
      icon: <TimelineIcon />,
      name: t('view-project-timeline'),
      onClick: () => setTimelineDialogOpen(true),
    },
  ];

  return (
    <>
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <ActivityHeader
          stage={stage}
          selectedActivity={selectedActivity}
          onSelectActivity={handleSelectActivity}
        />

        <Box sx={{ mb: 10, pl: 8, pr: 8 }}>
          <Outlet context={{ activityRef }} />
        </Box>

        <SpeedDial
          direction="up"
          ariaLabel="SpeedDial for extra actions"
          sx={{ position: 'fixed', bottom: 92, right: 24 }}
          icon={<KeyboardArrowUpOutlined />}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            zIndex: 1300,
            boxShadow: '0px -2px 16px #091E420F',
          }}
        >
          <ActivityStepper
            activities={activities}
            selectedActivity={selectedActivity}
            onSelectActivity={handleSelectActivity}
          />
        </Box>
      </Container>

      {project && (
        <StageDialog
          project={project}
          stages={nextAvailableStages}
          title={t('choose-next-stage')}
          open={stagesDialogOpen}
          onClose={() => setStagesDialogOpen(false)}
          onStageSelect={handleStageSelect}
          onSkip={handleSkip}
          showExportButton={true}
        />
      )}

      <ContextDialog
        projectId={Number(projectId)}
        version={project?.context?.version}
        stage={stage}
        open={contextDialogOpen}
        onClose={() => setContextDialogOpen(false)}
      />

      <ProblemsDialog
        projectId={Number(projectId)}
        open={problemsDialogOpen}
        onClose={() => setProblemsDialogOpen(false)}
      />

      {project && (
        <TimelineDialog
          project={project}
          open={timelineDialogOpen}
          onClose={() => setTimelineDialogOpen(false)}
        />
      )}
    </>
  );
};
