import { TreeItem } from "@mui/x-tree-view";
import { Divider, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContextComponentData } from "../../types/contextComponent";

interface ContextcomponentItemProps<T> {
  component: ContextComponentData<T>;
  onDelete: (item: any) => void;
}

export const ContextcomponentItem = <T extends object>({
  component,
  onDelete,
}: ContextcomponentItemProps<T>) => {
  return (
    <TreeItem itemId={component.title} label={component.title}>
      <Box sx={{ pl: 1, pr: 1 }}>
        {component.data.map((data, itemIndex) => (
          <Box key={itemIndex}>
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
