import { useState } from "react";
import { IconButton, useTheme, Card } from "@mui/material";
import { Problem } from "../../types/problem";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { StyledCardContent } from "../../StyledComponents/StyledComponents";
import { ItemInfo } from "../ItemInfo";
import { EditDeleteMenu } from "../EditDeleteMenu";

interface ProblemItemProps {
  problem: Problem;
  onUpdate: (itemId: number) => void;
  onDelete: (itemId: number) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  onUpdate,
  onDelete,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    // <Card
    //   onMouseEnter={() => setIsHovered(true)}
    //   onMouseLeave={() => setIsHovered(false)}
    //   sx={{
    //     background: "transparent",
    //     borderLeft: `4px solid ${theme.palette.info.main}`,
    //   }}
    // >
    //   <CardContent
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       gap: 2,
    //     }}
    //   >
    //     <Box flex={1}>
    //       <Typography variant="subtitle1" fontWeight="bold" fontSize="14px">
    //         {problem.name}
    //       </Typography>
    //       <Tooltip title={problem.description} placement="bottom-start">
    //         <Typography variant="body2" color="text.secondary">
    //           {problem.description}
    //         </Typography>
    //       </Tooltip>
    //     </Box>
    //     {isHovered && (
    //       <>
    //         <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
    //           <MoreHorizOutlinedIcon fontSize="small" />
    //         </IconButton>
    //         <Menu
    //           anchorEl={anchorEl}
    //           open={Boolean(anchorEl)}
    //           onClose={handleMenuClose}
    //           anchorOrigin={{
    //             vertical: "bottom",
    //             horizontal: "center",
    //           }}
    //           transformOrigin={{
    //             vertical: "top",
    //             horizontal: "right",
    //           }}
    //           sx={{ p: 2 }}
    //         >
    //           <MenuItem
    //             onClick={() => {
    //               onUpdate(problem.id);
    //               handleMenuClose();
    //             }}
    //           >
    //             <ListItemIcon>
    //               <EditIcon fontSize="small" />
    //             </ListItemIcon>
    //             Edit
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => {
    //               onDelete(problem.id);
    //               handleMenuClose();
    //             }}
    //           >
    //             <ListItemIcon>
    //               <Delete fontSize="small" />
    //             </ListItemIcon>
    //             Delete
    //           </MenuItem>
    //         </Menu>
    //       </>
    //     )}
    //   </CardContent>
    // </Card>
    <Card
      sx={{
        background: "transparent",
        borderLeft: `4px solid ${theme.palette.info.main}`,
      }}
    >
      <StyledCardContent>
        <ItemInfo label={problem.name} info={problem.description} />

        <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>

        <EditDeleteMenu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          onEditClicked={() => {
            onUpdate(problem.id);
            handleMenuClose();
          }}
          onDeleteClicked={() => {
            onDelete(problem.id);
            handleMenuClose();
          }}
        />
      </StyledCardContent>
    </Card>
  );
};
