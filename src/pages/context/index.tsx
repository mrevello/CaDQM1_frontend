import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContextComponentsType } from "../../types/contextComponent";
import { Box, Fab, Tooltip, Typography } from "@mui/material";
import { projectsApi } from "../../api/projects.api";
import { Project } from "../../types/project";
import { ContextComponents } from "../../components/Context/ContextComponents";
import { Add } from "@mui/icons-material";
import { NewContextComponentDialog } from "../../components/NewContextComponentDialog";
import { contextApi } from "../../api/context.api";
import { useNotification } from "../../context/notification.context";

export const Context: React.FC = () => {
  const { t } = useTranslation();
  const { getSuccess, getError } = useNotification();
  const { projectId } = useParams<{ projectId: string }>();

  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const project = await projectsApi.getProject(Number(projectId));
        if (!project) {
          console.warn("No project data returned");
          return;
        }
        setProject(project);
      } catch (error) {}
    };

    fetchAndUpdate();
  }, [projectId]);

  const handleNewContextComponentSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      const { id, type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }

      await contextApi.createContextComponent(type, data, Number(projectId));

      setNewDialogOpen(false);
      fetchContextComponents();
    } catch (error) {
      console.error("Error creating context component:", error);
      console.log("error", error);
      if (error instanceof Error && error.message) {
        console.log("error.message", error.message);
      } else {
        getError(t("unexpected-error"));
      }
    }
  };

  const fetchContextComponents = async () => {
    try {
      const contextFromApi = await contextApi.listContextComponents(
        Number(projectId)
      );
      setContextComponents(contextFromApi);
    } catch (err) {
      console.error("Error fetching context components:", err);
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        height="100vh"
        width="100vw"
        position="relative"
        overflow="auto"
      >
        <Typography variant="h6">{t("context")}</Typography>
        <Typography variant="subtitle2">{project?.context?.version}</Typography>

        <ContextComponents
          projectId={Number(projectId)}
          contextComponents={contextComponents}
          setContextComponents={setContextComponents}
          showActions={true}
        />

        <Tooltip title={t("new")} placement="left">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setNewDialogOpen(true)}
            sx={{ position: "fixed", bottom: 24, right: 24 }}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>

      <NewContextComponentDialog
        open={newDialogOpen}
        projectId={Number(projectId)}
        onClose={() => setNewDialogOpen(false)}
        onSubmit={handleNewContextComponentSubmit}
      />
    </>
  );
};
