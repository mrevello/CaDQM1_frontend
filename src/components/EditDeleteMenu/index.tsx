import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";

interface EditDeleteMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEditClicked: () => void;
  onDeleteClicked: () => void;
}

export const EditDeleteMenu: React.FC<EditDeleteMenuProps> = ({
  anchorEl,
  onClose,
  onEditClicked,
  onDeleteClicked,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={onEditClicked}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>
      <MenuItem onClick={onDeleteClicked}>
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
};
