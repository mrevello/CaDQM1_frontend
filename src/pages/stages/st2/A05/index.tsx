import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { DataProfilingYResponse, SchemaSQL } from '../../../../types/dataProfiling';
import DownloadIcon from '@mui/icons-material/Download';
import { SQLQueryDialog } from '../../../../components/DataProfiling/SQLQueryDialog';
import { useParams } from 'react-router-dom';
import { dataProfilingApi } from '../../../../api/dataProfiling.api';
import { useTranslation } from 'react-i18next';
import { SchemaVisualizer } from '../../../../components/SchemaVisualizer';
import { DataProfilingValue } from '../../../../components/DataProfiling/DataProfilingValue';
import { DataProfilingY } from '../../../../components/DataProfiling/DataProfilingY';
import { DataProfilingR } from '../../../../components/DataProfiling/DataProfilingR';

export const A05: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const [schema, setSchema] = useState<SchemaSQL>();
  const [table, setTable] = useState<string>('');

  const [dataProfilingY, setDataProfilingY] = useState<DataProfilingYResponse>();
  const [rHtml, setRHtml] = useState<string>('');

  const [loadingSchema, setLoadingSchema] = useState(true);
  const [loadingY, setLoadingY] = useState(false);
  const [loadingR, setLoadingR] = useState(false);
  const [loadingHtml, setLoadingHtml] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSchema = async () => {
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
    };
    fetchSchema();
  }, [projectId]);

  useEffect(() => {
    if (!schema) return;
    const fetchY = async () => {
      setLoadingY(true);
      try {
        const y = await dataProfilingApi.dataProfilingY(Number(projectId));
        if (y) setDataProfilingY(y);
      } catch (err) {
        console.error('Failed to load Y profiling:', err);
      } finally {
        setLoadingY(false);
      }
    };
    fetchY();
  }, [schema, projectId]);

  useEffect(() => {
    if (!table) return;
    const fetchR = async () => {
      setLoadingR(true);
      try {
        const html = await dataProfilingApi.dataProfilingRhtmlText(Number(projectId), table);
        setRHtml(html);
      } catch (err) {
        console.error('Failed to load R HTML:', err);
      } finally {
        setLoadingR(false);
      }
    };
    fetchR();
  }, [table, projectId]);

  const summary = useMemo(() => {
    if (!schema) return null;
    let cols = 0;
    const typeCounts: Record<string, number> = {};
    Object.values(schema.schema).forEach(colsArr =>
      colsArr.forEach(({ type }) => {
        cols++;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      })
    );
    const rels = Object.values(schema.relations).reduce((sum, arr) => sum + arr.length, 0);
    return {
      tables: Object.keys(schema.schema).length,
      columns: cols,
      typeCounts,
      relations: rels,
    };
  }, [schema]);

  const handleDownloadRProfiling = async () => {
    if (!table) {
      console.warn('No table selected for profiling');
      return;
    }
    try {
      setLoadingHtml(true);
      await dataProfilingApi.dataProfilingRhtml(Number(projectId), table);
    } catch (err) {
      console.error('Failed to open DataExplorer report:', err);
    } finally {
      setLoadingHtml(false);
    }
  };

  const handleDownloadYProfiling = async () => {
    if (!table) {
      console.warn('No table selected for profiling');
      return;
    }
    try {
      setLoadingHtml(true);
      await dataProfilingApi.dataProfilingYhtml(Number(projectId), table);
    } catch (err) {
      console.error('Failed to open DataExplorer report:', err);
    } finally {
      setLoadingHtml(false);
    }
  };

  const handleDownloadProfiling = async () => {
    if (tabIndex === 0) {
      handleDownloadYProfiling();
    } else {
      handleDownloadRProfiling();
    }
  };

  if (loadingSchema) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" onClick={() => setSqlDialogOpen(true)}>
          {t('sql-query')}
        </Button>
      </Box>

      {schema && summary && (
        <Box mb={6}>
          <Typography variant="h6" mb={1}>
            {t('database-schema')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box flex={2}>
              <SchemaVisualizer schemaSQL={schema} selectedTable={table} setTable={setTable} />
            </Box>
            <Box flex={1}>
              <Card variant="outlined" sx={{ height: '60vh' }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6">{t('summary')}</Typography>
                  <Divider />
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1} px={1}>
                      <Typography variant="subtitle2" fontWeight={600} fontSize={14}>
                        {summary.tables}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" fontSize={14}>
                        {t('tables')}
                      </Typography>
                    </Box>
                    <Box pl={3} display="flex" flexDirection="column" gap={1}>
                      {Object.keys(schema.schema).map(nm => (
                        <Typography
                          key={nm}
                          variant="subtitle2"
                          color="text.secondary"
                          fontSize={14}
                        >
                          {nm}
                        </Typography>
                      ))}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} px={1}>
                      <Typography variant="subtitle2" fontWeight={600} fontSize={14}>
                        {summary.columns}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" fontSize={14}>
                        {t('columns')}
                      </Typography>
                    </Box>
                    <Box pl={3} display="flex" flexDirection="column" gap={1}>
                      {Object.entries(summary.typeCounts).map(([type, cnt]) => (
                        <DataProfilingValue key={type} label={type} value={cnt} />
                      ))}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} px={1}>
                      <Typography variant="subtitle2" fontWeight={600} fontSize={14}>
                        {summary.relations}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" fontSize={14}>
                        {t('relations')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Box>
      )}

      <Typography variant="h6" mb={1}>
        {t('data-profiling')}
      </Typography>

      <Box display="flex" justifyContent="space-between" borderBottom={1} borderColor="divider">
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
          <Tab disableRipple label={t('y-profiling')} />
          <Tab disableRipple label={t('r-profiling')} />
        </Tabs>

        <Button
          loading={loadingHtml}
          loadingPosition="start"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadProfiling}
        >
          {t('download-html')}
        </Button>
      </Box>

      <Box mt={2}>
        {tabIndex === 0 ? (
          loadingY ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            dataProfilingY &&
            table && <DataProfilingY table={table} data={dataProfilingY.reports[table]} />
          )
        ) : loadingR ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          rHtml && table && <DataProfilingR table={table} html={rHtml} />
        )}
      </Box>

      <SQLQueryDialog
        open={sqlDialogOpen}
        onClose={() => setSqlDialogOpen(false)}
        projectId={Number(projectId)}
        schema={schema?.schema}
      />
    </Box>
  );
};
