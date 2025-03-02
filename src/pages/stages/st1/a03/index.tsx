import { Box, Tabs, Tab, TextField, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { mockconstContextComponents } from "../../../../types/contextComponent";
import { ContextcomponentItem } from "../../../../components/ContextComponentItem";

export const A03: React.FC = () => {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography variant="subtitle2" sx={{ pt: 1.5, pb: 1.5 }}>
          Organization elements
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          disabled
          value={text}
          multiline
          rows={16}
        />
      </Box>
      <Box sx={{ display: "inline-flex", flexDirection: "column" }}>
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
