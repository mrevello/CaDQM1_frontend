import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Activity } from "../../types/activity";
import { useTranslation } from "react-i18next";

interface ActivityStepperProps {
  activities: Activity[];
  selectedActivity: Activity;
  onSelectActivity?: (activity: Activity) => void;
}

export const ActivityStepper: React.FC<ActivityStepperProps> = ({
  activities,
  selectedActivity,
  onSelectActivity,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const activeStep = activities.indexOf(selectedActivity);

  const handleNext = () => {
    if (activeStep < activities.length - 1) {
      onSelectActivity?.(activities[activeStep + 1]);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      onSelectActivity?.(activities[activeStep - 1]);
    }
  };

  return (
    <MobileStepper
      variant="dots"
      steps={activities.length}
      position="static"
      activeStep={activeStep}
      sx={{ width: "100%", flexGrow: 1, pt: 2, pb: 2 }}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === activities.length - 1}
        >
          {t("next")}
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          {t("back")}
        </Button>
      }
    />
  );
};
