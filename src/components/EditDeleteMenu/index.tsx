import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

interface EditDeleteMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEditClicked: (event: React.MouseEvent<HTMLElement>) => void;
  onDeleteClicked: (event: React.MouseEvent<HTMLElement>) => void;
}

export const EditDeleteMenu: React.FC<EditDeleteMenuProps> = ({
  anchorEl,
  onClose,
  onEditClicked,
  onDeleteClicked,
}) => {
  const { t } = useTranslation();

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
      <MenuItem onClick={(event) => onEditClicked(event)}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        {t("edit")}
      </MenuItem>
      <MenuItem onClick={(event) => onDeleteClicked(event)}>
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        {t("delete")}
      </MenuItem>
    </Menu>
  );
};
