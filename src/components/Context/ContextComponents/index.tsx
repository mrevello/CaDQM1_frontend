import { SimpleTreeView } from "@mui/x-tree-view";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentErrorsType,
  ContextComponentsType,
  ContextComponentType,
} from "../../../types/contextComponent";
import { Placeholder } from "../../Placeholder";
import { Box, Button, Typography } from "@mui/material";
import TocSharpIcon from "@mui/icons-material/TocSharp";
import { contextApi } from "../../../api/context.api";
import { NewContextComponentDialog } from "../../NewContextComponentDialog";
import { AlertDialog } from "../../AlertDialog";
import { useNotification } from "../../../context/notification.context";
import { getStageTitle, Stage } from "../../../types/stage";
import { ContextComponentList } from "../ContextComponentList";
import { StageGroupSection } from "../StageGroupSection";

interface ContextComponentsProps {
  projectId: number;
  contextComponents: ContextComponentsType | null;
  setContextComponents: React.Dispatch<
    React.SetStateAction<ContextComponentsType | null>
  >;
  showActions?: boolean;
  stage?: Stage;
}

export const ContextComponents: React.FC<ContextComponentsProps> = ({
  projectId,
  contextComponents,
  setContextComponents,
  showActions = false,
  stage,
}) => {
  const { t } = useTranslation("context");
  const { getError } = useNotification();

  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] =
    useState(false);
  const [contextComponentErrors, setContextComponentErrors] =
    useState<ContextComponentErrorsType>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compToDelete, setCompToDelete] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);

  const [selectedEditCompoenent, setSelectedEditCompoenent] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);

  const [groupByStage, setGroupByStage] = useState(false);

  const fetchContextComponents = useCallback(async () => {
    try {
      const contextFromApi = await contextApi.listContextComponents(
        Number(projectId)
      );
      setContextComponents(contextFromApi);
    } catch (err) {
      console.error("Error fetching context components:", err);
    }
  }, [projectId, setContextComponents]);

  useEffect(() => {
    if (!projectId) return;

    fetchContextComponents();
  }, [projectId, fetchContextComponents]);

  const handleCreateContextComponent = () => {
    setNewContextComponentDialogOpen(true);
  };

  const handleCloseNewContextComponentDialog = () => {
    setContextComponentErrors({});
    setNewContextComponentDialogOpen(false);
  };

  const handleNewContextComponentSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      const { id, type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }
      if (selectedEditCompoenent) {
        await contextApi.updateContextComponent(id, type, data, projectId);
      } else {
        await contextApi.createContextComponent(type, data, projectId, stage);
      }

      handleCloseNewContextComponentDialog();
      fetchContextComponents();
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  const confirmEditContextComponent = (
    component: ContextComponent,
    type: ContextComponentType
  ) => {
    setSelectedEditCompoenent({
      component: component,
      type: type,
    });
    setNewContextComponentDialogOpen(true);
  };

  const confirmDeleteContextComponent = (
    component: ContextComponent,
    type: ContextComponentType
  ) => {
    setCompToDelete({ component: component, type: type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (compToDelete) {
      try {
        const response = await contextApi.deleteComponent(
          compToDelete.component.id,
          compToDelete.type
        );
        if (response) {
          fetchContextComponents();
        }
      } catch (error) {
        getError("Failed to delete context component.");
      }
    }
    setDeleteDialogOpen(false);
    setCompToDelete(null);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {showActions && (
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant={groupByStage ? "outlined" : "text"}
              onClick={() => setGroupByStage(!groupByStage)}
              startIcon={
                <TocSharpIcon color={groupByStage ? "primary" : "action"} />
              }
            >
              <Typography
                variant="caption"
                fontWeight={550}
                color={groupByStage ? "primary" : "action"}
              >
                group by stage
              </Typography>
            </Button>
          </Box>
        )}

        <SimpleTreeView>
          {contextComponents ? (
            groupByStage ? (
              <>
                {Object.values(Stage).map((stage) => {
                  const stageComponents = Object.values(contextComponents)
                    .filter(
                      (comp): comp is ContextComponentData<ContextComponent> =>
                        comp !== null &&
                        comp.data.some(
                          (item: ContextComponent) => item.stage === stage
                        )
                    )
                    .map((comp) => ({
                      ...comp,
                      data: comp.data.filter(
                        (item: ContextComponent) => item.stage === stage
                      ),
                    }));

                  if (stageComponents.length === 0) return null;

                  return (
                    <StageGroupSection
                      key={stage}
                      label={t(getStageTitle(stage))}
                      components={stageComponents}
                      prefix={stage}
                      onEdit={confirmEditContextComponent}
                      onDelete={confirmDeleteContextComponent}
                    />
                  );
                })}

                {/* {(() => {
                  const otherComponents = Object.values(contextComponents)
                    .filter(
                      (comp): comp is ContextComponentData<ContextComponent> =>
                        comp !== null &&
                        comp.data.some((item: ContextComponent) => !item.stage)
                    )
                    .map((comp) => ({
                      ...comp,
                      data: comp.data.filter(
                        (item: ContextComponent) => !item.stage
                      ),
                    }));

                  if (otherComponents.length === 0) return null;

                  return (
                    <StageGroupSection
                      label="other"
                      components={otherComponents}
                      onEdit={confirmEditContextComponent}
                      onDelete={confirmDeleteContextComponent}
                    />
                  );
                })()} */}
              </>
            ) : (
              Object.values(contextComponents).map(
                (component, index) =>
                  component && (
                    <ContextComponentList
                      key={`${component.type}`}
                      itemId={`${component.type}`}
                      component={component}
                      onEdit={(comp, type) =>
                        confirmEditContextComponent(comp, type)
                      }
                      onDelete={(comp, type) =>
                        confirmDeleteContextComponent(comp, type)
                      }
                    />
                  )
              )
            )
          ) : (
            <Placeholder
              description={t("context-component-placeholder")}
              linkText={t("identify-component")}
              onClick={handleCreateContextComponent}
            />
          )}
        </SimpleTreeView>
      </Box>

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        projectId={projectId}
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
        isEdit={!!selectedEditCompoenent}
        item={selectedEditCompoenent}
      />

      <AlertDialog
        open={deleteDialogOpen}
        title={t("context:delete-context-component-alert-title", {
          type: t(compToDelete?.type || "context:context-component"),
        })}
        description={
          compToDelete
            ? t("context:delete-context-component-alert-description")
            : ""
        }
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
