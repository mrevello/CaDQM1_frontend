import React from 'react';
import { useParams } from 'react-router-dom';
import { DQPRoblemsIdentification } from '../../../../components/DQProblemsIdentification';
import { Stage } from '../../../../types/stage';

export const A03: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <DQPRoblemsIdentification projectId={Number(projectId)} showReview={false} stage={Stage.ST2} />
  );
};
