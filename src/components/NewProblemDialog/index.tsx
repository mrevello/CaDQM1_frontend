import React, { useRef } from "react";
import { FormDialog, TextFieldConfig } from "../FormDialog";
import { ProblemErrorsType, Problem } from "../../types/problem";
import { useTranslation } from "react-i18next";

interface NewProblemDialogProps {
  open: boolean;
  description?: string;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ProblemErrorsType;
  problem?: Problem | null;
}

export const NewProblemDialog: React.FC<NewProblemDialogProps> = ({
  open,
  description,
  onClose,
  onSubmit,
  errors,
  problem = null,
}) => {
  const { t } = useTranslation();

  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "description",
      name: "description",
      label: t("description"),
      defaultValue: problem?.description ?? description,
      multiline: true,
      rows: 3,
      error: !!errors?.description,
      helperText: errors?.description,
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

  const dialogTitle = problem
    ? t("edit-problem")
    : t("problem");
  const dialogContentText = problem
    ? t("edit-problem-description")
    : t("identify-problem");

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
