import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ProblemErrorsType, Problem } from "../../../../types/problem";
import { ProblemItem } from "../../../../components/ProblemItem";
import { NewProblemDialog } from "../../../../components/NewProblemDialog";
import { NewContextComponentDialog } from "../../../../components/NewContextComponentDialog";
import {
  ContextComponentErrorsType,
  ContextComponentsType,
} from "../../../../types/contextComponent";
import { Placeholder } from "../../../../components/Placeholder";
import { ProblemBody, problemsApi } from "../../../../api/problem.api";
import { ProblemValidate } from "../../../../utils/validateForm";
import { useNotification } from "../../../../context/notification.context";
import * as yup from "yup";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { ContextComponents } from "../../../../components/ContextComponents";
import { reviewApi } from "../../../../api/review.api";
import { contextApi } from "../../../../api/context.api";

export const A03A04: React.FC = () => {
  const { t } = useTranslation();
  const { getError } = useNotification();
  const [loading, setLoading] = useState(true);

  const { projectId } = useParams<{ projectId: string }>();

  const [text, setText] = useState("Texto de prueba");
  const [tabValue, setTabValue] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] =
    useState(false);
  const [contextComponentErrors, setContextComponentErrors] =
    useState<ContextComponentErrorsType>({});

  const [problemList, setProblemList] = useState<Problem[]>([]);
  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const review = await reviewApi.getReview(
          Number(projectId),
          "organization_elements"
        );
        if (review) {
          setText(review.data);
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProblems = async () => {
      try {
        const problemsFromApi = await problemsApi.listProblems(
          Number(projectId)
        );
        setProblemList(problemsFromApi ?? []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [projectId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleCreateContextComponent = () => {
    setNewContextComponentDialogOpen(true);
    setShowMenu(false);
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
        name: formData.name,
        description: formData.description,
        project_id: Number(projectId),
      };

      const createdProblem = await problemsApi.createProblem(newProblemData);
      if (createdProblem) {
        setProblemList((prev) => [...prev, createdProblem]);
      }
      handleCloseNewProblemDialog();
    } catch (error) {
      console.log("error", error);
      if (error instanceof yup.ValidationError) {
        setProblemErrors({ name: error.errors[0] });
      } else {
        getError(String(error));
        handleCloseNewProblemDialog();
      }
    }
  };

  const handleCloseNewContextComponentDialog = () => {
    setContextComponentErrors({});
    setNewContextComponentDialogOpen(false);
  };

  const fetchContextComponents = async () => {
    try {
      const contextFromApi = await contextApi.listContextComponents(
        Number(projectId)
      );
      setContextComponents(contextFromApi);
    } catch (err) {
      console.error("Error fetching context components:", err);
    }
  };

  const handleNewContextComponentSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      const { type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }

      const response = await contextApi.createContextComponent(
        type,
        data,
        Number(projectId)
      );

      if (response) {
        fetchContextComponents();
        handleCloseNewContextComponentDialog(); // Close dialog after success
      }
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    fetchContextComponents();
  }, [projectId]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 2 }}>
          <Typography variant="subtitle2" sx={{ pt: 1.5, pb: 1.5 }}>
            Organization elements
          </Typography>

          <Box
            ref={textFieldRef}
            sx={{ position: "relative" }}
            onMouseUp={handleTextSelection}
          >
            <TextField
              fullWidth
              variant="outlined"
              value={text}
              multiline
              rows={16}
            />
            {showMenu && textFieldRef.current && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "-20px",
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  borderRadius: 6,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 1000,
                  gap: 0.5,
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Tooltip title="Identify Context Component" placement="left">
                  <IconButton onClick={handleCreateContextComponent}>
                    <AddOutlinedIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Identify Problem" placement="left">
                  <IconButton onClick={handleCreateProblem}>
                    <PriorityHighOutlinedIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "inline-flex", flexDirection: "column", flex: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              sx={{ display: "flex" }}
            >
              <Tab
                label={t("context-components")}
                sx={{
                  textTransform: "none",
                  flex: 1,
                  minWidth: 120,
                  whiteSpace: "nowrap",
                }}
              />
              <Tab
                label={t("problems")}
                sx={{
                  textTransform: "none",
                  flex: 1,
                  minWidth: 120,
                  whiteSpace: "nowrap",
                }}
              />
            </Tabs>
          </Box>

          <Box sx={{ pt: 1 }}>
            {tabValue === 0 && (
              <ContextComponents
                projectId={Number(projectId)}
                showNew={true}
                contextComponents={contextComponents}
                onCreate={handleCreateContextComponent}
              />
            )}

            {tabValue === 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {problemList.length > 0 && (
                  <Box display="flex" justifyContent="flex-end">
                    <Button startIcon={<Add />} onClick={handleCreateProblem}>
                      New
                    </Button>
                  </Box>
                )}

                {problemList.length > 0 ? (
                  problemList.map((problem, index) => (
                    <ProblemItem
                      key={index}
                      problem={problem}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />
                  ))
                ) : (
                  <Placeholder
                    description={t("No problems identified yet.")}
                    linkText={t("Identify problem")}
                    onClick={handleCreateProblem}
                  />
                )}
              </Box>
            )}
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

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
      />
    </>
  );
};
