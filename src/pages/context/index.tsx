import { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ContextComponent,
  ContextComponentErrorsType,
  ContextComponentType,
  ContextComponentsType,
  emptyContextComponentsType,
} from '../../types/contextComponent';
import { Box, Fab, Tooltip, Typography } from '@mui/material';
import { projectsApi } from '../../api/projects.api';
import { Project } from '../../types/project';
import { ContextComponents } from '../../components/Context/ContextComponents';
import { Add } from '@mui/icons-material';
import { NewContextComponentDialog } from '../../components/Context/NewContextComponentDialog';
import { useContextComponents } from '../../hooks/useContextComponents';
import { ContextComponentValidators } from '../../utils/validateContextComponent';

export const Context: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const [contextComponents, setContextComponents] = useState<ContextComponentsType>(
    emptyContextComponentsType
  );

  const [project, setProject] = useState<Project | null>(null);

  const [loadingContextComponents, setLoadingContextComponents] = useState(false);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [contextComponentErrors, setContextComponentErrors] = useState({});
  const [selectedEditComponent, setSelectedEditComponent] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);

  const { createContextComponent, updateContextComponent, listContextComponents } =
    useContextComponents({ projectId: Number(projectId) });

  // Use useRef to store the latest functions to avoid dependency issues
  const functionsRef = useRef({
    createContextComponent,
    updateContextComponent,
    listContextComponents,
  });

  // Update ref when functions change
  useEffect(() => {
    functionsRef.current = {
      createContextComponent,
      updateContextComponent,
      listContextComponents,
    };
  }, [createContextComponent, updateContextComponent, listContextComponents]);

  const fetchAndUpdate = useCallback(async () => {
    try {
      setLoadingContextComponents(true);
      const project = await projectsApi.getProject(Number(projectId));
      if (!project) {
        console.warn('No project data returned');
        return;
      }
      setProject(project);
      const contextComponents = await functionsRef.current.listContextComponents();
      setContextComponents(contextComponents);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoadingContextComponents(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAndUpdate();
  }, [fetchAndUpdate]);

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

      let success;
      if (
        selectedEditComponent &&
        selectedEditComponent.component &&
        !selectedEditComponent.component.isSuggestion
      ) {
        success = await functionsRef.current.updateContextComponent(
          selectedEditComponent.component.id,
          selectedEditComponent.type,
          formData
        );
      } else {
        success = await functionsRef.current.createContextComponent(type, formData);
      }

      if (success) {
        setNewDialogOpen(false);
        await fetchAndUpdate();
        return true;
      }
      return 'Error creating context component';
    } catch (error: any) {
      console.log('error', error);
      console.log('error.inner', error.inner);
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

  const handleEditContextComponent = (
    component?: ContextComponent,
    type?: ContextComponentType
  ) => {
    setContextComponentErrors({});
    if (!component || !type) {
      setSelectedEditComponent(null);
      setNewDialogOpen(true);
      return;
    }

    setSelectedEditComponent({ component, type });
    setNewDialogOpen(true);
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
        <Typography variant="h6">{t('context')}</Typography>
        {project?.context && (
          <Typography variant="caption">
            {t('version')} {project.context.version}
          </Typography>
        )}

        <ContextComponents
          projectId={Number(projectId)}
          contextComponents={contextComponents}
          setContextComponents={setContextComponents}
          onEdit={handleEditContextComponent}
          loading={loadingContextComponents}
          showActions={true}
        />

        <Tooltip title={t('new')} placement="left">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setNewDialogOpen(true)}
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>

      <NewContextComponentDialog
        open={newDialogOpen}
        projectId={Number(projectId)}
        item={selectedEditComponent}
        isEdit={!!selectedEditComponent}
        onClose={() => setNewDialogOpen(false)}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
      />
    </>
  );
};
