import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DQPRoblemsIdentification } from '../../../../components/DQProblemsIdentification';
import { Stage } from '../../../../types/stage';

export const A03: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <DQPRoblemsIdentification
      label={t('organization-elements')}
      type="organization_elements"
      projectId={Number(projectId)}
      stage={Stage.ST1}
    />
  );
};
