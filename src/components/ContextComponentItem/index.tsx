import { TreeItem } from "@mui/x-tree-view";
import { Divider, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ContextComponent,
  ContextComponentData,
} from "../../types/contextComponent";
import { useTranslation } from "react-i18next";

interface ContextcomponentItemProps<T extends ContextComponent> {
  component: ContextComponentData<T>;
  onDelete: (item: T) => void;
}

export const ContextcomponentItem = <T extends ContextComponent>({
  component,
  onDelete,
}: ContextcomponentItemProps<T>) => {
  const { t } = useTranslation();
  return (
    <TreeItem itemId={component.title} label={t(component.title)}>
      <Box sx={{ pl: 1, pr: 1 }}>
        {component.data.map((data) => (
          <Box key={data.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 1.5,
                mb: 1.5,
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
            <Divider />
          </Box>
        ))}
      </Box>
    </TreeItem>
  );
};
