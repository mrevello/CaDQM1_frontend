import React, { useState, useEffect } from "react";
import { FormDialog, TextFieldConfig, SelectOption } from "../FormDialog";
import {
  ApplicationDomain,
  BusinessRule,
  ContextComponent,
  ContextComponentErrorsType,
  ContextComponentType,
  DataFiltering,
  DQMetadata,
  DQRequirement,
  OtherData,
  OtherMetadata,
  SystemRequirement,
  TaskAtHand,
  UserType,
} from "../../types/contextComponent";
import { useTranslation } from "react-i18next";
import { contextApi } from "../../api/context.api";

interface NewContextComponentDialogProps {
  open: boolean;
  projectId: number;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ContextComponentErrorsType;
  item?: {
    component: ContextComponent;
    type: ContextComponentType;
  } | null;
  isEdit?: boolean;
}

export const NewContextComponentDialog: React.FC<
  NewContextComponentDialogProps
> = ({ open, projectId, onClose, onSubmit, errors, item, isEdit = false }) => {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState<ContextComponentType>();

  const [taskAtHandOptions, setTaskAtHandOptions] = useState<SelectOption[]>(
    []
  );
  const [userTypeOptions, setUserTypeOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const defaultType = Object.values(ContextComponentType)[0];

    if (isEdit && item && item.component) {
      const initialType = isEdit && item?.type ? item?.type : defaultType;
      setSelectedType(initialType);
    } else {
      setSelectedType(defaultType);
    }
  }, [isEdit, item, projectId]);

  useEffect(() => {
    if (open) {
      contextApi
        .getContextComponentByType(ContextComponentType.TASK_AT_HAND, projectId)
        .then((resp): void => {
          const list = resp?.data;
          if (Array.isArray(list)) {
            const options: SelectOption[] = list.map((item) => {
              const task = item as TaskAtHand;
              return {
                value: task.id.toString(),
                label: task.name,
              };
            });
            setTaskAtHandOptions(options);
          }
        })
        .catch(console.error);

      contextApi
        .getContextComponentByType(ContextComponentType.USER_TYPE, projectId)
        .then((resp): void => {
          const list = resp?.data;
          if (list && Array.isArray(list)) {
            const options: SelectOption[] = list.map((item) => {
              const userType = item as UserType;
              return {
                value: userType.id.toString(),
                label: userType.name,
              };
            });
            setUserTypeOptions(options);
          } else {
            console.warn("unexpected payload", resp);
          }
        })
        .catch(console.error);
    }
  }, [open, projectId]);

  const taskAtHandDropdownOptions: SelectOption[] = [
    ...taskAtHandOptions,
    {
      value: "__add_task_at_hand__",
      label: t("add-task-at-hand"),
      isAddOption: true,
    },
  ];

  const userTypeDropdownOptions: SelectOption[] = [
    ...userTypeOptions,
    {
      value: "__add_user_type__",
      label: t("add-user-type"),
      isAddOption: true,
    },
  ];

  const typeOptions: SelectOption[] = Object.values(ContextComponentType).map(
    (type) => ({
      value: type,
      label: t(type),
    })
  );

  const typeFields: Partial<Record<ContextComponentType, TextFieldConfig[]>> = {
    [ContextComponentType.APPLICATION_DOMAIN]: [
      {
        id: "description",
        name: "description",
        label: t("description"),
        defaultValue: (item?.component as ApplicationDomain)?.description || "",
      },
    ],
    [ContextComponentType.BUSINESS_RULE]: [
      {
        id: "statement",
        name: "statement",
        label: t("statement"),
        defaultValue: (item?.component as BusinessRule)?.statement || "",
      },
      {
        id: "semantic",
        name: "semantic",
        label: t("semantic"),
        defaultValue: (item?.component as BusinessRule)?.semantic || "",
      },
    ],
    [ContextComponentType.DATA_FILTERING]: [
      {
        id: "statement",
        name: "statement",
        label: t("statement"),
        defaultValue: (item?.component as DataFiltering)?.statement || "",
      },
      {
        id: "task_at_hand",
        name: "task_at_hand",
        label: t("task_at_hand"),
        type: "select",
        options: taskAtHandDropdownOptions,
        defaultValue: (item?.component as DataFiltering)?.task_at_hand || "",
      },
    ],
    [ContextComponentType.DQ_METADATA]: [
      {
        id: "path",
        name: "path",
        label: t("path"),
        defaultValue: (item?.component as DQMetadata)?.path || "",
      },
      {
        id: "measurement",
        name: "measurement",
        label: t("measurement"),
        defaultValue: (item?.component as DQMetadata)?.measurement || "",
      },
    ],
    [ContextComponentType.DQ_REQUIREMENT]: [
      {
        id: "statement",
        name: "statement",
        label: t("statement"),
        defaultValue: (item?.component as DQRequirement)?.statement || "",
      },
      {
        id: "description",
        name: "description",
        label: t("description"),
        defaultValue: (item?.component as DQRequirement)?.description || "",
      },
      {
        id: "user_type",
        name: "user_type",
        label: t("user_type"),
        type: "select",
        options: userTypeDropdownOptions,
        defaultValue: (item?.component as DQRequirement)?.user_type || "",
      },
    ],
    [ContextComponentType.OTHER_DATA]: [
      {
        id: "path",
        name: "path",
        label: t("path"),
        defaultValue: (item?.component as OtherData)?.path || "",
      },
      {
        id: "owner",
        name: "owner",
        label: t("owner"),
        defaultValue: (item?.component as OtherData)?.owner || "",
      },
      {
        id: "description",
        name: "description",
        label: t("description"),
        defaultValue: (item?.component as OtherData)?.description || "",
      },
    ],
    [ContextComponentType.OTHER_METADATA]: [
      {
        id: "path",
        name: "path",
        label: t("path"),
        defaultValue: (item?.component as OtherMetadata)?.path || "",
      },
      {
        id: "description",
        name: "description",
        label: t("description"),
        defaultValue: (item?.component as OtherMetadata)?.description || "",
      },
      {
        id: "author",
        name: "author",
        label: t("author"),
        defaultValue: (item?.component as OtherMetadata)?.author || "",
      },
    ],
    [ContextComponentType.SYSTEM_REQUIREMENT]: [
      {
        id: "statement",
        name: "statement",
        label: t("statement"),
        defaultValue: (item?.component as SystemRequirement)?.statement || "",
      },
      {
        id: "description",
        name: "description",
        label: t("description"),
        defaultValue: (item?.component as SystemRequirement)?.description || "",
      },
    ],
    [ContextComponentType.TASK_AT_HAND]: [
      {
        id: "name",
        name: "name",
        label: t("name"),
        defaultValue: (item?.component as TaskAtHand)?.name || "",
      },
      {
        id: "purpose",
        name: "purpose",
        label: t("purpose"),
        defaultValue: (item?.component as TaskAtHand)?.purpose || "",
      },
    ],
    [ContextComponentType.USER_TYPE]: [
      {
        id: "name",
        name: "name",
        label: t("name"),
        defaultValue: (item?.component as UserType)?.name || "",
      },
      {
        id: "characteristics",
        name: "characteristics",
        label: t("characteristics"),
        defaultValue: (item?.component as UserType)?.characteristics || "",
      },
    ],
  };

  const typeSelectorField: TextFieldConfig = {
    id: "type",
    name: "type",
    type: "select",
    options: typeOptions,
    defaultValue: selectedType,
  };

  const textFieldConfigs: TextFieldConfig[] = [
    typeSelectorField,
    ...(selectedType ? typeFields[selectedType] || [] : []),
  ];

  const handleTypeChange = (value: ContextComponentType) => {
    setSelectedType(value);
  };

  const title = isEdit
    ? t("edit-context-component")
    : t("context-component");
  const dialogContentText = isEdit
    ? t("edit-context-component-description")
    : t("new-context-component-description");

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={(formData) => {
        onSubmit({ ...formData, type: selectedType, id: item?.component.id });
      }}
      title={title}
      dialogContentText={dialogContentText}
      textFieldConfigs={textFieldConfigs}
      onFieldChange={(name, value) => {
        if (name === "type") {
          handleTypeChange(value as ContextComponentType);
        }

        if (name === "task_at_hand" && value === "__add_task_at_hand__") {
          handleTypeChange(ContextComponentType.TASK_AT_HAND);
        }

        if (name === "user_type" && value === "__add_user_type__") {
          handleTypeChange(ContextComponentType.USER_TYPE);
        }
      }}
    />
  );
};
