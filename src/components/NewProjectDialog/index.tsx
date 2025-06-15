import React, { useRef } from "react";
import { FormDialog, TextFieldConfig } from "../FormDialog";
import { Project, ProjectErrorsType } from "../../types/project";
import { useTranslation } from "react-i18next";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ProjectErrorsType;
  project?: Project | null;
  isEdit?: boolean;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onClose,
  onSubmit,
  errors,
  project = null,
}) => {
  const { t } = useTranslation();

  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "name",
      name: "name",
      label: t("name"),
      defaultValue: project?.name ?? "",
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
      label: t("description"),
      defaultValue: project?.description ?? "",
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

  const dialogTitle = project
    ? t("edit-project")
    : t("new-project");
  const dialogContentText = project ? "" : t("create-project");

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={dialogTitle}
      dialogContentText={dialogContentText}
      textFieldConfigs={textFieldConfigs}
    />
  );
};
