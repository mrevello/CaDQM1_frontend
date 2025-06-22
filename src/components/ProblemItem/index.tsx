import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
  Box,
  Button,
  Card,
  CardHeader,
  ClickAwayListener,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledCardContent } from '../../StyledComponents/StyledComponents';
import { Problem } from '../../types/problem';
import { EditDeleteMenu } from '../EditDeleteMenu';

interface ProblemItemProps {
  problem: Problem;
  onUpdate: (problem: Problem) => void;
  onDelete: (problem: Problem) => void;
  onAddSuggestion: (problem: Problem, description: string) => void;
  onDiscard?: (problem: Problem) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  onUpdate,
  onDelete,
  onAddSuggestion,
  onDiscard,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(problem.description);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDescriptionClick = () => {
    if (problem.isSuggestion) {
      setIsEditing(true);
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleBlurOrEnter = () => {
    setIsEditing(false);
    onAddSuggestion(problem, description);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlurOrEnter();
    }
  };

  const handleClickAway = () => {
    setIsEditing(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Card
        sx={{
          borderLeft: `4px solid ${theme.palette.info.main}`,
        }}
      >
        {problem.isSuggestion && (
          <CardHeader
            title="Suggestion"
            titleTypographyProps={{ variant: 'caption', fontSize: 12 }}
            sx={{ px: 2, pt: 2, pb: 0 }}
          />
        )}
        <StyledCardContent>
          {isEditing ? (
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
              multiline
              inputProps={{ sx: { fontSize: 14 } }}
            />
          ) : (
            <Tooltip title={description} placement="bottom-start">
              <Typography
                variant="body2"
                fontSize={14}
                flex={1}
                onClick={handleDescriptionClick}
                sx={{
                  cursor: problem.isSuggestion ? 'pointer' : 'default',
                }}
              >
                {description}
              </Typography>
            </Tooltip>
          )}
          {problem.isSuggestion && onDiscard ? (
            <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1}>
              <Button size="small" variant="outlined" onClick={() => onDiscard(problem)}>
                {t('discard')}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onAddSuggestion(problem, description)}
              >
                {t('add')}
              </Button>
            </Box>
          ) : (
            <>
              <IconButton size="small" onClick={handleMenuOpen} sx={{ p: 0 }}>
                <MoreHorizOutlinedIcon fontSize="small" />
              </IconButton>

              <EditDeleteMenu
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                onEditClicked={() => {
                  onUpdate(problem);
                  handleMenuClose();
                }}
                onDeleteClicked={() => {
                  onDelete(problem);
                  handleMenuClose();
                }}
              />
            </>
          )}
        </StyledCardContent>
      </Card>
    </ClickAwayListener>
  );
};
