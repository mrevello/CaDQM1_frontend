import { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { projectsApi } from '../api/projects.api';
import { useTranslation } from 'react-i18next';
import { useDQProblems } from './useDQProblems';
import { Problem } from '../types/problem';
import { Estimation } from '../types/estimation';
import { estimationApi } from '../api/estimation.api';
import { useContextComponents } from './useContextComponents';
import { ContextComponentsType } from '../types/contextComponent';

interface UsePDFReportProps {
  projectId: number;
}

interface UsePDFReportReturn {
  project: Project | null;
  error: string | null;
  isLoading: boolean;
  problems: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
}

export const usePDFReport = ({ projectId }: UsePDFReportProps): UsePDFReportReturn => {
  const { t } = useTranslation();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [estimation, setEstimation] = useState<Estimation>();
  const [contextComponents, setContextComponents] = useState<ContextComponentsType>();

  const { problems, fetchProblems } = useDQProblems({ projectId });
  const { listContextComponents } = useContextComponents({ projectId });

  const loadProject = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await projectsApi.getProject(Number(projectId));

      if (!response) {
        setError(t('noƒ-projects-found'));
        return;
      }

      setProject(response);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      //   showError(t('error-fetching-projects'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEstimation = async () => {
    try {
      const estimation: Estimation = await estimationApi.getEstimation(Number(projectId));

      if (estimation) {
        setEstimation(estimation);
      }
    } catch (err) {
      console.error('Failed to load estimation:', err);
    }
  };

  const fetchContextComponents = async () => {
    try {
      const response = await listContextComponents();

      if (response) {
        setContextComponents(response);
      }
    } catch (error) {
      console.error('Failed to fetch context components', error);
    }
  };

  const fetchData = async () => {
    await loadProject();
    await fetchProblems();
    await fetchEstimation();
    await fetchContextComponents();
  };

  useEffect(() => {
    console.log('fetching data', projectId);
    fetchData();
  }, [projectId]);

  return {
    project,
    problems,
    error,
    isLoading,
    estimation,
    contextComponents,
  };
};
