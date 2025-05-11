import { Box, IconButton, Tooltip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface AddFloatingButtonProps {
  tooltip: string;
  onAdd: () => void;
}

export const AddFloatingButton: React.FC<AddFloatingButtonProps> = ({
  tooltip,
  onAdd,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="absolute"
      top="50%"
      right="-20px"
      borderRadius={6}
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.2)"
      zIndex={1000}
      gap={0.5}
      sx={{
        backgroundColor: "white",
        transform: "translateY(-50%)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Tooltip title={tooltip} placement="left">
        <IconButton onClick={onAdd}>
          <AddOutlinedIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
