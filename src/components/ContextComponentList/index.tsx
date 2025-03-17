import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentErrorsType,
  ContextComponentsType,
} from "../../types/contextComponent";
import { Placeholder } from "../Placeholder";
import { useTheme } from "@emotion/react";
import { Box, Button, Card, IconButton } from "@mui/material";
import { StyledCardContent } from "../../StyledComponents/StyledComponents";
import { EditDeleteMenu } from "../EditDeleteMenu";
import { ItemInfo } from "../ItemInfo";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Add } from "@mui/icons-material";
import { contextApi } from "../../api/context.api";
import { NewContextComponentDialog } from "../NewContextComponentDialog";

interface ContextComponentListProps<T extends ContextComponent> {
  component: ContextComponentData<T>;
  onDelete: (item: T) => void;
}

interface ContextComponentItemProps {
  contextComponent: ContextComponent;
}

interface ContextComponentsProps {
  projectId: number;
  showNew?: boolean;
  contextComponents: ContextComponentsType | null;
  setContextComponents: React.Dispatch<
    React.SetStateAction<ContextComponentsType | null>
  >;
}

export const ContextComponents: React.FC<ContextComponentsProps> = ({
  projectId,
  showNew = false,
  contextComponents,
  setContextComponents,
  // onCreate,
}) => {
  const { t } = useTranslation();

  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] =
    useState(false);
  const [contextComponentErrors, setContextComponentErrors] =
    useState<ContextComponentErrorsType>({});

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

  useEffect(() => {
    if (!projectId) return;

    fetchContextComponents();
  }, [projectId]);

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
      const { type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }

      const response = await contextApi.createContextComponent(
        type,
        data,
        projectId
      );

      if (response) {
        handleCloseNewContextComponentDialog();
        fetchContextComponents();
      }
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {showNew && (
          <Box display="flex" justifyContent="flex-end">
            <Button startIcon={<Add />} onClick={handleCreateContextComponent}>
              {t("new")}
            </Button>
          </Box>
        )}
        <SimpleTreeView>
          {contextComponents ? (
            Object.values(contextComponents).map(
              (component, index) =>
                component && (
                  <ContextComponentList
                    key={index}
                    component={component}
                    onDelete={() => {}}
                  />
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
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
      />
    </>
  );
};

const ContextComponentList = <T extends ContextComponent>({
  component,
  onDelete,
}: ContextComponentListProps<T>) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <TreeItem
      itemId={component.type}
      label={t(component.type)}
      sx={{
        "& .MuiTreeItem-label": {
          fontWeight: 500,
          fontSize: 16,
        },
      }}
    >
      <Box display="flex" flexDirection="column" gap={1} m={"8px 0px"}>
        {component.data.map((data) => (
          <ContextComponentItem key={data.id} contextComponent={data} />
        ))}
      </Box>
    </TreeItem>
  );
};

const ContextComponentItem: React.FC<ContextComponentItemProps> = ({
  contextComponent,
}) => {
  const { t } = useTranslation();
  console.log("context component ", contextComponent);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <StyledCardContent>
        <Box display="flex" flexDirection="row" gap={1.5} flex={1}>
          {Object.entries(contextComponent).map(
            ([key, value], index) =>
              index > 0 && (
                <ItemInfo
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  info={String(value)}
                />
              )
          )}
        </Box>
        <>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>

          <EditDeleteMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onEditClicked={() => {
              // onUpdate(problem.id);
              handleMenuClose();
            }}
            onDeleteClicked={() => {
              // onDelete(problem.id);
              handleMenuClose();
            }}
          />
        </>
      </StyledCardContent>
    </Card>
  );
};
