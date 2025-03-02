import {
  Breadcrumbs,
  Typography,
  Divider,
  Box,
  Link,
  Tooltip,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getStageActivities, getStageTitle, Stage } from "../../types/stage";
import {
  Activity,
  getActivityDescription,
  getActivityName,
  getActivityTitle,
} from "../../types/activity";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  stage: Stage;
  selectedActivity: Activity;
  onSelectActivity?: (activity: Activity) => void;
}

export const ActivityHeader: React.FC<HeaderProps> = ({
  stage,
  selectedActivity,
  onSelectActivity,
}) => {
  const { t } = useTranslation();
  const activities = getStageActivities(stage);

  return (
    <Box sx={{ padding: 2, width: "100%" }}>
      <Box display="flex" alignItems="center">
        <Typography
          variant="body2"
          color="textSecondary"
          component="span"
          fontWeight="bold"
        >
          {t(getStageTitle(stage))}:
        </Typography>

        <Breadcrumbs separator=">" aria-label="breadcrumb" sx={{ ml: 1 }}>
          {activities.map((activity, index) => (
            <Link
              component="button"
              key={activity}
              onClick={() => onSelectActivity?.(activity)}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                fontWeight={activity === selectedActivity ? "bold" : "normal"}
              >
                {t(getActivityName(activity))}
              </Typography>
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mt: 1 }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t(getActivityTitle(selectedActivity))}
        </Typography>
        <Tooltip title={t(getActivityDescription(selectedActivity))}>
          <IconButton size="small">
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};
