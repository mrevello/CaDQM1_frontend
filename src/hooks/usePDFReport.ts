import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/project';
import { projectsApi } from '../api/projects.api';
import { useTranslation } from 'react-i18next';
import { useDQProblems } from './useDQProblems';
import { Problem } from '../types/problem';
import { Estimation } from '../types/estimation';
import { estimationApi } from '../api/estimation.api';
import { useContextComponents } from './useContextComponents';
import { ContextComponentsType } from '../types/contextComponent';
import { dataProfilingApi } from '../api/dataProfiling.api';
import { reviewApi } from '../api/review.api';
import { ReviewType } from '../types/review';
import { DataProfilingReport, PDFFile, ReviewPDFData } from '../components/PDFReport/types';

interface UsePDFReportProps {
  projectId: number;
}

interface LoadingStates {
  project: boolean;
  problems: boolean;
  estimation: boolean;
  contextComponents: boolean;
  dataProfiling: boolean;
  interaction: boolean;
  organizationElements: boolean;
}

interface UsePDFReportReturn {
  project: Project | null;
  error: string | null;
  isLoading: boolean;
  problems: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  dataProfilingPerTable?: DataProfilingReport[];
  interaction?: ReviewPDFData;
  organizationElements?: ReviewPDFData;
}

export const usePDFReport = ({ projectId }: UsePDFReportProps): UsePDFReportReturn => {
  const { t } = useTranslation();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimation, setEstimation] = useState<Estimation>();
  const [contextComponents, setContextComponents] = useState<ContextComponentsType>();
  const [dataProfilingPerTable, setDataProfilingPerTable] = useState<DataProfilingReport[]>();
  const [interaction, setInteraction] = useState<ReviewPDFData>();
  const [organizationElements, setOrganizationElements] = useState<ReviewPDFData>();

  // Granular loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    project: false,
    problems: false,
    estimation: false,
    contextComponents: false,
    dataProfiling: false,
    interaction: false,
    organizationElements: false,
  });

  const { problems, fetchProblems } = useDQProblems({ projectId });
  const { listContextComponents } = useContextComponents({ projectId });

  // Computed overall loading state
  const isLoading = Object.values(loadingStates).some(loading => loading);

  const updateLoadingState = useCallback((key: keyof LoadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const loadProject = useCallback(async (): Promise<Project | null> => {
    try {
      updateLoadingState('project', true);
      const response = await projectsApi.getProject(Number(projectId));

      if (!response) {
        setError(t('no-projects-found'));
        return null;
      }

      setProject(response);
      return response;
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError(t('error-loading-project'));
      return null;
    } finally {
      updateLoadingState('project', false);
    }
  }, [projectId, t]);

  const fetchReview = useCallback(
    async (type: ReviewType) => {
      try {
        updateLoadingState(type === 'interaction' ? 'interaction' : 'organizationElements', true);
        const review = await reviewApi.getReview(projectId, type);

        if (!review) {
          return undefined;
        }

        const filesResponse = await reviewApi.getReviewFiles(projectId, review.type);
        const mappedFiles: PDFFile[] = filesResponse.map((file: any) => ({
          id: file.id.toString(),
          name: file.filename,
          description: file.description,
        }));

        const reviewData = { review, files: mappedFiles };
        if (type === 'interaction') {
          setInteraction(reviewData);
        } else {
          setOrganizationElements(reviewData);
        }
      } catch (err) {
        console.error(`Failed to fetch review ${type}:`, err);
        return undefined;
      } finally {
        updateLoadingState(type === 'interaction' ? 'interaction' : 'organizationElements', false);
      }
    },
    [projectId]
  );

  const fetchEstimation = useCallback(async () => {
    try {
      updateLoadingState('estimation', true);
      const estimation: Estimation = await estimationApi.getEstimation(Number(projectId));

      if (estimation) {
        setEstimation(estimation);
      }
    } catch (err) {
      console.error('Failed to load estimation:', err);
    } finally {
      updateLoadingState('estimation', false);
    }
  }, [projectId]);

  const fetchContextComponents = useCallback(async () => {
    try {
      updateLoadingState('contextComponents', true);
      const response = await listContextComponents();
      if (response) {
        setContextComponents(response);
      }
    } catch (error) {
      console.error('Failed to fetch context components', error);
    } finally {
      updateLoadingState('contextComponents', false);
    }
  }, [projectId, listContextComponents]);

  const fetchDataProfiling = useCallback(async () => {
    try {
      updateLoadingState('dataProfiling', true);
      const schema = await dataProfilingApi.schemaSQL(Number(projectId));

      if (schema) {
        const tableNames = Object.keys(schema.schema);
        if (tableNames.length > 0) {
          // Use Promise.all to handle concurrent API calls
          const profilingPromises = tableNames.map(async table => {
            const [rHtmlUrl, yHtmlUrl] = await Promise.all([
              dataProfilingApi.dataProfilingRhtmlContent(Number(projectId), table),
              dataProfilingApi.dataProfilingYhtmlContent(Number(projectId), table),
            ]);

            return {
              table,
              rHtmlUrl,
              yHtmlUrl,
            };
          });

          const dataProfilingPerTable = await Promise.all(profilingPromises);
          if (dataProfilingPerTable) {
            setDataProfilingPerTable(dataProfilingPerTable);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch data profiling', error);
    } finally {
      updateLoadingState('dataProfiling', false);
    }
  }, [projectId]);

  const loadProblems = useCallback(async () => {
    try {
      updateLoadingState('problems', true);
      await fetchProblems();
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      updateLoadingState('problems', false);
    }
  }, [projectId, fetchProblems]);

  useEffect(() => {
    loadProject();
    loadProblems();
    fetchEstimation();
    fetchContextComponents();
    fetchReview('interaction');
    fetchReview('organization_elements');
  }, [projectId, loadProject, loadProblems, fetchEstimation, fetchContextComponents, fetchReview]);

  return {
    project,
    problems,
    error,
    isLoading,
    estimation,
    contextComponents,
    dataProfilingPerTable,
    interaction,
    organizationElements,
  };
};
