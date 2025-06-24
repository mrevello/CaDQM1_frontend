import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Stage } from '../../../types/stage';
import { GenericDialog } from '../../Dialog';
import { ContextComponents } from '../ContextComponents';
import {
  ContextComponent,
  ContextComponentErrorsType,
  ContextComponentsType,
  ContextComponentType,
  emptyContextComponentsType,
} from '../../../types/contextComponent';
import { NewContextComponentDialog } from '../NewContextComponentDialog';
import { useContextComponents } from '../../../hooks/useContextComponents';
import { useNotification } from '../../../context/notification.context';
import { ContextComponentValidators } from '../../../utils/validateContextComponent';

interface ContextComponentDialogProps {
  projectId: number;
  version?: string;
  stage: Stage;
  open: boolean;
  onClose: () => void;
}

export const ContextDialog: React.FC<ContextComponentDialogProps> = ({
  projectId,
  version,
  stage,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();

  const [loading, setLoading] = useState(false);
  const [contextComponents, setContextComponents] = useState<ContextComponentsType>(
    emptyContextComponentsType
  );
  const [contextComponentErrors, setContextComponentErrors] = useState({});
  const [selectedEditComponent, setSelectedEditComponent] = useState<{
    component: ContextComponent;
    type: ContextComponentType;
  } | null>(null);
  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] = useState(false);

  const { createContextComponent, updateContextComponent, listContextComponents } =
    useContextComponents({ projectId, stage });

  const handleOpenInNewTab = () => {
    window.open(`/projects/${projectId}/context`, '_blank');
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

  const handleCloseNewContextComponentDialog = () => {
    setContextComponentErrors({});
    setSelectedEditComponent(null);
    setNewContextComponentDialogOpen(false);
  };

  const fetchContextComponents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await listContextComponents();
      setContextComponents(response);
    } catch (error) {
      showError('Failed to fetch context components');
    } finally {
      setLoading(false);
    }
  }, [listContextComponents, showError]);

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
        success = await updateContextComponent(
          selectedEditComponent.component.id,
          selectedEditComponent.type,
          formData
        );
      } else {
        success = await createContextComponent(type, formData);
      }

      if (success) {
        setNewContextComponentDialogOpen(false);
        await fetchContextComponents();
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

  useEffect(() => {
    if (open) {
      fetchContextComponents();
    }
  }, [open, fetchContextComponents]);

  return (
    <>
      <GenericDialog
        open={open}
        onClose={onClose}
        title={t('context')}
        subtitle={version && `version ${version}`}
        content={
          <ContextComponents
            projectId={projectId}
            contextComponents={contextComponents}
            setContextComponents={setContextComponents}
            showActions={true}
            stage={stage}
            loading={loading}
            onEdit={handleEditContextComponent}
          />
        }
        maxWidth="lg"
        minHeight={500}
        additionalTitleButtons={
          <Tooltip title="Open in a new tab">
            <IconButton onClick={handleOpenInNewTab} sx={{ p: 0, mr: 1 }}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
        isEdit={!!selectedEditComponent}
        item={selectedEditComponent}
        projectId={projectId}
      />
    </>
  );
};
