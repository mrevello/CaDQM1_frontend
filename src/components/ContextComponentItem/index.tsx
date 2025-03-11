import { TreeItem } from "@mui/x-tree-view";
import {
  Divider,
  Typography,
  Box,
  IconButton,
  Card,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ContextComponent,
  ContextComponentData,
} from "../../types/contextComponent";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface ContextcomponentItemProps<T extends ContextComponent> {
  component: ContextComponentData<T>;
  onDelete: (item: T) => void;
}

export const ContextcomponentItem = <T extends ContextComponent>({
  component,
  onDelete,
}: ContextcomponentItemProps<T>) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TreeItem itemId={component.type} label={t(component.type)}>
      <Box pl={1} pr={1} gap={1.5}>
        {component.data.map((data) => (
          <Card
            key={data.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: "transparent",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // gap: 1,
                // mt: 1.5,
                // mb: 1.5,
              }}
            >
              {Object.entries(data).map(
                ([key, value], index) =>
                  index > 0 && (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography key={key} variant="body2" sx={{ flex: 1 }}>
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>{" "}
                        {String(value)}
                      </Typography>
                      {index === 1 && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(data)}
                          sx={{ p: 0 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )
              )}
            </Box>
            {/* <Divider /> */}
          </Card>
        ))}
      </Box>
    </TreeItem>
  );
};
