import { useCallback, useState } from 'react';
import { dataProfilingApi } from '../api/dataProfiling.api';
import { DataProfilingYResponse, SchemaSQL } from '../types/dataProfiling';

interface UseDataProfilingProps {
  projectId: number;
}

export const useDataProfiling = ({ projectId }: UseDataProfilingProps) => {
  const [loadingY, setLoadingY] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);

  const [schema, setSchema] = useState<SchemaSQL>();
  const [table, setTable] = useState<string>('');

  const [dataProfilingY, setDataProfilingY] = useState<DataProfilingYResponse>();
  const [dataProfilingR, setDataProfilingR] = useState<string>();

  const fetchSchema = useCallback(async () => {
    setLoadingSchema(true);
    try {
      const resp = await dataProfilingApi.schemaSQL(Number(projectId));
      if (resp) {
        setSchema(resp);
        const names = Object.keys(resp.schema);
        if (names.length) setTable(names[0]);
      }
    } catch (err) {
      console.error('Failed to load schema:', err);
    } finally {
      setLoadingSchema(false);
    }
  }, [projectId]);

  const fetchDataProfilingY = useCallback(async () => {
    setLoadingY(true);
    try {
      const y = await dataProfilingApi.dataProfilingY(Number(projectId));
      if (y) setDataProfilingY(y);
    } catch (err) {
      console.error('Failed to load Y profiling:', err);
    } finally {
      setLoadingY(false);
    }
  }, [projectId]);

  const fetchDataProfilingR = useCallback(async () => {
    setLoadingR(true);
    try {
      if (table) {
        const html = await dataProfilingApi.dataProfilingRhtmlText(Number(projectId), table);
        setDataProfilingR(html);
      }
    } catch (err) {
      console.error('Failed to load R HTML:', err);
    } finally {
      setLoadingR(false);
    }
  }, [projectId, table]);

  const handleDownloadRProfiling = useCallback(async () => {
    if (!table) {
      console.warn('No table selected for profiling');
      return;
    }
    try {
      setLoadingHtml(true);
      await dataProfilingApi.downloadDataProfilingRhtml(Number(projectId), table);
    } catch (err) {
      console.error('Failed to open DataExplorer report:', err);
    } finally {
      setLoadingHtml(false);
    }
  }, [projectId, table]);

  const handleDownloadYProfiling = useCallback(async () => {
    if (!table) {
      console.warn('No table selected for profiling');
      return;
    }
    try {
      setLoadingHtml(true);
      await dataProfilingApi.downloadDataProfilingYhtml(Number(projectId), table);
    } catch (err) {
      console.error('Failed to open DataExplorer report:', err);
    } finally {
      setLoadingHtml(false);
    }
  }, [projectId, table]);

  return {
    loadingY,
    loadingR,
    loadingHtml,
    loadingSchema,
    schema,
    table,
    setTable,
    fetchSchema,
    dataProfilingY,
    fetchDataProfilingY,
    dataProfilingR,
    fetchDataProfilingR,
    handleDownloadYProfiling,
    handleDownloadRProfiling,
  };
};
