import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
} from "@mui/x-charts";
import { TypeChip } from "../TypeChip";
import { DataProfilingValue } from "../DataProfilingValue";
import { VariableProfileDetails } from "../../../types/dataProfiling";

interface VariableDataProps {
  name: string;
  variableData: VariableProfileDetails;
}

export const VariableData: React.FC<VariableDataProps> = ({
  name,
  variableData,
}) => {
  const {
    totalCount,
    missingCount,
    p_missing,
    mean,
    std,
    min,
    max,
    n_distinct,
    p_distinct,
    n_unique,
    p_unique,
    histogram,
    valueCountsWithoutNan,
  } = variableData;

  const histSeries =
    histogram?.counts && histogram.bin_edges
      ? histogram.counts.map((count, i) => ({
          x:
            histogram.bin_edges[i + 1] != null
              ? `${histogram.bin_edges[i].toFixed(1)}–${histogram.bin_edges[i + 1].toFixed(1)}`
              : `${histogram.bin_edges[i].toFixed(1)}`,
          y: count,
        }))
      : [];

  const catSeries = valueCountsWithoutNan
    ? Object.entries(valueCountsWithoutNan).map(([key, count]) => ({
        x: key,
        y: count,
      }))
    : [];

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
        <Box display="flex" flexDirection="column" gap={1} mb={2} flex={1}>
          <DataProfilingValue label="total-count" value={totalCount} />
          <DataProfilingValue
            label="missing"
            value={missingCount}
            percentage={p_missing}
          />
          <DataProfilingValue label="mean" value={mean?.toFixed(2)} />
          <DataProfilingValue label="std-dev" value={std?.toFixed(2)} />
          <DataProfilingValue label="min" value={min} />
          <DataProfilingValue label="max" value={max} />
          <DataProfilingValue
            label="distinct"
            value={n_distinct}
            percentage={p_distinct}
          />
          <DataProfilingValue
            label="unique"
            value={n_unique}
            percentage={p_unique}
          />
        </Box>

        {(histSeries.length > 0 || catSeries.length > 0) && (
          <Box height={300} flex={1}>
            <BarChart
              series={[
                {
                  type: "bar",
                  data: (histSeries.length > 0 ? histSeries : catSeries).map(
                    (d) => d.y
                  ),
                },
              ]}
              xAxis={[
                {
                  data: (histSeries.length > 0 ? histSeries : catSeries).map(
                    (d) => d.x
                  ),
                  scaleType: "band",
                },
              ]}
              height={300}
            >
              <ChartsXAxis />
              <ChartsYAxis />
              <ChartsTooltip />
            </BarChart>
          </Box>
        )}
      </Box>
    </Box>
  );
};
