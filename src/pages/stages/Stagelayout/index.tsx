import React, { useRef, useState } from "react";
import { Box, Container, SpeedDial, SpeedDialAction } from "@mui/material";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { ActivityHeader } from "../../../components/ActivityHeader";
import { getStageActivities, Stage } from "../../../types/stage";
import { Activity } from "../../../types/activity";
import { ActivityStepper } from "../../../components/ActivityStepper";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { KeyboardArrowUpOutlined } from "@mui/icons-material";
import { StageDialog } from "../../../components/StagesDialog";
import { ContextDialog } from "../../../components/ContextDialog";
import { ProblemsDialog } from "../../../components/ProblemsDialog";

export interface ActivityHandle {
  validateForm: () => Promise<boolean>;
}

export const StageLayout: React.FC = () => {
  const { projectId, stage: stageParam } = useParams<{
    projectId: string;
    stage: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();
  const activityRef = useRef<ActivityHandle>(null);

  const stageFromPath = location.pathname.split("/")[3].toUpperCase() as Stage;

  const [stage, setStage] = useState<Stage>(stageFromPath);
  const [nextAvailableStages, setNextAvailableStages] = useState<Stage[]>([]);
  const activities = React.useMemo(() => getStageActivities(stage), [stage]);

  const lastSegment = location.pathname.split("/").pop()?.toLowerCase() || "";
  const selectedActivity: Activity = React.useMemo(() => {
    const found = activities.find((act) => act.toLowerCase() === lastSegment);
    return found ?? activities[0];
  }, [lastSegment, activities]);

  const [stagesDialogOpen, setStagesDialogOpen] = useState(false);
  const [contextDialogOpen, setContextDialogOpen] = useState(false);
  const [problemsDialogOpen, setProblemsDialogOpen] = useState(false);

  const continueToStage = (nextStage: Stage) => {
    setStage(nextStage);
    const newActivities = getStageActivities(nextStage);

    if (newActivities.length > 0) {
      navigate(
        `/projects/${projectId}/${nextStage.toLowerCase()}/${newActivities[0].toLowerCase()}`
      );
    } else {
      navigate("/");
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
      navigate(
        `/projects/${projectId}/${stage.toLowerCase()}/${next.toLowerCase()}`
      );
    }
  };

  const handleStageSelect = (stage: Stage) => {
    continueToStage(stage);
    setStagesDialogOpen(false);
  };

  const handleSkip = () => {
    navigate("/");
    setStagesDialogOpen(false);
  };

  const actions = [
    {
      icon: <AddOutlinedIcon />,
      name: "View Context",
      onClick: () => setContextDialogOpen(true),
    },
    {
      icon: <PriorityHighOutlinedIcon />,
      name: "View Problems",
      onClick: () => setProblemsDialogOpen(true),
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
          sx={{ position: "fixed", bottom: 92, right: 24 }}
          icon={<KeyboardArrowUpOutlined />}
        >
          {actions.map((action) => (
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
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            zIndex: 1300,
            boxShadow: "0px -2px 16px #091E420F",
          }}
        >
          <ActivityStepper
            activities={activities}
            selectedActivity={selectedActivity}
            onSelectActivity={handleSelectActivity}
          />
        </Box>
      </Container>

      <StageDialog
        stages={nextAvailableStages}
        title="Choose next stage"
        open={stagesDialogOpen}
        onClose={() => setStagesDialogOpen(false)}
        onStageSelect={handleStageSelect}
        onSkip={handleSkip}
      />

      <ContextDialog
        projectId={Number(projectId)}
        open={contextDialogOpen}
        onClose={() => setContextDialogOpen(false)}
      />

      <ProblemsDialog
        projectId={Number(projectId)}
        open={problemsDialogOpen}
        onClose={() => setProblemsDialogOpen(false)}
      />
    </>
  );
};
