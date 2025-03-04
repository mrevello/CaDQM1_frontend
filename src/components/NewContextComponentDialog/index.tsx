import React, { useState } from "react";
import { FormDialog, TextFieldConfig, SelectOption } from "../FormDialog";
import { ContextComponentType } from "../../types/contextComponent";
import { useTranslation } from "react-i18next";

interface NewContextComponentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
}

export const NewContextComponentDialog: React.FC<
  NewContextComponentDialogProps
> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation();

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
      { id: "description", name: "description", label: "Description" },
    ],
    [ContextComponentType.BUSINESS_RULE]: [
      { id: "statement", name: "statement", label: "Statement" },
      { id: "semantic", name: "semantic", label: "Semantic" },
    ],
    [ContextComponentType.DATA_FILTERING]: [
      { id: "statement", name: "statement", label: "Statement" },
      {
        id: "task_at_hand",
        name: "task_at_hand",
        label: "Task At Hand",
        type: "number",
      },
    ],
    [ContextComponentType.DQ_METADATA]: [
      { id: "path", name: "path", label: "Path" },
      { id: "measurement", name: "measurement", label: "Measurement" },
    ],
    [ContextComponentType.DQ_REQUIREMENT]: [
      { id: "statement", name: "statement", label: "Statement" },
      { id: "description", name: "description", label: "Description" },
      {
        id: "user_type",
        name: "user_type",
        label: "User Type",
      },
    ],
    [ContextComponentType.OTHER_DATA]: [
      { id: "path", name: "path", label: "Path" },
      { id: "owner", name: "owner", label: "Owner" },
    ],
    [ContextComponentType.OTHER_METADATA]: [
      { id: "path", name: "path", label: "Path" },
      { id: "author", name: "author", label: "Author" },
    ],
    [ContextComponentType.SYSTEM_REQUIREMENT]: [
      { id: "statement", name: "statement", label: "Statement" },
      { id: "description", name: "description", label: "Description" },
    ],
    [ContextComponentType.TASK_AT_HAND]: [
      { id: "name", name: "name", label: "Name" },
      { id: "purpose", name: "purpose", label: "Purpose" },
    ],
    [ContextComponentType.USER_TYPE]: [
      { id: "name", name: "name", label: "Name" },
      {
        id: "characteristics",
        name: "characteristics",
        label: "Characteristics",
      },
    ],
  };

  const typeSelectorField: TextFieldConfig = {
    id: "type",
    name: "type",
    label: "Type",
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
        onSubmit(formData);
      }}
      title="New Context Component"
      dialogContentText="Select a type and define the context component details."
      textFieldConfigs={textFieldConfigs}
      onFieldChange={(name, value) => {
        if (name === "type") {
          handleTypeChange(value as ContextComponentType);
        }
      }}
    />
  );
};
