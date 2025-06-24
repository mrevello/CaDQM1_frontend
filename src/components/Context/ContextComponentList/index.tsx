import { TreeItem } from '@mui/x-tree-view';
import { Box, Button, Card, CardHeader, IconButton } from '@mui/material';
import { TreeViewItemId } from '@mui/x-tree-view';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledCardContent } from '../../../StyledComponents/StyledComponents';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentType,
} from '../../../types/contextComponent';
import { EditDeleteMenu } from '../../EditDeleteMenu';
import { ItemInfo } from '../../ItemInfo';
import { useNotification } from '../../../context/notification.context';
import { LoadingProgress } from '../../LoadingProgress';

interface ContextComponentListProps<T extends ContextComponent> {
  component: ContextComponentData<T>;
  itemId: TreeViewItemId;
  onEdit: (component: ContextComponent, type: ContextComponentType) => void;
  onDelete: (component: ContextComponent, type: ContextComponentType) => void;
  onAdd?: (component: ContextComponent, type: ContextComponentType, isSuggestion: boolean) => void;
  onMove?: (component: ContextComponent, fromType: ContextComponentType) => void;
  setContextComponent: React.Dispatch<React.SetStateAction<ContextComponentData<T>>>;
  loading?: boolean;
}

export const ContextComponentList = <T extends ContextComponent>({
  component,
  itemId,
  onEdit,
  onDelete,
  onAdd,
  onMove,
  setContextComponent,
  loading = false,
}: ContextComponentListProps<T>) => {
  const { t } = useTranslation();
  const { showError } = useNotification();

  const handleDiscardComponent = (contextComponent: ContextComponent) => {
    try {
      setContextComponent(prev => ({
        ...prev,
        data: prev.data.filter(item => item !== contextComponent),
      }));
    } catch (error) {
      showError(String(error));
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLElement>,
    comp: ContextComponent,
    type: ContextComponentType
  ) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        component: comp,
        fromType: type,
      })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    try {
      const { component: droppedComp, fromType } = JSON.parse(raw);

      if (fromType !== component.type) {
        onMove?.(droppedComp, fromType);
      }
    } catch (err) {
      console.error('drop payload parse failed', err);
    }
  };

  if (loading) {
    return <LoadingProgress />;
  }

  return (
    <TreeItem
      itemId={itemId}
      label={t(component.type)}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        '& .MuiTreeItem-label': {
          fontWeight: 500,
          fontSize: 16,
        },
      }}
    >
      <Box display="flex" flexDirection="column" gap={1} m={'8px 0px'}>
        {component.data.map(data => (
          <ContextComponentItem
            key={data.id}
            contextComponent={data}
            type={component.type}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
            onDiscard={handleDiscardComponent}
            onDragStart={(e: React.DragEvent<HTMLElement>) =>
              handleDragStart(e, data, component.type)
            }
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
  onAdd?: (component: ContextComponent, type: ContextComponentType, isSuggestion: boolean) => void;
  onDiscard: (component: ContextComponent, type: ContextComponentType) => void;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
}

const ContextComponentItem: React.FC<ContextComponentItemProps> = ({
  contextComponent,
  type,
  onEdit,
  onDelete,
  onAdd,
  onDiscard,
  onDragStart,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditcomponent = () => {
    onEdit(contextComponent, type);
    handleMenuClose();
  };

  return (
    <Card
      draggable={!!contextComponent.isSuggestion}
      onDragStart={e => onDragStart?.(e)}
      {...(contextComponent.isSuggestion
        ? {
            onClick: handleEditcomponent,
          }
        : {})}
      sx={{
        cursor: contextComponent.isSuggestion ? 'grab' : 'default',
        '&:hover': contextComponent.isSuggestion ? { cursor: 'grab', opacity: 0.9 } : {},
      }}
    >
      {contextComponent.isSuggestion && (
        <CardHeader
          title="Suggestion"
          titleTypographyProps={{ variant: 'caption', fontSize: 12 }}
          sx={{ px: 2, pt: 2, pb: 0 }}
        />
      )}
      <StyledCardContent>
        <Box display="flex" flexDirection="row" gap={1.5} flex={1}>
          {Object.entries(contextComponent).map(([key, value]) => {
            const showItem =
              key !== 'id' &&
              key !== 'stage' &&
              key !== 'isSuggestion' &&
              key !== 'type' &&
              key !== 'task_at_hand' &&
              key !== 'user_type' &&
              key !== 'data_filtering';
            return (
              showItem && (
                <ItemInfo
                  key={key}
                  label={t(key)}
                  info={
                    key === 'taskAtHand' || key === 'userType' || key === 'dataFiltering'
                      ? value?.name || t('no-value')
                      : String(value) || t('no-value')
                  }
                />
              )
            );
          })}
        </Box>
        {contextComponent.isSuggestion ? (
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={e => {
                e.stopPropagation();
                onDiscard(contextComponent, type);
              }}
            >
              {t('discard')}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={e => {
                e.stopPropagation();
                onAdd?.(contextComponent, type, true);
              }}
            >
              {t('add')}
            </Button>
          </Box>
        ) : (
          <>
            <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
              <MoreHorizOutlinedIcon fontSize="small" />
            </IconButton>

            <EditDeleteMenu
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              onEditClicked={handleEditcomponent}
              onDeleteClicked={() => {
                onDelete(contextComponent, type);
                handleMenuClose();
              }}
            />
          </>
        )}
      </StyledCardContent>
    </Card>
  );
};
