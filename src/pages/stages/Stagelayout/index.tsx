import React, { useState } from "react";
import { Box, Container, SpeedDial, SpeedDialAction } from "@mui/material";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { ActivityHeader } from "../../../components/ActivityHeader";
import { getNextStage, getStageActivities, Stage } from "../../../types/stage";
import { Activity } from "../../../types/activity";
import { ActivityStepper } from "../../../components/ActivitySepper";
import { useHeaderButtons } from "../../../context/headerButtons.context";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { KeyboardArrowUpOutlined } from "@mui/icons-material";

export const StageLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { buttons } = useHeaderButtons();

  const navigate = useNavigate();
  const location = useLocation();

  const [stage, setStage] = useState<Stage>(Stage.ST1);
  const activities = React.useMemo(() => getStageActivities(stage), [stage]);

  const lastSegment = location.pathname.split("/").pop()?.toLowerCase() || "";
  const selectedActivity: Activity = React.useMemo(() => {
    const found = activities.find((act) => act.toLowerCase() === lastSegment);
    return found ?? activities[0];
  }, [lastSegment, activities]);

  const handleSelectActivity = (next: Activity) => {
    // Check if the selected activity exists in the current activities list
    if (!activities.includes(next)) {
      const newStage = getNextStage(stage);
      // Update stage, which automatically updates activities
      setStage(newStage);
      const newActivities = getStageActivities(newStage);
      navigate(
        `/projects/${projectId}/${newStage.toLowerCase()}/${newActivities[0].toLowerCase()}`
      );
    } else {
      navigate(
        `/projects/${projectId}/${stage.toLowerCase()}/${next.toLowerCase()}`
      );
    }
  };

  // Define SpeedDial actions with placeholder click handlers
  const actions = [
    {
      icon: <AddOutlinedIcon />,
      name: "View Context",
      onClick: () => console.log("View Context clicked"),
    },
    {
      icon: <PriorityHighOutlinedIcon />,
      name: "View Problems",
      onClick: () => console.log("View Problems clicked"),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <ActivityHeader
        stage={stage}
        selectedActivity={selectedActivity}
        onSelectActivity={handleSelectActivity}
      >
        {buttons}
      </ActivityHeader>

      <Box sx={{ mb: 10, pl: 8, pr: 8 }}>
        <Outlet />
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
  );
};
