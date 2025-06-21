import { Box, Tabs, Tab, Typography, Divider, Card, CardContent } from '@mui/material';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { themePalette } from '../../../config/theme.config';
import { ProfileData, VariableProfileDetails } from '../../../types/dataProfiling';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import { ProfileTableInfoList } from '../ProfileTableInfoList';
import { ProfileAlertsList } from '../ProfileAlertsList';
import { VariableData } from '../VariableData';
import { SampleTable } from '../SampleTable';
import { TableDetailTitle } from '../TableDetailTitle';

interface DataProfilingYProps {
  table: string;
  data: ProfileData;
}

export const DataProfilingY: React.FC<DataProfilingYProps> = ({ table, data }) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Card>
      <Box display="flex" p={3} gap={6} flexDirection="column">
        <TableDetailTitle table={table} data={data} />

        <Box display="flex" gap={4} height={800}>
          <Box flex={1} height="100%" display="flex" flexDirection="column">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleChange} sx={{ display: 'flex' }}>
                <Tab
                  label={t('summary')}
                  sx={{
                    textTransform: 'none',
                    flex: 1,
                    minWidth: 120,
                    whiteSpace: 'nowrap',
                  }}
                />
                <Tab
                  label={t('alerts')}
                  sx={{
                    textTransform: 'none',
                    flex: 1,
                    minWidth: 120,
                    whiteSpace: 'nowrap',
                  }}
                />
              </Tabs>
            </Box>

            <Box pt={3} sx={{ flex: 1, overflow: 'auto' }}>
              {tabValue === 0 && <ProfileTableInfoList tableInfo={data.table} />}
              {tabValue === 1 && <ProfileAlertsList alerts={data.alerts} />}
            </Box>
          </Box>

          <Box flex={2} height="100%" overflow="auto">
            <VariablesData variables={data.variables} />
          </Box>
        </Box>

        <Box width="100%" overflow="auto">
          <Card sx={{ background: themePalette.BACKGROUND }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" mb={3} fontSize={18}>
                {t('sample-data')}
              </Typography>

              <SampleTable sampleData={data.sample} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Card>
  );
};

interface VariablesDataProps {
  variables: Record<string, VariableProfileDetails>;
}

const VariablesData: React.FC<VariablesDataProps> = ({ variables }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 3, overflow: 'auto', height: '100%', width: '100%' }}>
      <Typography variant="h6" mb={3} fontSize={18} display="flex" alignItems="center" gap={1}>
        <AppsOutlinedIcon fontSize="small" />
        {t('variables-analysis')}
      </Typography>
      <Box display="flex" flexDirection="column" gap={4}>
        {Object.entries(variables).map(([name, variableData], index, array) => (
          <Fragment key={name}>
            <VariableData name={name} variableData={variableData} />
            {index < array.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Box>
    </Card>
  );
};
