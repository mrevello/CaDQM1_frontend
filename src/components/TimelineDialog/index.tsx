import React from 'react';
import { GenericDialog } from '../Dialog';
import { useTranslation } from 'react-i18next';
import { StageTimeline } from '../StagesTimeline';
import { Project } from '../../types/project';

interface TimelineDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export const TimelineDialog: React.FC<TimelineDialogProps> = ({ project, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t('project-timeline')}
      subtitle={t('project-timeline-description')}
      content={<StageTimeline project={project} stageClickable={false} />}
    />
  );
};
