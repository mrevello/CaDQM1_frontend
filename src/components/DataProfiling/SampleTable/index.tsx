import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ColumnSchema, SampleData } from "../../../types/dataProfiling";
import { themePalette } from "../../../config/theme.config";

interface SampleDataProps {
  sampleData: SampleData[];
}
export const SampleTable: React.FC<SampleDataProps> = ({ sampleData }) => {
  if (!Array.isArray(sampleData) || sampleData.length === 0) {
    return <Typography>No sample data available</Typography>;
  }

  const firstSample = sampleData[0];

  const columnTypesArray: ColumnSchema[] = Array.isArray(
    firstSample.columnTypes
  )
    ? firstSample.columnTypes
    : [];

  const columns: ColumnSchema[] = Object.keys(
    (firstSample.data && firstSample.data[0]) || {}
  ).map((key) => {
    const ct = columnTypesArray.find((col) => col.column === key);
    return {
      column: key,
      type: ct?.type ?? "text",
    };
  });

  const rows = Array.isArray(firstSample.data) ? firstSample.data : [];

  return (
    <TableContainer
      component={Card}
      sx={{
        maxHeight: 500,
        borderRadius: 1,
        overflow: "auto",
        background: themePalette.BACKGROUND,
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.column} sx={{ minWidth: 150, py: 0.3 }}>
                <Typography variant="caption" fontWeight="medium" fontSize={14}>
                  {col.column}
                </Typography>
                <Typography display="block" variant="caption" fontSize={12}>
                  {col.type.toLowerCase()}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {columns.map((col) => (
                <TableCell
                  key={col.column}
                  sx={{ fontFamily: "Monospace", fontSize: 12 }}
                >
                  {row[col.column] ?? "null"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
