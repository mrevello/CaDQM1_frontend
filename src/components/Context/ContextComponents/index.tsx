import { SimpleTreeView } from '@mui/x-tree-view';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentType,
  ContextComponentsType,
  componentTypeToKey,
  populateContextComponentReferences,
} from '../../../types/contextComponent';
import { Placeholder } from '../../Placeholder';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import TocSharpIcon from '@mui/icons-material/TocSharp';
import { AlertDialog } from '../../AlertDialog';
import { useNotification } from '../../../context/notification.context';
import { getStageTitle, Stage } from '../../../types/stage';
import { ContextComponentList } from '../ContextComponentList';
import { StageGroupSection } from '../StageGroupSection';
import { useContextComponents } from '../../../hooks/useContextComponents';

interface ContextComponentsProps {
  projectId: number;
  showActions?: boolean;
  stage?: Stage;
  onEdit: (component?: ContextComponent, type?: ContextComponentType) => void;
  loading: boolean;
  contextComponents: ContextComponentsType;
  setContextComponents: React.Dispatch<React.SetStateAction<ContextComponentsType>>;
}

export const ContextComponents: React.FC<ContextComponentsProps> = ({
  projectId,
  showActions = false,
  stage,
  onEdit,
  loading,
  contextComponents,
  setContextComponents,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [groupByStage, setGroupByStage] = useState(false);

  const [emptyContextComponents, setEmptyContextComponents] = useState(false);

  const [contextComponentsWithReferences, setContextComponentsWithReferences] =
    useState<ContextComponentsType>(contextComponents);

  useEffect(() => {
    setEmptyContextComponents(Object.values(contextComponents || {}).every(comp => comp == null));

    const contextComponentsWithReferences = populateContextComponentReferences(contextComponents);
    setContextComponentsWithReferences(contextComponentsWithReferences);
  }, [contextComponents]);

  const { deleteContextComponent } = useContextComponents({
    projectId,
    stage,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compToDelete, setCompToDelete] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);

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
        const success = await deleteContextComponent(compToDelete.component.id, compToDelete.type);
        if (success) {
          setDeleteDialogOpen(false);
          setCompToDelete(null);
          // Refresh components after deletion
          setContextComponents(prev => {
            if (!prev) return prev;
            const key = componentTypeToKey[compToDelete.type];
            const newData = prev[key]?.data.filter(d => d.id !== compToDelete.component.id);
            if (!newData) return prev;

            return {
              ...prev,
              [key]: newData.length > 0 ? { ...prev[key], data: newData } : null,
            };
          });
        }
      } catch (error) {
        showError('Failed to delete context component.');
      }
    }
  };

  const setContextComponent =
    <T extends ContextComponent>(
      type: ContextComponentType
    ): React.Dispatch<React.SetStateAction<ContextComponentData<T>>> =>
    updater => {
      setContextComponents(prev => {
        if (!prev) return prev;
        const key = componentTypeToKey[type];
        const slot = prev[key] as ContextComponentData<T> | null;
        if (!slot) return prev;

        const newSlot =
          typeof updater === 'function'
            ? (updater as (old: ContextComponentData<T>) => ContextComponentData<T>)(slot)
            : updater;

        return {
          ...prev,
          [key]: newSlot,
        };
      });
    };

  const handleMoveItem = (
    movedComp: ContextComponent,
    fromType: ContextComponentType,
    toType: ContextComponentType
  ) => {
    setContextComponents(prev => {
      if (!prev) return prev;

      const fromKey = componentTypeToKey[fromType];
      const toKey = componentTypeToKey[toType];

      const src = prev[fromKey];
      const dst = prev[toKey];

      if (!src || !dst) return prev;

      const newSrc = {
        ...src,
        data: src.data.filter(d => d.id !== movedComp.id),
      };

      const newDst = {
        ...dst,
        data: [...dst.data, { ...movedComp, type: toType }],
      };

      return {
        ...prev,
        [fromKey]: newSrc,
        [toKey]: newDst,
      };
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = (component: ContextComponent, type: ContextComponentType) => {
    if (onEdit) {
      onEdit(component, type);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        {showActions && (
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant={groupByStage ? 'outlined' : 'text'}
              onClick={() => setGroupByStage(!groupByStage)}
              startIcon={<TocSharpIcon color={groupByStage ? 'primary' : 'action'} />}
            >
              <Typography
                variant="caption"
                fontWeight={550}
                color={groupByStage ? 'primary' : 'action'}
              >
                {t('group-by-stage')}
              </Typography>
            </Button>
          </Box>
        )}
        <SimpleTreeView>
          {contextComponentsWithReferences && !emptyContextComponents ? (
            groupByStage ? (
              <>
                {Object.values(Stage).map(stage => {
                  const stageComponents = Object.values(contextComponentsWithReferences)
                    .filter(
                      (comp): comp is ContextComponentData<ContextComponent> =>
                        comp !== null &&
                        comp.data.some((item: ContextComponent) => item.stage === stage)
                    )
                    .map(comp => ({
                      ...comp,
                      data: comp.data.filter((item: ContextComponent) => item.stage === stage),
                    }));

                  if (stageComponents.length === 0) return null;

                  return (
                    <StageGroupSection
                      key={stage}
                      label={t(getStageTitle(stage))}
                      components={stageComponents}
                      prefix={stage}
                      onEdit={handleEdit}
                      onDelete={confirmDeleteContextComponent}
                      setContextComponents={setContextComponents}
                      loading={loading}
                    />
                  );
                })}
              </>
            ) : (
              Object.values(contextComponentsWithReferences).map(
                (component, _) =>
                  component && (
                    <ContextComponentList
                      key={`${component.type}`}
                      itemId={`${component.type}`}
                      component={component}
                      onEdit={handleEdit}
                      onDelete={confirmDeleteContextComponent}
                      setContextComponent={setContextComponent(component.type)}
                      onAdd={onEdit}
                      onMove={(moved, fromType) => handleMoveItem(moved, fromType, component.type)}
                      loading={loading}
                    />
                  )
              )
            )
          ) : (
            <Placeholder
              description={t('context-component-placeholder')}
              linkText={t('identify-component')}
              onClick={onEdit}
            />
          )}
        </SimpleTreeView>
      </Box>

      <AlertDialog
        open={deleteDialogOpen}
        title={t('delete-context-component-alert-title', {
          type: t(compToDelete?.type || 'context-component'),
        })}
        description={compToDelete ? t('delete-context-component-alert-description') : ''}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
