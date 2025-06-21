import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ProfileTableInfo } from '../../../types/dataProfiling';
import { TypeChip } from '../TypeChip';
import { useTranslation } from 'react-i18next';

interface ProfileTableInfoListProps {
  tableInfo: ProfileTableInfo;
}

export const ProfileTableInfoList: React.FC<ProfileTableInfoListProps> = ({ tableInfo }) => {
  const { t } = useTranslation();

  const infoItems = [
    { label: 'total-rows', value: tableInfo.rowCount },
    { label: 'variable-count', value: tableInfo.variableCount },
    { label: 'memory-size', value: tableInfo.memorySize },
    {
      label: 'record-size',
      value: `${tableInfo.recordSize.toFixed(2)} bytes`,
    },
    {
      label: 'missing-cells',
      value: tableInfo.missingCellsCount,
      percentage: tableInfo.missingCellsPercentage * 100,
    },
    {
      label: 'variables-with-missing-values',
      value: tableInfo.variablesWithMissingCount,
    },
    {
      label: 'variables-with-all-missing',
      value: tableInfo.variablesAllMissingCount,
    },
    {
      label: 'duplicated-rows',
      value: tableInfo.duplicateRowsCount,
      percentage: tableInfo.duplicateRowsPercentage * 100,
    },
  ];

  return (
    <Stack spacing={1}>
      {infoItems.map((item, index) => (
        <Card key={index} variant="outlined">
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
              <Typography variant="subtitle2" color="text.secondary" fontSize={14}>
                {t(item.label)}
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
                {item.value}
              </Typography>
            </Box>
            {item.percentage !== undefined && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.percentage}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
          </Box>
        </Card>
      ))}
      <Card variant="outlined">
        <Box p={2}>
          <Typography variant="subtitle2" color="text.secondary" fontSize={14} gutterBottom>
            {t('data-types')}
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
            {Object.entries(tableInfo.types).map(([type, info]) => (
              <TypeChip
                key={`${type}-${info.count}`}
                type={`${type} (${info.count})`}
                color={info.color}
                backgroundColor={info.backgroundColor}
              />
            ))}
          </Box>
        </Box>
      </Card>
    </Stack>
  );
};
