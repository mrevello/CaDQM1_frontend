import React, { useState } from "react";
import { FormDialog, TextFieldConfig, SelectOption } from "../FormDialog";
import {
  ContextComponentErrorsType,
  ContextComponentType,
} from "../../types/contextComponent";
import { useTranslation } from "react-i18next";

interface NewContextComponentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ContextComponentErrorsType;
}

export const NewContextComponentDialog: React.FC<
  NewContextComponentDialogProps
> = ({ open, onClose, onSubmit, errors }) => {
  const { t } = useTranslation(["common", "context"]);

  const [selectedType, setSelectedType] = useState<ContextComponentType>(
    Object.values(ContextComponentType)[0]
  );

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
        label: t("context:description"),
      },
    ],
    [ContextComponentType.BUSINESS_RULE]: [
      { id: "statement", name: "statement", label: t("context:statement") },
      { id: "semantic", name: "semantic", label: t("context:semantic") },
    ],
    [ContextComponentType.DATA_FILTERING]: [
      { id: "statement", name: "statement", label: t("context:statement") },
      {
        id: "task_at_hand",
        name: "task_at_hand",
        label: t("context:task_at_hand"),
        type: "number",
      },
    ],
    [ContextComponentType.DQ_METADATA]: [
      { id: "path", name: "path", label: t("context:path") },
      {
        id: "measurement",
        name: "measurement",
        label: t("context:measurement"),
      },
    ],
    [ContextComponentType.DQ_REQUIREMENT]: [
      { id: "statement", name: "statement", label: t("context:statement") },
      {
        id: "description",
        name: "description",
        label: t("context:description"),
      },
      {
        id: "user_type",
        name: "user_type",
        label: t("context:user_type"),
      },
    ],
    [ContextComponentType.OTHER_DATA]: [
      { id: "path", name: "path", label: t("context:path") },
      { id: "owner", name: "owner", label: t("context:owner") },
    ],
    [ContextComponentType.OTHER_METADATA]: [
      { id: "path", name: "path", label: t("context:path") },
      { id: "author", name: "author", label: t("context:author") },
    ],
    [ContextComponentType.SYSTEM_REQUIREMENT]: [
      { id: "statement", name: "statement", label: t("context:statement") },
      {
        id: "description",
        name: "description",
        label: t("context:description"),
      },
    ],
    [ContextComponentType.TASK_AT_HAND]: [
      { id: "name", name: "name", label: t("context:name") },
      { id: "purpose", name: "purpose", label: t("context:purpose") },
    ],
    [ContextComponentType.USER_TYPE]: [
      { id: "name", name: "name", label: t("context:name") },
      {
        id: "characteristics",
        name: "characteristics",
        label: t("context:characteristics"),
      },
    ],
  };

  const typeSelectorField: TextFieldConfig = {
    id: "type",
    name: "type",
    label: t("common:type"),
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

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={(formData) => {
        onSubmit({ ...formData, type: selectedType });
      }}
      title={t("context:context-component")}
      dialogContentText={t("context:new-context-component-description")}
      textFieldConfigs={textFieldConfigs}
      onFieldChange={(name, value) => {
        if (name === "type") {
          handleTypeChange(value as ContextComponentType);
        }
      }}
    />
  );
};
