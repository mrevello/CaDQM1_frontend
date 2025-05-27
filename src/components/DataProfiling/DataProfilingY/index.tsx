import {
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { themePalette } from "../../../config/theme.config";
import {
  ProfileData,
  VariableProfileDetails,
} from "../../../types/dataProfiling";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import { ProfileTableInfoList } from "../ProfileTableInfoList";
import { ProfileAlertsList } from "../ProfileAlertsList";
import { VariableData } from "../VariableData";
import { SampleTable } from "../SampleTable";
import { TableDetailTitle } from "../TableDetailTitle";

interface DataProfilingYProps {
  table: string;
  data: ProfileData;
}

export const DataProfilingY: React.FC<DataProfilingYProps> = ({
  table,
  data,
}) => {
  const { t } = useTranslation("dataProfiling");
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Card>
      <Box display="flex" p={3} gap={4} flexDirection="column">
        <TableDetailTitle table={table} data={data} />

        <Grid container spacing={4}>
          <Grid size={4}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                sx={{ display: "flex" }}
              >
                <Tab
                  label={t("dataProfiling:summary")}
                  sx={{
                    textTransform: "none",
                    flex: 1,
                    minWidth: 120,
                    whiteSpace: "nowrap",
                  }}
                />
                <Tab
                  label={t("dataProfiling:alerts")}
                  sx={{
                    textTransform: "none",
                    flex: 1,
                    minWidth: 120,
                    whiteSpace: "nowrap",
                  }}
                />
              </Tabs>
            </Box>

            <Box sx={{ pt: 3, flexGrow: 1 }}>
              {tabValue === 0 && (
                <Box>
                  <ProfileTableInfoList tableInfo={data.table} />
                </Box>
              )}
              {tabValue === 1 && (
                <Box>
                  <ProfileAlertsList alerts={data.alerts} />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid size={8}>
            <VariablesData variables={data.variables} />
          </Grid>
        </Grid>

        <Box width="100%" height={740} overflow="auto">
          <Card sx={{ background: themePalette.BACKGROUND }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" mb={3} fontSize={18}>
                {t("sample-data")}
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
  const { t } = useTranslation("dataProfiling");

  return (
    <Card sx={{ p: 3 }}>
      <Typography
        variant="h6"
        mb={3}
        fontSize={18}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <AppsOutlinedIcon fontSize="small" />
        {t("variables-analysis")}
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
