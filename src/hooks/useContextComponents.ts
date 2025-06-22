import { contextApi } from '../api/context.api';
import {
  ContextComponent,
  ContextComponentsType,
  ContextComponentType,
} from '../types/contextComponent';
import { Stage } from '../types/stage';
import { reviewApi } from '../api/review.api';
import { ReviewType } from '../types/review';
import { useCallback } from 'react';

interface UseContextComponentsProps {
  projectId: number;
  stage?: Stage;
  type?: ReviewType;
}

export const useContextComponents = ({ projectId, stage, type }: UseContextComponentsProps) => {
  const listContextComponents = useCallback(async (): Promise<ContextComponentsType> => {
    return await contextApi.listContextComponents(Number(projectId));
  }, [projectId]);

  const getContextComponentsAnalysis =
    useCallback(async (): Promise<ContextComponentsType | null> => {
      if (!type) return null;
      const analysisData = await reviewApi.getContextComponentsAnalysis(Number(projectId), type);
      return analysisData;
    }, [projectId, type]);

  const createContextComponent = useCallback(
    async (type: ContextComponentType, data: any): Promise<ContextComponent> => {
      const response = await contextApi.createContextComponent(
        type,
        data,
        Number(projectId),
        stage
      );
      return response;
    },
    [projectId, stage]
  );

  const updateContextComponent = useCallback(
    async (id: number, type: ContextComponentType, data: any): Promise<ContextComponent> => {
      return await contextApi.updateContextComponent(id, type, data, projectId);
    },
    [projectId]
  );

  const deleteContextComponent = useCallback(async (id: number, type: ContextComponentType) => {
    return await contextApi.deleteComponent(id, type);
  }, []);

  return {
    listContextComponents,
    getContextComponentsAnalysis,
    createContextComponent,
    updateContextComponent,
    deleteContextComponent,
  };
};
