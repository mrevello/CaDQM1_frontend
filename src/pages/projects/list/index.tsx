import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { projects } from "../../../api/projects.api";
import { AlertDialog } from "../../../components/AlertDialog";
import { NewProjectDialog } from "../../../components/NewProjectDialog";
import { StateChip } from "../../../components/StateChip";
import { useNotification } from "../../../context/notification.context";
import { ProjectType, ProjectErrorsType } from "../../../types/project";
import {
  Stage,
  getStageTitle,
  getStageLabel,
  getStageActivities,
} from "../../../types/stage";
import { ProjectValidate } from "../../../utils/validateForm";
import * as yup from "yup";
import { Label } from "../../../components/Label";

interface Column {
  id: string;
  label: string;
  width?: string;
  pr?: number;
  align?: "right" | "left" | "center";
  render: (project: ProjectType) => React.ReactNode;
}

export const ProjectList: React.FC = () => {
  const { t } = useTranslation(["project", "common"]);
  const navigate = useNavigate();
  const { getSuccess, getError } = useNotification();

  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const [projectsList, setProjectsList] = useState<ProjectType[]>([]);
  const [selecredProject, setSelecredProject] = useState<
    ProjectType | undefined
  >();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [projectErrors, setProjectErrors] = useState<ProjectErrorsType>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectType | null>(
    null
  );

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await projects.listProjects();
      setProjectsList(data);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(t("project:error-fetching-projects"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects
  const filteredProjects = projectsList
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        (project.context?.version || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStages =
        selectedStages.length === 0 || selectedStages.includes(project.stage);

      return matchesSearch && matchesStages;
    })
    .sort((a, b) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

  // Handlers
  const handleStageChange = (event: SelectChangeEvent<Stage[]>) => {
    setSelectedStages(event.target.value as Stage[]);
  };

  const handleDeleteChip = (stageToDelete: Stage) => {
    setSelectedStages((prev) =>
      prev.filter((stage) => stage !== stageToDelete)
    );
  };

  const handleEdit = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Edit project with ID: ${id}`);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const project = projectsList.find((p) => p.id === id);
    if (project) {
      setProjectToDelete(project);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await projects.deleteProject(projectToDelete.id);
      getSuccess(t("project:delete-success", { name: projectToDelete.name }));
      await fetchProjects();
    } catch (err: any) {
      getError(t("project:error-deleting-project", { message: err.message }));
      console.error("Error deleting project:", err);
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleOpenNewDialog = () => {
    setNewDialogOpen(true);
  };

  const handleCloseNewDialog = () => {
    setProjectErrors({});
    setNewDialogOpen(false);
  };

  const handleNewProjectSubmit = async (formData: Record<string, any>) => {
    try {
      await ProjectValidate.validate(formData);
      setProjectErrors({});
      await projects.createProject({
        name: formData.name,
        description: formData.description,
      });
      handleCloseNewDialog();
      await fetchProjects();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Set form errors
        setProjectErrors({ name: error.errors[0] });
      } else {
        getError(t("project:error-creating-project", { error }));
      }
    }
  };

  // Column definitions
  const columns: Column[] = [
    {
      id: "name",
      label: t("common:name"),
      width: "25%",
      render: (project: ProjectType) => (
        <Tooltip title={project.name} placement="bottom-start">
          <span>{project.name}</span>
        </Tooltip>
      ),
    },
    {
      id: "description",
      label: t("common:description"),
      width: "20%",
      render: (project: ProjectType) => (
        <Tooltip title={project.description} placement="bottom-start">
          <span>{project.description}</span>
        </Tooltip>
      ),
    },
    {
      id: "context-version",
      label: t("common:context-version"),
      width: "20%",
      render: (project: ProjectType) =>
        project.context ? (
          <span>{project.context.version}</span>
        ) : (
          <span>-</span>
        ),
    },
    {
      id: "dq-model-version",
      label: t("common:dq-model-version"),
      width: "20%",
      render: (project: ProjectType) =>
        project.dqModel ? (
          <span>{project.dqModel.version}</span>
        ) : (
          <span>-</span>
        ),
    },
    {
      id: "stage",
      label: t("common:stage"),
      width: "20%",
      render: (project: ProjectType) => (
        <Tooltip title={t(getStageTitle(project.stage))}>
          <span>{t(getStageTitle(project.stage))}</span>
        </Tooltip>
      ),
    },
    {
      id: "state",
      label: t("common:state"),
      width: "15%",
      render: (project: ProjectType) => <StateChip state={project.state} />,
    },
    {
      id: "actions",
      label: t("common:actions"),
      width: "10%",
      align: "right",
      pr: 0,
      render: (project: ProjectType) => (
        <Box>
          <Tooltip title={t("common:edit")}>
            <IconButton onClick={(event) => handleEdit(project.id, event)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("common:delete")}>
            <IconButton onClick={(event) => handleDelete(project.id, event)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography mt={4} mb={4} fontWeight={500} variant="h5">
        {t("project:projects")}
      </Typography>

      <Card sx={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
        <Grid m={2} mt={3} mb={4} display="flex">
          <Grid container spacing={2} alignItems="center" flex={1}>
            <TextField
              name="search"
              label={t("common:search")}
              placeholder={t("common:search-placeholder")}
              value={search}
              onChange={handleSearchChange}
              sx={{ width: "30%" }}
            />
            <FormControl sx={{ minWidth: 300 }} size="small">
              <InputLabel id="stage-select-label">
                {t("common:stage")}
              </InputLabel>
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
                    <Box display="flex" gap={0.5}>
                      {sortedStages.map((stage) => (
                        <Chip
                          key={stage}
                          label={t(getStageLabel(stage))}
                          onDelete={() => handleDeleteChip(stage)}
                          onMouseDown={(event) => event.stopPropagation()}
                          sx={{ fontSize: 12, fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  );
                }}
              >
                {Object.values(Stage).map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {t(getStageTitle(stage))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Button startIcon={<Add />} onClick={handleOpenNewDialog}>
            {t("common:new")}
          </Button>
        </Grid>

        {loading ? (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={2}
          >
            <Typography variant="body1" color="textSecondary">
              {t("project:no-projects-found")}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                flex: 1,
                overflow: "auto",
                maxHeight: 440,
              }}
            >
              <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        <Label text={column.label} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((project) => {
                      const activities = getStageActivities(project.stage);
                      const firstActivity = activities[0];
                      const linkTo = `/projects/${project.id}/${project.stage.toLowerCase()}/${firstActivity}`;

                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={project.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(linkTo)}
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{ pr: column.pr }}
                            >
                              {column.render(project)}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[-1]}
              component="div"
              count={projectsList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </>
        )}
      </Card>

      <NewProjectDialog
        open={newDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleNewProjectSubmit}
        errors={projectErrors}
      />

      <AlertDialog
        open={deleteDialogOpen}
        title={t("project:delete-project-alert-title")}
        description={
          projectToDelete
            ? t("project:delete-project-alert-description", {
                name: projectToDelete.name,
              })
            : ""
        }
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
};
