import { contextApi } from '../api/context.api';
import {
  ContextComponent,
  ContextComponentsType,
  ContextComponentType,
} from '../types/contextComponent';
import { Stage } from '../types/stage';
import { reviewApi } from '../api/review.api';
import { ReviewType } from '../types/review';

interface UseContextComponentsProps {
  projectId: number;
  stage?: Stage;
  type?: ReviewType;
}

export const useContextComponents = ({ projectId, stage, type }: UseContextComponentsProps) => {
  const listContextComponents = async (): Promise<ContextComponentsType> => {
    return await contextApi.listContextComponents(Number(projectId));
  };

  const getContextComponentsAnalysis = async (): Promise<ContextComponentsType | null> => {
    if (!type) return null;
    const analysisData = await reviewApi.getContextComponentsAnalysis(Number(projectId), type);
    return analysisData;
  };

  const createContextComponent = async (
    type: ContextComponentType,
    data: any
  ): Promise<ContextComponent> => {
    const response = await contextApi.createContextComponent(type, data, Number(projectId), stage);
    return response;
  };

  const updateContextComponent = async (
    id: number,
    type: ContextComponentType,
    data: any
  ): Promise<ContextComponent> => {
    return await contextApi.updateContextComponent(id, type, data, projectId);
  };

  const deleteContextComponent = async (id: number, type: ContextComponentType) => {
    return await contextApi.deleteComponent(id, type);
  };
  return {
    listContextComponents,
    getContextComponentsAnalysis,
    createContextComponent,
    updateContextComponent,
    deleteContextComponent,
  };
};
