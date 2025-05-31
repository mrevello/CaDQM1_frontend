import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { ProfileData } from "../../../types/dataProfiling";
import { dateFromat1 } from "../../../utils/constants";
import { StandardCSSProperties } from "@mui/system";

interface TableDetailTitleProps {
  table: string;
  data?: ProfileData;
  p?: StandardCSSProperties["padding"];
}

export const TableDetailTitle: React.FC<TableDetailTitleProps> = ({
  table,
  data,
  p,
}) => {
  return (
    <Box display="flex" flexDirection="row" p={p}>
      <Box display="flex" flexDirection="column">
        <Typography variant="h6">{table}</Typography>
        {data && (
          <Typography variant="caption">
            {`${data.analysis.title} • ${dayjs(data.analysis.dateStart).format(dateFromat1)} to ${dayjs(data.analysis.dateEnd).format(dateFromat1)}`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
