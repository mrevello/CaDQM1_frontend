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
import DownloadIcon from '@mui/icons-material/Download';
import { SQLQueryDialog } from '../../../../components/DataProfiling/SQLQueryDialog';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SchemaVisualizer } from '../../../../components/SchemaVisualizer';
import { DataProfilingValue } from '../../../../components/DataProfiling/DataProfilingValue';
import { DataProfilingY } from '../../../../components/DataProfiling/DataProfilingY';
import { DataProfilingR } from '../../../../components/DataProfiling/DataProfilingR';
import { useDataProfiling } from '../../../../hooks/useDataProfiling';

export const A05: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const [tabIndex, setTabIndex] = useState(0);
  const [sqlDialogOpen, setSqlDialogOpen] = useState(false);

  const {
    loadingSchema,
    loadingY,
    loadingR,
    loadingHtml,
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
  } = useDataProfiling({ projectId: Number(projectId) });

  useEffect(() => {
    fetchSchema();
    fetchDataProfilingY();
  }, [fetchSchema, fetchDataProfilingY]);

  useEffect(() => {
    if (table) {
      fetchDataProfilingR();
    }
  }, [table, fetchDataProfilingR]);

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
          dataProfilingR && table && <DataProfilingR table={table} html={dataProfilingR} />
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
