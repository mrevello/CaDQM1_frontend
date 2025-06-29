import { useState, useCallback } from 'react';
import { Project } from '../types/project';
import { projectsApi } from '../api/projects.api';
import { useTranslation } from 'react-i18next';
import { Problem } from '../types/problem';
import { Estimation } from '../types/estimation';
import { estimationApi } from '../api/estimation.api';
import { useContextComponents } from './useContextComponents';
import { ContextComponentsType } from '../types/contextComponent';
import { dataProfilingApi } from '../api/dataProfiling.api';
import { reviewApi } from '../api/review.api';
import { ReviewType } from '../types/review';
import { DataProfilingReport, PDFFile, ReviewPDFData } from '../components/PDFReport/types';
import { SchemaSQL } from '../types/dataProfiling';
import { PDFSelection } from '../components/PDFSelectionDialog';
import { problemsApi } from '../api/problem.api';

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

interface UsePDFReportData {
  project: Project | null;
  problems?: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  schema?: SchemaSQL;
  dataProfilingPerTable?: DataProfilingReport[];
  interaction?: ReviewPDFData;
  organizationElements?: ReviewPDFData;
}

interface UsePDFReportReturn {
  error: string | null;
  isLoading: boolean;
  fetchData: (selection?: PDFSelection) => Promise<UsePDFReportData>;
}

export const usePDFReport = ({ projectId }: UsePDFReportProps): UsePDFReportReturn => {
  const { t } = useTranslation();

  const [error, setError] = useState<string | null>(null);

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

      return response;
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError(t('error-loading-project'));
      return null;
    } finally {
      updateLoadingState('project', false);
    }
  }, [projectId, t, updateLoadingState]);

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

        return reviewData;
      } catch (err) {
        console.error(`Failed to fetch review ${type}:`, err);
        return undefined;
      } finally {
        updateLoadingState(type === 'interaction' ? 'interaction' : 'organizationElements', false);
      }
    },
    [projectId, updateLoadingState]
  );

  const fetchEstimation = useCallback(async () => {
    try {
      updateLoadingState('estimation', true);
      const estimationData: Estimation = await estimationApi.getEstimation(Number(projectId));
      return estimationData;
    } catch (err) {
      console.error('Failed to load estimation:', err);
      return undefined;
    } finally {
      updateLoadingState('estimation', false);
    }
  }, [projectId, updateLoadingState]);

  const fetchContextComponents = useCallback(async () => {
    try {
      updateLoadingState('contextComponents', true);
      const response = await listContextComponents();
      return response;
    } catch (error) {
      console.error('Failed to fetch context components', error);
      return undefined;
    } finally {
      updateLoadingState('contextComponents', false);
    }
  }, [listContextComponents, updateLoadingState]);

  const fetchDataProfiling = useCallback(async () => {
    try {
      updateLoadingState('dataProfiling', true);
      const schemaRes = await dataProfilingApi.schemaSQL(Number(projectId));

      const tableNames = Object.keys(schemaRes?.schema ?? {});
      if (tableNames.length > 0) {
        const profilingPromises = tableNames.map(async table => {
          const filename = await dataProfilingApi.downloadDataProfilingYhtml(
            Number(projectId),
            table
          );
          return {
            table,
            filename,
          };
        });
        const profilingData = await Promise.all(profilingPromises);
        return { schema: schemaRes, dataProfilingPerTable: profilingData };
      }
      return { schema: schemaRes, dataProfilingPerTable: [] };
    } catch (error) {
      console.error('Failed to fetch data profiling', error);
      return undefined;
    } finally {
      updateLoadingState('dataProfiling', false);
    }
  }, [projectId, updateLoadingState]);

  const loadProblems = useCallback(async () => {
    try {
      updateLoadingState('problems', true);
      const problemsFromApi = await problemsApi.listProblems(projectId);
      return problemsFromApi ?? [];
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      updateLoadingState('problems', false);
    }
  }, [projectId, updateLoadingState]);

  const fetchData = useCallback(
    async (selection?: PDFSelection): Promise<UsePDFReportData> => {
      const projectData = await loadProject();

      const promises = [];
      if (
        selection?.dqProblems ||
        selection?.stages.ST1?.activities.a03 ||
        selection?.stages.ST2?.activities.a03 ||
        selection?.stages.ST3?.activities.a03
      ) {
        promises.push(loadProblems());
      } else {
        promises.push(Promise.resolve(undefined));
      }

      if (selection?.stages.ST2?.activities.a06) {
        promises.push(fetchEstimation());
      } else {
        promises.push(Promise.resolve(undefined));
      }

      if (
        selection?.contextModel ||
        selection?.stages.ST1?.activities.a04 ||
        selection?.stages.ST2?.activities.a07 ||
        selection?.stages.ST3?.activities.a07
      ) {
        promises.push(fetchContextComponents());
      } else {
        promises.push(Promise.resolve(undefined));
      }

      if (selection?.stages.ST1?.activities.a01) {
        promises.push(fetchReview('interaction'));
      } else {
        promises.push(Promise.resolve(undefined));
      }

      if (selection?.stages.ST3?.activities.a08) {
        promises.push(fetchReview('organization_elements'));
      } else {
        promises.push(Promise.resolve(undefined));
      }

      if (selection?.stages.ST2?.activities.a05) {
        promises.push(fetchDataProfiling());
      } else {
        promises.push(Promise.resolve(undefined));
      }

      const [
        problemsData,
        estimationData,
        contextComponentsData,
        interactionData,
        organizationElementsData,
        dataProfilingData,
      ] = (await Promise.all(promises)) as [
        Problem[] | undefined,
        Estimation | undefined,
        ContextComponentsType | undefined,
        ReviewPDFData | undefined,
        ReviewPDFData | undefined,
        { schema: SchemaSQL; dataProfilingPerTable: DataProfilingReport[] } | undefined,
      ];

      return {
        project: projectData,
        problems: problemsData,
        estimation: estimationData,
        contextComponents: contextComponentsData,
        interaction: interactionData,
        organizationElements: organizationElementsData,
        schema: dataProfilingData?.schema,
        dataProfilingPerTable: dataProfilingData?.dataProfilingPerTable,
      };
    },
    [
      loadProject,
      loadProblems,
      fetchEstimation,
      fetchContextComponents,
      fetchReview,
      fetchDataProfiling,
    ]
  );

  return {
    error,
    isLoading,
    fetchData,
  };
};
