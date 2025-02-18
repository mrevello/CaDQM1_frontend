import React from "react";
import { FormDialog, TextFieldConfig } from "../FormDialog";
import { ProjectErrorsType } from "../../types/project";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ProjectErrorsType;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onClose,
  onSubmit,
  errors,
}) => {
  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "name",
      name: "name",
      label: "Project Name",
      error: !!errors?.name,
      helperText: errors?.name,
    },
    {
      id: "description",
      name: "description",
      label: "Project Description",
      multiline: true,
      rows: 3,
    },
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="New project"
      textFieldConfigs={textFieldConfigs}
    />
  );
};
