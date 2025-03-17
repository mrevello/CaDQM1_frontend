import React, { useRef } from "react";
import { FormDialog, TextFieldConfig } from "../FormDialog";
import { ProblemErrorsType } from "../../types/problem";
import { useTranslation } from "react-i18next";

interface NewProblemDialogProps {
  open: boolean;
  description?: string;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  errors?: ProblemErrorsType;
}

export const NewProblemDialog: React.FC<NewProblemDialogProps> = ({
  open,
  description,
  onClose,
  onSubmit,
  errors,
}) => {
  const { t } = useTranslation(["common", "problem"]);

  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const textFieldConfigs: TextFieldConfig[] = [
    {
      id: "name",
      name: "name",
      label: t("common:name"),
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
      label: t("common:description"),
      defaultValue: description,
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

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={t("problem:problem")}
      dialogContentText={t("problem:identify-problem")}
      textFieldConfigs={textFieldConfigs}
    />
  );
};
