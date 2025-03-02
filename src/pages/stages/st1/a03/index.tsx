import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { mockconstContextComponents } from "../../../../types/contextComponent";
import { ContextcomponentItem } from "../../../../components/ContextComponentItem";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const A03: React.FC = () => {
  const { t } = useTranslation();

  const [text, setText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  const [tabValue, setTabValue] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      setShowSpeedDial(true);
    } else {
      setShowSpeedDial(false);
    }
  };

  const handleCreateContextComponent = () => {
    console.log("Create Context Component for:", selectedText);
    setShowSpeedDial(false);
  };

  const handleCreateProblem = () => {
    console.log("Create Problem for:", selectedText);
    setShowSpeedDial(false);
  };

  return (
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
          {showSpeedDial && textFieldRef.current && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: "-30px",
                transform: "translateY(-50%)",
                zIndex: 1000,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <SpeedDial
                ariaLabel="Selection Actions"
                icon={<AddOutlinedIcon />}
                direction="down"
              >
                <SpeedDialAction
                  icon={<AddOutlinedIcon />}
                  tooltipTitle="Identify Context Component"
                  onClick={handleCreateContextComponent}
                />
                <SpeedDialAction
                  icon={<PriorityHighOutlinedIcon />}
                  tooltipTitle="Identify Problem"
                  onClick={handleCreateProblem}
                />
              </SpeedDial>
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
              {Object.values(mockconstContextComponents).map(
                (component, index) => (
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
            <Box>
              <Typography variant="h6">Problems</Typography>
              <Typography>No problems listed yet.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
