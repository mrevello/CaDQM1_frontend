import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, ChartsXAxis, ChartsYAxis, ChartsTooltip } from '@mui/x-charts';
import { TypeChip } from '../TypeChip';
import { DataProfilingValue } from '../DataProfilingValue';
import { VariableProfileDetails } from '../../../types/dataProfiling';
import { useTranslation } from 'react-i18next';

interface HistData {
  counts: number[];
  bin_edges: number[];
}
interface CatData {
  [key: string]: number;
}

interface VariableDataProps {
  name: string;
  variableData: VariableProfileDetails;
}

export const VariableData: React.FC<VariableDataProps> = ({ name, variableData }) => {
  const { t } = useTranslation();

  const totalCount = variableData.n ?? variableData.count ?? 0;

  const missingCount = variableData.missingCount ?? variableData.n_missing ?? 0;
  const p_missing = variableData.p_missing ?? 0;

  const mean = variableData.mean;
  const std = variableData.std;
  const min = variableData.min;
  const max = variableData.max;

  const n_distinct = variableData.n_distinct;
  const p_distinct = variableData.p_distinct;
  const n_unique = variableData.n_unique;
  const p_unique = variableData.p_unique;

  const isUnique = variableData.is_unique ?? false;
  const isOrdered = variableData.ordering ?? false;

  const memorySize = variableData.memory_size / 1000;

  const rawHist = (variableData.histogram ?? variableData.histogram_length) as HistData | undefined;

  const histSeries =
    rawHist?.counts.map((count: number, i: number) => ({
      x:
        rawHist.bin_edges[i + 1] != null
          ? `${rawHist.bin_edges[i].toFixed(1)}–${rawHist.bin_edges[i + 1].toFixed(1)}`
          : `${rawHist.bin_edges[i].toFixed(1)}`,
      y: count,
    })) ?? [];

  const rawCounts = (variableData.valueCountsWithoutNan ??
    (variableData as any).value_counts_without_nan) as CatData | undefined;

  const catSeries = rawCounts
    ? Object.entries(rawCounts).map(([key, cnt]: [string, number]) => ({
        x: key,
        y: cnt,
      }))
    : [];

  const chartDescription =
    histSeries.length > 0 ? 'Histogram' : catSeries.length > 0 ? 'Value counts' : '';

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle2">{name}</Typography>
        <TypeChip
          type={variableData.type}
          color={variableData.typeColor}
          backgroundColor={variableData.typeBackgroundColor}
        />
      </Box>

      <Box display="flex" flexDirection="row" gap={1}>
        <Box flex={1} display="flex" flexDirection="column" gap={1} mb={2}>
          {totalCount && <DataProfilingValue label="total-count" value={totalCount} />}

          {missingCount != null && (
            <DataProfilingValue label="missing" value={missingCount} percentage={p_missing} />
          )}

          {mean && <DataProfilingValue label="mean" value={mean?.toFixed(2)} />}

          {std && <DataProfilingValue label="std-dev" value={std?.toFixed(2)} />}

          {min && <DataProfilingValue label="min" value={min} />}

          {max && <DataProfilingValue label="max" value={max} />}

          {n_distinct && (
            <DataProfilingValue label="distinct" value={n_distinct} percentage={p_distinct} />
          )}

          <DataProfilingValue label="unique" value={n_unique} percentage={p_unique} />

          <DataProfilingValue label="is-unique" value={isUnique ? t('yes') : t('no')} />
          <DataProfilingValue label="is-ordered" value={isOrdered ? t('yes') : t('no')} />

          {memorySize && (
            <DataProfilingValue label="memory-size" value={`${memorySize.toFixed(2)} kB`} />
          )}
        </Box>

        {(histSeries.length > 0 || catSeries.length > 0) && (
          <Box flex={1}>
            <Box display="flex" flexDirection="column" alignItems="center" height={300}>
              <BarChart
                series={[
                  {
                    type: 'bar',
                    data: (histSeries.length > 0 ? histSeries : catSeries).map(d => d.y),
                  },
                ]}
                xAxis={[
                  {
                    data: (histSeries.length > 0 ? histSeries : catSeries).map(d => d.x),
                    scaleType: 'band',
                  },
                ]}
                height={300}
              >
                <ChartsXAxis />
                <ChartsYAxis />
                <ChartsTooltip />
              </BarChart>
              {chartDescription && (
                <Typography variant="caption" color="text.secondary">
                  {chartDescription}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
