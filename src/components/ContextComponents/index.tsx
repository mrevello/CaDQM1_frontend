import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { contextApi } from "../../api/context.api";
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentsType,
  emptyContextComponentsType,
} from "../../types/contextComponent";
import { Placeholder } from "../Placeholder";
import { useTheme } from "@emotion/react";
import { Box, Button, Card, IconButton } from "@mui/material";
import { StyledCardContent } from "../../StyledComponents/StyledComponents";
import { EditDeleteMenu } from "../EditDeleteMenu";
import { ItemInfo } from "../ItemInfo";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Add } from "@mui/icons-material";

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
  onCreate: () => void;
}

export const ContextComponents: React.FC<ContextComponentsProps> = ({
  projectId,
  showNew = false,
  onCreate,
}) => {
  const { t } = useTranslation();

  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType>(emptyContextComponentsType);

  useEffect(() => {
    console.log("project id", projectId);
    if (!projectId) return;

    const fetchProblems = async () => {
      try {
        const contextFromApi =
          await contextApi.listContextComponents(projectId);
        console.log("context components", contextFromApi);
        setContextComponents(contextFromApi ?? []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [projectId]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {showNew && (
          <Box display="flex" justifyContent="flex-end">
            <Button startIcon={<Add />} onClick={onCreate}>
              New
            </Button>
          </Box>
        )}
        <SimpleTreeView>
          {Object.values(contextComponents).length > 0 ? (
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
              description={t("No context components identified yet.")}
              linkText={t("Identify component")}
              onClick={onCreate}
            />
          )}
        </SimpleTreeView>
      </Box>
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
        // "& .MuiTreeItem-content": {
        //   padding: "12px 4px",
        // },
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
