import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ContextcomponentItem } from "../../../../components/ContextComponentItem";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { mockProblems, ProblemErrorsType } from "../../../../types/problem";
import { ProblemItem } from "../../../../components/ProblemItem";
import { NewProblemDialog } from "../../../../components/NewProblemDialog";
import { NewContextComponentDialog } from "../../../../components/NewContextComponentDialog";
import { ContextComponents } from "../../../../utils/mockData";
import { useHeaderButtons } from "../../../../context/headerButtons.context";

export const A03: React.FC = () => {
  const { t } = useTranslation();
  const { setButtons } = useHeaderButtons();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    setButtons(
      //   <SpeedDial
      //   ariaLabel="SpeedDial actions"
      //   icon={<MoreVertOutlinedIcon />}
      //   direction="down"
      //   FabProps={{ size: "small" }}
      // >
      //   <SpeedDialAction
      //     key="contextComponent"
      //     icon={<AddOutlinedIcon fontSize="small" />}
      //     tooltipTitle="Identify Context Component"
      //     onClick={handleCreateContextComponent}
      //   />
      //   <SpeedDialAction
      //     key="dqProblem"
      //     icon={<PriorityHighOutlinedIcon fontSize="small" />}
      //     tooltipTitle="Identify DQ Problem"
      //     onClick={handleCreateProblem}
      //   />
      // </SpeedDial>
      <IconButton onClick={handleMenu}>
        <MoreVertOutlinedIcon />
      </IconButton>
    );

    return () => setButtons(null);
  }, [setButtons]);

  const [text, setText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  const [tabValue, setTabValue] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [newProblemDialogOpen, setNewProblemDialogOpen] = useState(false);
  const [problemErrors, setProblemErrors] = useState<ProblemErrorsType>({});

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
    console.log("Identify Context Component for:", selectedText);
    setShowMenu(false);
  };

  const handleCreateProblem = () => {
    setNewProblemDialogOpen(true);
    console.log("Identify Problem for:", selectedText);
    setShowMenu(false);
  };

  const handleCloseNewProblemDialog = () => {
    setProblemErrors({});
    setNewProblemDialogOpen(false);
  };

  const handleNewProblemSubmit = async (formData: Record<string, any>) => {
    try {
      //   await ProjectValidate.validate(formData);
      //   setProjectErrors({});
      //   await projects.createProject({
      //     name: formData.name,
      //     description: formData.description,
      //   });
      //   handleCloseNewDialog();
      //   await fetchProjects();
    } catch (error) {
      // if (error instanceof yup.ValidationError) {
      //   // Set form errors
      //   setProjectErrors({ name: error.errors[0] });
      // } else {
      //   getError(t("home:error-creating-project", { error }));
      // }
    }
  };

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
              <SimpleTreeView>
                {Object.values(ContextComponents).map(
                  (component, index) =>
                    component && (
                      <ContextcomponentItem
                        key={index}
                        component={component}
                        onDelete={() => {}}
                      />
                    )
                )}
              </SimpleTreeView>
            )}

            {tabValue === 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  m: 1.5,
                }}
              >
                {Object.values(mockProblems).map((problem, index) => (
                  <>
                    <ProblemItem
                      key={index}
                      problem={problem}
                      onDelete={(problemId) => {}}
                    />
                    <Divider />
                  </>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <NewProblemDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        errors={problemErrors}
      />

      <NewContextComponentDialog
        open={newProblemDialogOpen}
        onClose={handleCloseNewProblemDialog}
        onSubmit={handleNewProblemSubmit}
        // errors={contextComponentErrors}
      />

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right", // or 'left' depending on your button alignment
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right", // match this to the anchor's horizontal setting
        }}
      >
        <MenuItem onClick={handleCreateContextComponent}>
          <ListItemIcon>
            <AddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Identify Context component" />
        </MenuItem>
        <MenuItem onClick={handleCreateProblem}>
          <ListItemIcon>
            <PriorityHighOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Identify DQ problem" />
        </MenuItem>
      </Menu>
    </>
  );
};
