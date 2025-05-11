import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import { contextApi } from "../../api/context.api";
import { reviewApi } from "../../api/review.api";
import {
  ContextComponentErrorsType,
  ContextComponentsType,
} from "../../types/contextComponent";
import { Stage } from "../../types/stage";
import { AddFloatingButton } from "../AddFloatingButton";
import { ContextComponents } from "../Context/ContextComponents";
import { NewContextComponentDialog } from "../NewContextComponentDialog";
import { ReviewType } from "../../types/review";

interface ContextReviewProps {
  label?: string;
  type?: ReviewType;
  projectId: number;
  stage: Stage;
  showReview?: boolean;
}

export const ContextReview: React.FC<ContextReviewProps> = ({
  label,
  type,
  projectId,
  stage,
  showReview = true,
}) => {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [newContextComponentDialogOpen, setNewContextComponentDialogOpen] =
    useState(false);
  const [contextComponentErrors, setContextComponentErrors] =
    useState<ContextComponentErrorsType>({});
  const [contextComponents, setContextComponents] =
    useState<ContextComponentsType | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (type) {
          const review = await reviewApi.getReview(Number(projectId), type);
          if (review) {
            setText(review.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch review:", error);
      }
    };

    type && fetchReview();
  }, [projectId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      // setSelectedText(selection.toString());
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleCreateContextComponent = () => {
    setNewContextComponentDialogOpen(true);
    setShowMenu(false);
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

  // Handle form submission for creating a new context component.
  const handleNewContextComponentSubmit = async (
    formData: Record<string, any>
  ) => {
    try {
      const { type, ...data } = formData;

      if (!type) {
        console.error("No type provided for context component.");
        return;
      }

      // Use stage if provided (for A07) or call without it (for A04)
      let response;
      if (stage) {
        response = await contextApi.createContextComponent(
          type,
          data,
          Number(projectId),
          stage
        );
      } else {
        response = await contextApi.createContextComponent(
          type,
          data,
          Number(projectId)
        );
      }

      if (response) {
        fetchContextComponents();
        // Close the dialog after successful creation.
        handleCloseNewContextComponentDialog();
      }
    } catch (error) {
      console.error("Error creating context component:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
        {showReview && (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="subtitle2" pb={1.5}>
              {label}
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
                rows={20}
              />
              {showMenu && textFieldRef.current && (
                <AddFloatingButton
                  tooltip={t("context:identify-component")}
                  onAdd={handleCreateContextComponent}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Right column: Context components list */}
        <Box display="inline-flex" flexDirection="column" flex={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={1}
            borderColor="divider"
            pb={1}
          >
            <Typography variant="subtitle2">
              {t("context:context-components")}
            </Typography>

            <Button
              startIcon={<Add />}
              onClick={handleCreateContextComponent}
              sx={{ p: 0 }}
            >
              {t("common:new")}
            </Button>
          </Box>

          <Box pt={1}>
            <ContextComponents
              projectId={Number(projectId)}
              contextComponents={contextComponents}
              setContextComponents={setContextComponents}
              {...(stage ? { stage } : {})}
            />
          </Box>
        </Box>
      </Box>

      <NewContextComponentDialog
        open={newContextComponentDialogOpen}
        projectId={projectId}
        onClose={handleCloseNewContextComponentDialog}
        onSubmit={handleNewContextComponentSubmit}
        errors={contextComponentErrors}
      />
    </>
  );
};
