import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import {
  ContextComponent,
  ContextComponentErrorsType,
  ContextComponentType,
  TaskAtHand,
  UserType,
} from '../../../types/contextComponent';
import { FormDialog, SelectOption, TextFieldConfig } from '../../FormDialog';
import { contextApi } from '../../../api/context.api';
import {
  ApplicationDomain,
  BusinessRule,
  DataFiltering,
  DQMetadata,
  DQRequirement,
  OtherData,
  OtherMetadata,
  SystemRequirement,
} from '../../../types/contextComponent';
import { useNotification } from '../../../context/notification.context';

interface NewContextComponentDialogProps {
  open: boolean;
  projectId: number;
  errors: ContextComponentErrorsType;
  item?: {
    component: ContextComponent;
    type: ContextComponentType;
  } | null;
  isEdit?: boolean;
  onClose: () => void;
  onSubmit: (type: ContextComponentType, formData: Record<string, any>) => void;
}

export const NewContextComponentDialog: React.FC<NewContextComponentDialogProps> = ({
  open,
  projectId,
  errors,
  item,
  isEdit = false,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();

  const [selectedType, setSelectedType] = useState<ContextComponentType>();
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const [taskAtHandOptions, setTaskAtHandOptions] = useState<SelectOption[]>([]);
  const [userTypeOptions, setUserTypeOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const defaultType = Object.values(ContextComponentType)[0];

    if (isEdit && item && item.component) {
      const initialType = isEdit && item?.type ? item?.type : defaultType;
      setSelectedType(initialType);
      // Initialize form values with item data
      if (item.component) {
        setFormValues(item.component);
      }
    } else {
      setSelectedType(defaultType);
      setFormValues({});
    }
  }, [isEdit, item, projectId]);

  useEffect(() => {
    if (open) {
      Promise.all([
        contextApi
          .getContextComponentByType(ContextComponentType.TASK_AT_HAND, projectId)
          .then((resp): void => {
            const list = resp?.data;
            if (Array.isArray(list)) {
              const options: SelectOption[] = list.map(item => {
                const task = item as TaskAtHand;
                return {
                  value: task.id.toString(),
                  label: task.name,
                };
              });
              setTaskAtHandOptions(options);
            }
          })
          .catch(error => {
            console.error('Error fetching task at hand options:', error);
            showError('Error loading task at hand options');
          }),

        contextApi
          .getContextComponentByType(ContextComponentType.USER_TYPE, projectId)
          .then((resp): void => {
            const list = resp?.data;
            if (list && Array.isArray(list)) {
              const options: SelectOption[] = list.map(item => {
                const userType = item as UserType;
                return {
                  value: userType.id.toString(),
                  label: userType.name,
                };
              });
              setUserTypeOptions(options);
            } else {
              console.warn('unexpected payload', resp);
            }
          })
          .catch(error => {
            console.error('Error fetching user type options:', error);
            showError('Error loading user type options');
          }),
      ]);
    }
  }, [open, projectId, showError]);

  useEffect(() => {
    if (!open) {
      const defaultType = Object.values(ContextComponentType)[0];
      setSelectedType(defaultType);
      setFormValues({});
    }
  }, [open]);

  const taskAtHandDropdownOptions: SelectOption[] = [
    ...taskAtHandOptions,
    {
      value: '__add_task_at_hand__',
      label: t('add-task-at-hand'),
      isAddOption: true,
    },
  ];

  const userTypeDropdownOptions: SelectOption[] = [
    ...userTypeOptions,
    {
      value: '__add_user_type__',
      label: t('add-user-type'),
      isAddOption: true,
    },
  ];

  const typeOptions: SelectOption[] = Object.values(ContextComponentType).map(type => ({
    value: type,
    label: t(type),
  }));

  const typeFields: Partial<Record<ContextComponentType, TextFieldConfig[]>> = {
    [ContextComponentType.APPLICATION_DOMAIN]: [
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as ApplicationDomain)?.description || '',
        error: !!errors[ContextComponentType.APPLICATION_DOMAIN]?.description,
        helperText: errors[ContextComponentType.APPLICATION_DOMAIN]?.description,
      },
    ],
    [ContextComponentType.BUSINESS_RULE]: [
      {
        id: 'statement',
        name: 'statement',
        label: t('statement'),
        defaultValue: (item?.component as BusinessRule)?.statement || '',
        error: !!errors[ContextComponentType.BUSINESS_RULE]?.statement,
        helperText: errors[ContextComponentType.BUSINESS_RULE]?.statement,
      },
      {
        id: 'semantic',
        name: 'semantic',
        label: t('semantic'),
        defaultValue: (item?.component as BusinessRule)?.semantic || '',
        error: !!errors[ContextComponentType.BUSINESS_RULE]?.semantic,
        helperText: errors[ContextComponentType.BUSINESS_RULE]?.semantic,
      },
    ],
    [ContextComponentType.DATA_FILTERING]: [
      {
        id: 'statement',
        name: 'statement',
        label: t('statement'),
        defaultValue: (item?.component as DataFiltering)?.statement || '',
        error: !!errors[ContextComponentType.DATA_FILTERING]?.statement,
        helperText: errors[ContextComponentType.DATA_FILTERING]?.statement,
      },
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as DataFiltering)?.description || '',
        error: !!errors[ContextComponentType.DATA_FILTERING]?.description,
        helperText: errors[ContextComponentType.DATA_FILTERING]?.description,
      },
      {
        id: 'task_at_hand',
        name: 'task_at_hand',
        label: t('task_at_hand'),
        type: 'select',
        options: taskAtHandDropdownOptions,
        defaultValue: (item?.component as DataFiltering)?.task_at_hand || '',
        error: !!errors[ContextComponentType.DATA_FILTERING]?.task_at_hand,
        helperText: errors[ContextComponentType.DATA_FILTERING]?.task_at_hand,
      },
    ],
    [ContextComponentType.DQ_METADATA]: [
      {
        id: 'path',
        name: 'path',
        label: t('path'),
        defaultValue: (item?.component as DQMetadata)?.path || '',
        error: !!errors[ContextComponentType.DQ_METADATA]?.path,
        helperText: errors[ContextComponentType.DQ_METADATA]?.path,
      },
      {
        id: 'measurement',
        name: 'measurement',
        label: t('measurement'),
        defaultValue: (item?.component as DQMetadata)?.measurement || '',
        error: !!errors[ContextComponentType.DQ_METADATA]?.measurement,
        helperText: errors[ContextComponentType.DQ_METADATA]?.measurement,
      },
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as DQMetadata)?.description || '',
        error: !!errors[ContextComponentType.DQ_METADATA]?.description,
        helperText: errors[ContextComponentType.DQ_METADATA]?.description,
      },
    ],
    [ContextComponentType.DQ_REQUIREMENT]: [
      {
        id: 'statement',
        name: 'statement',
        label: t('statement'),
        defaultValue: (item?.component as DQRequirement)?.statement || '',
        error: !!errors[ContextComponentType.DQ_REQUIREMENT]?.statement,
        helperText: errors[ContextComponentType.DQ_REQUIREMENT]?.statement,
      },
      {
        id: 'semantic',
        name: 'semantic',
        label: t('semantic'),
        defaultValue: (item?.component as DQRequirement)?.semantic || '',
        error: !!errors[ContextComponentType.DQ_REQUIREMENT]?.semantic,
        helperText: errors[ContextComponentType.DQ_REQUIREMENT]?.semantic,
      },
      {
        id: 'user_type',
        name: 'user_type',
        label: t('user_type'),
        type: 'select',
        options: userTypeDropdownOptions,
        defaultValue: (item?.component as DQRequirement)?.user_type || '',
        error: !!errors[ContextComponentType.DQ_REQUIREMENT]?.user_type,
        helperText: errors[ContextComponentType.DQ_REQUIREMENT]?.user_type,
      },
    ],
    [ContextComponentType.OTHER_DATA]: [
      {
        id: 'path',
        name: 'path',
        label: t('path'),
        defaultValue: (item?.component as OtherData)?.path || '',
        error: !!errors[ContextComponentType.OTHER_DATA]?.path,
        helperText: errors[ContextComponentType.OTHER_DATA]?.path,
      },
      {
        id: 'owner',
        name: 'owner',
        label: t('owner'),
        defaultValue: (item?.component as OtherData)?.owner || '',
        error: !!errors[ContextComponentType.OTHER_DATA]?.owner,
        helperText: errors[ContextComponentType.OTHER_DATA]?.owner,
      },
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as OtherData)?.description || '',
        error: !!errors[ContextComponentType.OTHER_DATA]?.description,
        helperText: errors[ContextComponentType.OTHER_DATA]?.description,
      },
    ],
    [ContextComponentType.OTHER_METADATA]: [
      {
        id: 'path',
        name: 'path',
        label: t('path'),
        defaultValue: (item?.component as OtherMetadata)?.path || '',
        error: !!errors[ContextComponentType.OTHER_METADATA]?.path,
        helperText: errors[ContextComponentType.OTHER_METADATA]?.path,
      },
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as OtherMetadata)?.description || '',
        error: !!errors[ContextComponentType.OTHER_METADATA]?.description,
        helperText: errors[ContextComponentType.OTHER_METADATA]?.description,
      },
      {
        id: 'author',
        name: 'author',
        label: t('author'),
        defaultValue: (item?.component as OtherMetadata)?.author || '',
        error: !!errors[ContextComponentType.OTHER_METADATA]?.author,
        helperText: errors[ContextComponentType.OTHER_METADATA]?.author,
      },
    ],
    [ContextComponentType.SYSTEM_REQUIREMENT]: [
      {
        id: 'statement',
        name: 'statement',
        label: t('statement'),
        defaultValue: (item?.component as SystemRequirement)?.statement || '',
        error: !!errors[ContextComponentType.SYSTEM_REQUIREMENT]?.statement,
        helperText: errors[ContextComponentType.SYSTEM_REQUIREMENT]?.statement,
      },
      {
        id: 'description',
        name: 'description',
        label: t('description'),
        defaultValue: (item?.component as SystemRequirement)?.description || '',
        error: !!errors[ContextComponentType.SYSTEM_REQUIREMENT]?.description,
        helperText: errors[ContextComponentType.SYSTEM_REQUIREMENT]?.description,
      },
    ],
    [ContextComponentType.TASK_AT_HAND]: [
      {
        id: 'name',
        name: 'name',
        label: t('name'),
        defaultValue: (item?.component as TaskAtHand)?.name || '',
        error: !!errors[ContextComponentType.TASK_AT_HAND]?.name,
        helperText: errors[ContextComponentType.TASK_AT_HAND]?.name,
      },
      {
        id: 'purpose',
        name: 'purpose',
        label: t('purpose'),
        defaultValue: (item?.component as TaskAtHand)?.purpose || '',
        error: !!errors[ContextComponentType.TASK_AT_HAND]?.purpose,
        helperText: errors[ContextComponentType.TASK_AT_HAND]?.purpose,
      },
    ],
    [ContextComponentType.USER_TYPE]: [
      {
        id: 'name',
        name: 'name',
        label: t('name'),
        defaultValue: (item?.component as UserType)?.name || '',
        error: !!errors[ContextComponentType.USER_TYPE]?.name,
        helperText: errors[ContextComponentType.USER_TYPE]?.name,
      },
      {
        id: 'characteristics',
        name: 'characteristics',
        label: t('characteristics'),
        defaultValue: (item?.component as UserType)?.characteristics || '',
        error: !!errors[ContextComponentType.USER_TYPE]?.characteristics,
        helperText: errors[ContextComponentType.USER_TYPE]?.characteristics,
      },
    ],
  };

  const handleTypeChange = (value: ContextComponentType) => {
    setSelectedType(value);
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'task_at_hand' && value === '__add_task_at_hand__') {
      handleTypeChange(ContextComponentType.TASK_AT_HAND);
    }

    if (name === 'user_type' && value === '__add_user_type__') {
      handleTypeChange(ContextComponentType.USER_TYPE);
    }
  };

  const getFieldConfigs = (type: ContextComponentType): TextFieldConfig[] => {
    const baseConfigs = typeFields[type] || [];
    return baseConfigs.map(config => ({
      ...config,
      defaultValue: formValues[config.name] || config.defaultValue || '',
    }));
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? t('edit-context-component') : t('new-context-component')}
      onClose={onClose}
      onSubmit={formData =>
        onSubmit(selectedType || ContextComponentType.APPLICATION_DOMAIN, formData)
      }
      textFieldConfigs={selectedType ? getFieldConfigs(selectedType) : []}
      onFieldChange={handleFieldChange}
      typeOptions={typeOptions}
      typeValue={selectedType}
      onTypeChange={handleTypeChange}
    />
  );
};
