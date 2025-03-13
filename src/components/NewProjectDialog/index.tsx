import React, { useRef } from "react";
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
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "name",
      name: "name",
      label: "Name",
      error: !!errors?.name,
      helperText: errors?.name,
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          descriptionRef.current?.focus();
        }
      },
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      multiline: true,
      rows: 3,
      inputRef: descriptionRef,
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const form = (event.currentTarget as HTMLInputElement).form;
          if (form) {
            form.requestSubmit();
          }
        }
      },
    },
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="New project"
      dialogContentText="Create a new project"
      textFieldConfigs={textFieldConfigs}
    />
  );
};
