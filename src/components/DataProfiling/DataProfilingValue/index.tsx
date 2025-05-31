import { Box, Typography } from "@mui/material";
import { StatusBar } from "../../StatusBar";
import { useTranslation } from "react-i18next";

interface DataProfilingValueProps {
  label: string;
  value?: number | string;
  percentage?: number;
  values?: Record<
    string,
    { count: number; color: string; backgroundColor?: string }
  >;
  color?: string;
}

export const DataProfilingValue: React.FC<DataProfilingValueProps> = ({
  label,
  value,
  percentage,
  values,
}) => {
  const { t } = useTranslation("dataProfiling");

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="subtitle2" color="text.secondary" fontSize={14}>
          {t(label)}
        </Typography>

        {value != null ? (
          <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
            <Typography variant="subtitle2" fontWeight={600} fontSize={14}>
              {value}
            </Typography>
            {percentage != null && (
              <Typography variant="caption" color="text.secondary">
                ({(percentage * 100).toFixed()}%)
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="subtitle2" fontWeight={600} fontSize={14}>
            -
          </Typography>
        )}
      </Box>
      {values &&
        (() => {
          const total = Object.values(values).reduce(
            (sum, val) => sum + val.count,
            0
          );

          return (
            <StatusBar
              segments={Object.entries(values).map(([key, val]) => ({
                label: key.toLowerCase(),
                value: val.count,
                percentage:
                  total !== 0 ? Math.round((val.count / total) * 100) : 0,
                color: val.color,
              }))}
            />
          );
        })()}
    </>
  );
};
