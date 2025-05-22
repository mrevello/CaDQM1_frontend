import { Add } from "@mui/icons-material";
import { Box, TextField, Typography, Button } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProblemBody, problemsApi } from "../../api/problem.api";
import { reviewApi } from "../../api/review.api";
import { useNotification } from "../../context/notification.context";
import { ProblemErrorsType, Problem } from "../../types/problem";
import { ProblemValidate } from "../../utils/validateForm";
import { AddFloatingButton } from "../AddFloatingButton";
import { NewProblemDialog } from "../NewProblemDialog";
import { ProblemList } from "../ProblemList";
import * as yup from "yup";
import { ReviewType } from "../../types/review";
import { UploadedFilesList } from "../UploadedFilesList";
import { FileItem } from "../FileUploader";

export interface DQPRoblemsIdentificationProps {
  label: string;
  type: ReviewType;
  projectId: number;
  showReview?: boolean;
}

export const DQPRoblemsIdentification: React.FC<
  DQPRoblemsIdentificationProps
> = ({ label, type, projectId, showReview = true }) => {
  const { t } = useTranslation(["common", "problem"]);
  const { getError } = useNotification();

  const [review, setReview] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);

  const [selectedText, setSelectedText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

  const [problemList, setProblemList] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const review = await reviewApi.getReview(Number(projectId), type);
        if (review) {
          setReview(review.data);
        }

        // get files
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
      }
    };

    fetchReview();
  }, [projectId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleCreateProblem = () => {
    setNewProblemDialogOpen(true);
    setShowMenu(false);
  };

  const handleCloseNewProblemDialog = () => {
    setProblemErrors({});
    setNewProblemDialogOpen(false);
    setSelectedText("");
  };

  const handleNewProblemSubmit = async (formData: Record<string, any>) => {
    try {
      await ProblemValidate.validate(formData);
      setProblemErrors({});
      const newProblemData: ProblemBody = {
        description: formData.description,
        project_id: Number(projectId),
      };

      const createdProblem = await problemsApi.createProblem(newProblemData);
      if (createdProblem) {
        setProblemList((prev) => [...prev, createdProblem]);
      }
      handleCloseNewProblemDialog();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setProblemErrors({ description: error.errors[0] });
      } else {
        getError(String(error));
        handleCloseNewProblemDialog();
      }
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
        {showReview && (
          <Box display="flex" flexDirection="column" flex={1} gap={1}>
            <Typography variant="subtitle2" pb={1.5}>
              {label}
            </Typography>

            <Box
              ref={textFieldRef}
              sx={{ position: "relative" }}
              onMouseUp={handleTextSelection}
            >
              {review && (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={review}
                  multiline
                  maxRows={20}
                />
              )}
              {showMenu && textFieldRef.current && (
                <AddFloatingButton
                  tooltip={t("problem:identify-problem")}
                  onAdd={handleCreateProblem}
                />
              )}
            </Box>

            <UploadedFilesList fileItems={files} />
          </Box>
        )}
        <Box display="inline-flex" flexDirection="column" flex={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="divider"
            pb={1}
          >
            <Typography variant="subtitle2">{t("problem:problems")}</Typography>

            <Button
              startIcon={<Add />}
              onClick={handleCreateProblem}
              sx={{ p: 0 }}
            >
              {t("common:new")}
            </Button>
          </Box>

          <Box pt={1}>
            <ProblemList
              projectId={Number(projectId)}
              problems={problemList}
              setProblems={setProblemList}
            />
          </Box>
        </Box>
      </Box>

      <NewProblemDialog
        open={newProblemDialogOpen}
        description={selectedText}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
      />
    </>
  );
};
