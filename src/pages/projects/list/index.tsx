import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import { projectsApi } from "../../../api/projects.api";
import { AlertDialog } from "../../../components/AlertDialog";
import { NewProjectDialog } from "../../../components/NewProjectDialog";
import { useNotification } from "../../../context/notification.context";
import {
  Project,
  ProjectBody,
  ProjectErrorsType,
  projectLink,
} from "../../../types/project";
import { Stage, StageList, getStageLabel, getStageTitle } from "../../../types/stage";
import { ProjectValidate } from "../../../utils/validateForm";
import * as yup from "yup";
import { Label } from "../../../components/Label";
import { ProjectDetail } from "../detail";
import { EmptyProjectState } from "../../../components/EmptyProjectState";
import { StateChip } from "../../../components/StateChip";
import { EditDeleteMenu } from "../../../components/EditDeleteMenu";
import { getName, State } from "../../../types/state";
import { WhiteCard } from "../../../StyledComponents/StyledComponents";
import { useNavigate } from "react-router-dom";

interface Column {
  id: string;
  label: string;
  labelInfo?: React.ReactNode;
  width?: string;
  pr?: number;
  align?: "right" | "left" | "center";
  render: (project: Project) => React.ReactNode;
}

export const ProjectsList: React.FC = () => {
  const { t } = useTranslation();
  const { getSuccess, getError } = useNotification();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [search, setSearch] = useState("");

  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selecredProject, setSelecredProject] = useState<Project | undefined>();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [projectErrors, setProjectErrors] = useState<ProjectErrorsType>({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    project: Project
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const projects = await projectsApi.listProjects();
      setProjectsList(projects || []);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(t("error-fetching-projects"));
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
        selectedStage === "all" ||
        project.stages
          .filter(
            (ps) => ps.status === State.TO_DO || ps.status === State.IN_PROGRESS
          )
          .map((ps) => ps.stage)
          .includes(selectedStage);

      return matchesSearch && matchesStages;
    })
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Handlers
  const handleStageChange = (event: SelectChangeEvent) => {
    const newStage = (event.target.value as Stage) || "all";
    setSelectedStage(newStage);
  };

  const handleEdit = (
    project: Project,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    setProjectToEdit(project);
    setNewDialogOpen(true);
  };

  const handleDelete = (id: number, event: React.MouseEvent<HTMLElement>) => {
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
      await projectsApi.deleteProject(projectToDelete.id);
      getSuccess(t("delete-success", { name: projectToDelete.name }));
      await fetchProjects();
    } catch (err: any) {
      getError(t("error-deleting-project", { message: err.message }));
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
    setProjectToEdit(null);
    setNewDialogOpen(true);
  };

  const handleCloseNewDialog = () => {
    setProjectToEdit(null);
    setProjectErrors({});
    setNewDialogOpen(false);
  };

  const handleDialogSubmit = async (formData: Record<string, any>) => {
    try {
      await ProjectValidate.validate(formData);
      setProjectErrors({});

      if (projectToEdit) {
        const updatedData: Partial<ProjectBody> = {
          name: formData.name,
          description: formData.description,
        };
        await projectsApi.updateProject(projectToEdit.id, updatedData);
      } else {
        const newProjectData: ProjectBody = {
          name: formData.name,
          description: formData.description,
        };
        const project = await projectsApi.createProject(newProjectData);
        if (!project) {
          console.warn("No project data returned");
          return;
        }
        navigate(projectLink(project));
      }
      handleCloseNewDialog();
      await fetchProjects();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Set form errors
        setProjectErrors({ name: error.errors[0] });
      } else {
        getError(t("error-creating-project", { error }));
      }
    }
  };

  // Column definitions
  const columns: Column[] = [
    {
      id: "name",
      label: t("name"),
      width: "20%",
      render: (project: Project) => (
        <Tooltip title={project.name} placement="bottom-start">
          <span>{project.name}</span>
        </Tooltip>
      ),
    },
    {
      id: "description",
      label: t("description"),
      width: "25%",
      render: (project: Project) => (
        <Tooltip title={project.description} placement="bottom-start">
          <span>{project.description}</span>
        </Tooltip>
      ),
    },
    {
      id: "context-version",
      label: t("context-version"),
      width: "15%",
      render: (project: Project) =>
        project.context ? (
          <span>{project.context.version}</span>
        ) : (
          <span>v 1.0</span>
        ),
    },
    {
      id: "dq-model-version",
      label: t("dq-model-version"),
      width: "15%",
      render: (project: Project) =>
        project.dqModel ? (
          <span>{project.dqModel.version}</span>
        ) : (
          <span>-</span>
        ),
    },
    {
      id: "stage",
      label: t("stage"),
      labelInfo: (
        <Box display="flex" flexDirection="column" gap={1}>
          <StateChip state={State.TO_DO} />
          <StateChip state={State.IN_PROGRESS} />
          <StateChip state={State.DONE} />
        </Box>
      ),
      width: "20%",
      render: (project: Project) => (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {project.stages.map((ps, index) => (
            <Tooltip title={t(getName(ps.status))} key={index}>
              <span key={index}>
                <StateChip
                  key={index}
                  state={ps.status}
                  textResource={getStageLabel(ps.stage)}
                />
              </span>
            </Tooltip>
          ))}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "",
      width: "5%",
      align: "right",
      pr: 0,
      render: (project: Project) => (
        <>
          <IconButton
            size="small"
            onClick={(event) => handleMenuOpen(event, project)}
            sx={{ p: 0 }}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>

          {selectedProject?.id === project.id && (
            <EditDeleteMenu
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              onEditClicked={(event) => {
                handleEdit(project, event);
                handleMenuClose();
              }}
              onDeleteClicked={(event) => {
                handleDelete(project.id, event);
                handleMenuClose();
              }}
            />
          )}
        </>
      ),
    },
  ];

  const hasProjects = projectsList.length > 0 && filteredProjects.length > 0;

  return (
    <Container maxWidth="lg">
      <Typography my={4} fontWeight={700} variant="h5" fontSize={30}>
        {t("projects")}
      </Typography>

      <WhiteCard sx={{ p: 3 }}>
        {projectsList.length === 0 ? (
          <EmptyProjectState onCreateNew={() => handleOpenNewDialog()} />
        ) : (
          <>
            <Grid display="flex" mb={3} gap={2}>
              <TextField
                name="search"
                label={t("search")}
                placeholder={t("search-placeholder")}
                value={search}
                onChange={handleSearchChange}
                sx={{ flex: 1 }}
              />
              <TextField
                name="stage"
                select
                label={t("stage")}
                value={selectedStage}
                onChange={(e) => handleStageChange(e as SelectChangeEvent)}
                sx={{ flex: 1 }}
                size="small"
              >
                <MenuItem key="all" value="all">
                  {t("all-stages")}
                </MenuItem>
                {StageList.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {t(getStageTitle(stage))}
                  </MenuItem>
                ))}
              </TextField>

              <Box display="flex" justifyContent="flex-end" flex={1}>
                <Button startIcon={<Add />} onClick={handleOpenNewDialog}>
                  {t("new")}
                </Button>
              </Box>
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
            ) : (
              <>
                <TableContainer
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    height: 440,
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            width={column.width}
                          >
                            <Label
                              text={column.label}
                              fontWeight={500}
                              infoMenuContent={column.labelInfo}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {hasProjects ? (
                        filteredProjects
                          .slice(
                            page * rowsPerPage - rowsPerPage,
                            page * rowsPerPage
                          )
                          .map((project) => (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={project.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelecredProject(project);
                                setProjectDialogOpen(true);
                              }}
                            >
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  width={column.width}
                                  sx={{
                                    pr: column.pr,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {column.render(project)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            sx={{ borderBottom: 0 }}
                          >
                            <Typography
                              my={4}
                              color="textSecondary"
                              textAlign="center"
                            >
                              {t("no-projects-found")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Pagination
                  page={page}
                  shape="rounded"
                  count={Math.ceil(projectsList.length / rowsPerPage)}
                  onChange={handleChangePage}
                  sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                />
              </>
            )}
          </>
        )}
      </WhiteCard>

      <NewProjectDialog
        open={newDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleDialogSubmit}
        errors={projectErrors}
        project={projectToEdit}
      />

      <AlertDialog
        open={deleteDialogOpen}
        title={t("delete-project-alert-title")}
        description={
          projectToDelete
            ? t("delete-project-alert-description", {
                name: projectToDelete.name,
              })
            : ""
        }
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {selecredProject && (
        <ProjectDetail
          project={selecredProject}
          open={projectDialogOpen}
          onClose={() => setProjectDialogOpen(false)}
        />
      )}
    </Container>
  );
};
