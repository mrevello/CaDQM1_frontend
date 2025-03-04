import React from "react";
import { FormDialog, TextFieldConfig } from "../FormDialog";
import { ProblemErrorsType } from "../../types/problem";

interface NewProblemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ProblemErrorsType;
}

export const NewProblemDialog: React.FC<NewProblemDialogProps> = ({
  open,
  onClose,
  onSubmit,
  errors,
}) => {
  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "name",
      name: "name",
      label: "Name",
      // labelText: "Name",
      error: !!errors?.name,
      helperText: errors?.name,
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      // labelText: "Description",
      multiline: true,
      rows: 3,
    },
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Problem"
      dialogContentText="Identify DQ problem"
      textFieldConfigs={textFieldConfigs}
    />
  );
};
