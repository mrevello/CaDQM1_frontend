import { TreeItem } from "@mui/x-tree-view";
import { Box, Card, IconButton } from "@mui/material";
import { TreeViewItemId } from "@mui/x-tree-view";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledCardContent } from "../../../StyledComponents/StyledComponents";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentType,
} from "../../../types/contextComponent";
import { EditDeleteMenu } from "../../EditDeleteMenu";
import { ItemInfo } from "../../ItemInfo";

interface ContextComponentListProps<T extends ContextComponent> {
  component: ContextComponentData<T>;
  itemId: TreeViewItemId;
  onEdit: (component: ContextComponent, type: ContextComponentType) => void;
  onDelete: (component: ContextComponent, type: ContextComponentType) => void;
}

export const ContextComponentList = <T extends ContextComponent>({
  component,
  itemId,
  onEdit,
  onDelete,
}: ContextComponentListProps<T>) => {
  const { t } = useTranslation();

  return (
    <TreeItem
      itemId={itemId}
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
          <ContextComponentItem
            key={data.id}
            contextComponent={data}
            type={component.type}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
    </TreeItem>
  );
};

interface ContextComponentItemProps {
  contextComponent: ContextComponent;
  type: ContextComponentType;
  onEdit: (component: ContextComponent, type: ContextComponentType) => void;
  onDelete: (component: ContextComponent, type: ContextComponentType) => void;
}

const ContextComponentItem: React.FC<ContextComponentItemProps> = ({
  contextComponent,
  type,
  onEdit,
  onDelete,
}) => {
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
          {Object.entries(contextComponent).map(([key, value], index) => {
            const showItem = key !== "id" && key !== "stage";
            return (
              showItem && (
                <ItemInfo
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  info={String(value)}
                />
              )
            );
          })}
        </Box>
        <>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>

          <EditDeleteMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onEditClicked={() => {
              onEdit(contextComponent, type);
              handleMenuClose();
            }}
            onDeleteClicked={() => {
              onDelete(contextComponent, type);
              handleMenuClose();
            }}
          />
        </>
      </StyledCardContent>
    </Card>
  );
};
