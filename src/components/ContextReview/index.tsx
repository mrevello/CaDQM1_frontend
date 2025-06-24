import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, Sync } from '@mui/icons-material';
import { Stage } from '../../types/stage';
import { ContextComponents } from '../Context/ContextComponents';
import { ReviewType } from '../../types/review';
import { ReviewComponent } from '../Review';
import { NewContextComponentDialog } from '../Context/NewContextComponentDialog';
import { useContextComponents } from '../../hooks/useContextComponents';
import {
  ContextComponentsType,
  ContextComponent,
  ContextComponentType,
  componentTypeToKey,
  emptyContextComponentsType,
  mergeAllComponents,
} from '../../types/contextComponent';
import { useNotification } from '../../context/notification.context';
import { ContextComponentValidators } from '../../utils/validateContextComponent';
import { ContextComponentErrorsType } from '../../types/contextComponent';

interface ContextReviewProps {
  label?: string;
  type?: ReviewType;
  projectId: number;
  stage: Stage;
  showReview?: boolean;
}

export const ContextReview: React.FC<ContextReviewProps> = ({
  label,
  type,
  projectId,
  stage,
  showReview = true,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();

  const [contextComponents, setContextComponents] = useState<ContextComponentsType>(
    emptyContextComponentsType
  );

  const [loadingContext, setLoadingContext] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] = useState(false);
  const [contextComponentErrors, setContextComponentErrors] = useState({});
  const [selectedEditComponent, setSelectedEditComponent] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);

  const {
    listContextComponents,
    getContextComponentsAnalysis,
    createContextComponent,
    updateContextComponent,
  } = useContextComponents({ projectId, stage, type });

  const fetchContextComponents = useCallback(async () => {
    try {
      setLoadingContext(true);
      const response = await listContextComponents();
      setContextComponents(response);
    } catch (error) {
      showError('Failed to fetch context components');
    } finally {
      setLoadingContext(false);
    }
  }, [listContextComponents, showError]);

  const removeSuggestedComponents = useCallback(() => {
    setContextComponents(prev => {
      if (!prev) return emptyContextComponentsType;

      const cleanedComponents: ContextComponentsType = { ...emptyContextComponentsType };

      Object.keys(prev).forEach(key => {
        const componentType = key as keyof ContextComponentsType;
        const componentData = prev[componentType];

        if (componentData && componentData.data) {
          const filteredData = componentData.data.filter(component => !component.isSuggestion);

          cleanedComponents[componentType] = {
            type: componentData.type,
            data: filteredData as any,
          };
        }
      });

      return cleanedComponents;
    });
  }, []);

  const fetchAnalysis = useCallback(async () => {
    if (!type) return;
    try {
      setLoadingAnalysis(true);
      removeSuggestedComponents();

      const response = await getContextComponentsAnalysis();

      if (response) {
        setContextComponents(prev => {
          if (!prev) return response;
          return mergeAllComponents(prev, response);
        });
      }
    } catch (error) {
      showError('Failed to fetch analysis');
    } finally {
      setLoadingAnalysis(false);
    }
  }, [getContextComponentsAnalysis, removeSuggestedComponents, showError, type]);

  useEffect(() => {
    fetchContextComponents();
  }, [fetchContextComponents]);

  const handleCloseNewContextComponentDialog = () => {
    setContextComponentErrors({});
    setSelectedEditComponent(null);
    setNewContextComponentDialogOpen(false);
  };

  const handleEditContextComponent = (
    component?: ContextComponent,
    type?: ContextComponentType
  ) => {
    setContextComponentErrors({});
    if (!component || !type) {
      setSelectedEditComponent(null);
      setNewContextComponentDialogOpen(true);
      return;
    }

    setSelectedEditComponent({ component, type });
    setNewContextComponentDialogOpen(true);
  };

  const handleNewContextComponentSubmit = async (
    type: ContextComponentType,
    formData: Record<string, any>
  ) => {
    try {
      const validator = ContextComponentValidators[type];
      if (!validator) {
        throw new Error(`No validator found for component type: ${type}`);
      }

      await validator.validate(formData, { abortEarly: false });

      let component: ContextComponent | null = null;
      if (
        selectedEditComponent &&
        selectedEditComponent.component &&
        !selectedEditComponent.component.isSuggestion
      ) {
        component = await updateContextComponent(
          selectedEditComponent.component.id,
          selectedEditComponent.type,
          formData
        );
      } else {
        component = await createContextComponent(type, formData);
      }

      if (component) {
        setNewContextComponentDialogOpen(false);
        if (selectedEditComponent && selectedEditComponent.component) {
          setContextComponents(prev => {
            if (!prev) return emptyContextComponentsType;
            const currentData = prev[componentTypeToKey[type]]?.data || [];
            const filteredData = currentData.filter(
              item => item.id !== selectedEditComponent.component.id
            );
            return {
              ...prev,
              [componentTypeToKey[type]]: {
                type,
                data: [...filteredData, component],
              },
            };
          });
        } else {
          setContextComponents(prev => {
            if (!prev) return emptyContextComponentsType;
            const currentData = prev[componentTypeToKey[type]]?.data || [];

            return {
              ...prev,
              [componentTypeToKey[type]]: {
                type,
                data: [...currentData, component],
              },
            };
          });
        }
      }
      return 'Error creating context component';
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: { [key: string]: string } = {};

        error.inner.forEach((err: any) => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setContextComponentErrors({ [type]: validationErrors } as ContextComponentErrorsType);
      }
      return 'Error creating context component';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        {showReview && label && type && (
          <ReviewComponent label={label} type={type} projectId={projectId} />
        )}

        <Box display="inline-flex" flexDirection="column" flex={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="divider"
            pb={1}
          >
            <Typography variant="subtitle2">{t('context-components')}</Typography>

            <Box display="flex" flexDirection="row" gap={2}>
              <Button
                startIcon={<Add />}
                onClick={() => handleEditContextComponent()}
                sx={{ p: 0 }}
              >
                {t('new')}
              </Button>

              {type && (
                <Tooltip title={t('suggest-context-components-with-ai')}>
                  <Button startIcon={<Sync />} onClick={fetchAnalysis} sx={{ p: 0 }}>
                    {t('suggest-with-ai')}
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box pt={1}>
            <ContextComponents
              projectId={Number(projectId)}
              contextComponents={contextComponents}
              setContextComponents={setContextComponents}
              {...(stage ? { stage } : {})}
              loading={loadingContext || loadingAnalysis}
              onEdit={handleEditContextComponent}
            />
          </Box>
        </Box>
      </Box>

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        projectId={projectId}
        onClose={handleCloseNewContextComponentDialog}
        errors={contextComponentErrors}
        isEdit={!!selectedEditComponent}
        item={selectedEditComponent}
        onSubmit={handleNewContextComponentSubmit}
      />
    </>
  );
};
