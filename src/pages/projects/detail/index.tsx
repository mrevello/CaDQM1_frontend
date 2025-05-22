import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Project,
  projectLink,
  ProjectStage,
  projectStatus,
} from "../../../types/project";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { LabeledValue } from "../../../components/LabeledValue";
import { Close } from "@mui/icons-material";
import { StageTimeline } from "../../../components/StagesTimeline";
import { Label } from "../../../components/Label";
import { StateChip } from "../../../components/StateChip";
import { Stage } from "../../../types/stage";
import { State } from "../../../types/state";
import { dateFromat1 } from "../../../utils/constants";

interface ProjectDetailProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

const computeStages = (projectStages: ProjectStage[]): ProjectStage[] => {
  const addStages: ProjectStage[] = [
    { stage: Stage.ST4, status: State.TO_DO },
    { stage: Stage.ST5, status: State.TO_DO },
    { stage: Stage.ST6, status: State.TO_DO },
  ];

  return [
    ...projectStages,
    ...addStages.filter(
      (s) => !projectStages.some((ps) => ps.stage === s.stage)
    ),
  ];
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  open,
  onClose,
}) => {
  const { t } = useTranslation(["project", "common", "state"]);
  const navigate = useNavigate();

  const stages = useMemo(() => computeStages(project.stages), [project.stages]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{ p: 1.5 }}
    >
      <DialogTitle sx={{ pb: 2, pt: 2, pl: 3, pr: 3 }}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{project.name}</Typography>
            <IconButton onClick={onClose} sx={{ p: 0 }}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Box display="flex" flexDirection="row" gap={8}>
          <Box gap={2} display="flex" flexDirection="column" flex={1}>
            <LabeledValue
              label={`${t("common:description")}:`}
              value={project.description}
            />

            <LabeledValue
              label={`${t("common:context-version")}:`}
              value={project.context?.version ?? "v 1.0"}
              onClick={() =>
                window.open(`/projects/${project.id}/context`, "_blank")
              }
            />

            <LabeledValue
              label={`${t("common:dq-model-version")}:`}
              value={project.dqModel?.version}
            />

            <LabeledValue
              label={`${t("common:data-at-hand")}:`}
              value={project.dataAtHand?.name}
            />

            <LabeledValue
              label={`${t("project:last-update")}:`}
              value={dayjs(project.updatedAt).format(dateFromat1)}
            />

            <LabeledValue
              label={`${t("project:created")}:`}
              value={dayjs(project.createdAt).format(dateFromat1)}
            />

            <LabeledValue
              label={`${t("state:status")}:`}
              value={<StateChip state={projectStatus(stages)} />}
            />
          </Box>

          <Box flex={1}>
            <Label text={`${t("project:progress")}:`} />

            <StageTimeline
              stages={stages}
              onProjectStageClick={(stage) =>
                navigate(projectLink(project, stage))
              }
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
