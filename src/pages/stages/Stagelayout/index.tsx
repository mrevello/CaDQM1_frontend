import React from "react";
import { Box, Container } from "@mui/material";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { ActivityHeader } from "../../../components/ActivityHeader";
import { getStageActivities, Stage } from "../../../types/stage";
import { Activity } from "../../../types/activity";
import { ActivityStepper } from "../../../components/ActivitySepper";

interface StageLayoutProps {
  stage: Stage;
}

export const StageLayout: React.FC<StageLayoutProps> = ({ stage }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const activities = getStageActivities(stage);

  const lastSegment = location.pathname.split("/").pop()?.toLowerCase() || "";
  const selectedActivity: Activity = React.useMemo(() => {
    const found = activities.find((act) => act.toLowerCase() === lastSegment);
    return found ?? activities[0];
  }, [lastSegment, activities]);

  const handleSelectActivity = (next: Activity) => {
    navigate(
      `/projects/${projectId}/${stage.toLowerCase()}/${next.toLowerCase()}`
    );
  };

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <ActivityHeader
        stage={stage}
        selectedActivity={selectedActivity}
        onSelectActivity={handleSelectActivity}
      />

      <Box sx={{ mb: 10, pl: 2, pr: 2 }}>
        <Outlet />
      </Box>

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
