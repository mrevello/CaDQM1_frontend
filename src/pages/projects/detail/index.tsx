import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Project, projectLink, projectStatus } from '../../../types/project';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { LabeledValue } from '../../../components/LabeledValue';
import { Close } from '@mui/icons-material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { StageTimeline } from '../../../components/StagesTimeline';
import { Label } from '../../../components/Label';
import { StateChip } from '../../../components/StateChip';
import { dateFromat1 } from '../../../utils/constants';
import { PDFSelectionDialog } from '../../../components/PDFSelectionDialog';

interface ProjectDetailProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPDFDialog, setShowPDFDialog] = useState(false);

  const handlePDFDialogClose = () => {
    setShowPDFDialog(false);
  };

  const additionalTitleButtons = (
    <Tooltip title={t('generate-project-report')}>
      <IconButton onClick={() => setShowPDFDialog(true)} size="small">
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="h5" component="span">
            {project.name}
          </Typography>
          <Box display="flex" alignItems="center">
            {additionalTitleButtons}
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Box display="flex" flexDirection="row" gap={8}>
          <Box gap={2} display="flex" flexDirection="column" flex={1}>
            <LabeledValue label={`${t('description')}:`} value={project.description} />

            <LabeledValue
              label={`${t('context-version')}:`}
              value={project.context?.version ?? 'v 1.0'}
              onClick={() => window.open(`/projects/${project.id}/context`, '_blank')}
            />

            <LabeledValue label={`${t('dq-model-version')}:`} value={project.dqModel?.version} />

            <LabeledValue label={`${t('data-at-hand')}:`} value={project.dataAtHand?.name} />

            <LabeledValue
              label={`${t('created')}:`}
              value={dayjs(project.createdAt).format(dateFromat1)}
            />

            <LabeledValue
              label={`${t('status')}:`}
              value={<StateChip state={projectStatus(project.stages)} />}
            />
          </Box>

          <Box flex={1}>
            <Label text={`${t('progress')}:`} />

            <StageTimeline
              project={project}
              stageClickable={true}
              onProjectStageClick={stage => navigate(projectLink(project, stage))}
            />
          </Box>
        </Box>
      </DialogContent>

      <PDFSelectionDialog open={showPDFDialog} onClose={handlePDFDialogClose} project={project} />
    </Dialog>
  );
};
