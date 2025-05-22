import React from "react";
import { useParams } from "react-router-dom";
import { Stage } from "../../../../types/stage";
import { ContextReview } from "../../../../components/ContextReview";

export const A07: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <ContextReview
      projectId={Number(projectId)}
      stage={Stage.ST2}
      showReview={false}
    />
  );
};
