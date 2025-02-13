import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { MockProjects } from "../../utils/mockData";
import { getName, getTitle, Stage } from "../../types/stage";
import { StateChip } from "../../components/StateChip";

const Title = styled(Typography)({
  margin: "1.5rem 0rem",
});

const FilterContainer = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.5rem 1rem 2rem 1rem",
});

const ChipBoxContainer = styled(Box)({
  display: "flex",
  gap: 0.5,
  flexWrap: "wrap",
});

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [search, setSearch] = useState("");

  const handleStageChange = (event: SelectChangeEvent<Stage[]>) => {
    setSelectedStages(event.target.value as Stage[]);
  };

  const handleDeleteChip = (stageToDelete: Stage) => {
    setSelectedStages((prev) =>
      prev.filter((stage) => stage !== stageToDelete)
    );
  };

  const handleEdit = (id: string) => {
    console.log(`Edit project with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete project with ID: ${id}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredProjects = MockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.context.version.toLowerCase().includes(search.toLowerCase());

    const matchesStages =
      selectedStages.length === 0 || selectedStages.includes(project.stage);

    return matchesSearch && matchesStages;
  });

  return (
    <Container maxWidth="xl">
      <Title variant="h4">Projects</Title>

      <Card>
        <FilterContainer>
          <Grid container alignItems="center" spacing={2} flex={1}>
            <TextField
              name="search"
              label="Search"
              placeholder="Project, context, etc..."
              value={search}
              onChange={handleSearchChange}
              sx={{ width: "30%" }}
            />
            <FormControl sx={{ minWidth: 300 }} size="small">
              <InputLabel id="stage-select-label">Stage</InputLabel>
              <Select
                multiple
                name="stage"
                labelId="stage-select-label"
                value={selectedStages}
                onChange={handleStageChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => {
                  const sortedStages = (selected as Stage[]).sort(
                    (a, b) =>
                      Object.values(Stage).indexOf(a) -
                      Object.values(Stage).indexOf(b)
                  );
                  return (
                    <ChipBoxContainer>
                      {sortedStages.map((stage) => (
                        <Chip
                          key={stage}
                          label={t(getName(stage))}
                          onDelete={() => handleDeleteChip(stage)}
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      ))}
                    </ChipBoxContainer>
                  );
                }}
              >
                {Object.values(Stage).map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {t(getTitle(stage))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Button variant="contained">New</Button>
        </FilterContainer>

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "28%" }}>{t("name")}</TableCell>
                <TableCell sx={{ width: "15%" }}>
                  {t("context-version")}
                </TableCell>
                <TableCell sx={{ width: "30%" }}>{t("stage")}</TableCell>
                <TableCell sx={{ width: "15%" }}>{t("state")}</TableCell>
                <TableCell sx={{ width: "10%" }}>{t("actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project) => (
                  <TableRow hover tabIndex={-1} key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.context.version}</TableCell>
                    <TableCell>{t(getTitle(project.stage))}</TableCell>
                    <TableCell>
                      <StateChip state={project.state} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ pl: 0 }}
                        onClick={() => handleEdit(project.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(project.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[-1]}
            component="div"
            count={MockProjects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </TableContainer>
      </Card>
    </Container>
  );
};
