import React from 'react';
import {
  IconButton,
  Typography,
  LinearProgress,
  Box,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  UploadFileOutlined,
  ErrorOutline,
  CheckCircleRounded,
  Close,
  Download,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export type UploadStatus = 'loading' | 'complete' | 'error';

interface FileUploadItemProps {
  fileName: string;
  fileSize?: string;
  description?: string;
  status: UploadStatus;
  errorMessage?: string;
  onDelete?: () => void;
  onDownload?: () => void;
  progress?: number;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  fileName,
  fileSize = '',
  description,
  status,
  errorMessage,
  onDelete,
  onDownload,
  progress,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      gap={3}
      border={1}
      borderRadius={1}
      sx={theme => ({
        borderColor: status === 'error' ? theme.palette.error.main : 'divider',
      })}
    >
      <UploadFileOutlined color="primary" sx={{ ml: 1 }} />

      <Box flex={1} minWidth={0} gap={0.5} display="flex" flexDirection="column">
        <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fileName}
        </Typography>

        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}

        {status === 'error' ? (
          <Box display="flex" gap={1}>
            <Typography fontSize={14} fontWeight="bold" color="error.main">
              {t('upload-failed')}
            </Typography>
            <Typography variant="caption" color="error.main">
              •
            </Typography>
            <Typography fontSize={14} color="error.main">
              {errorMessage || 'Unknown error'}
            </Typography>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            {fileSize && (
              <>
                <Typography variant="caption">{fileSize}</Typography>
                <Typography variant="caption">•</Typography>
              </>
            )}
            {status === 'loading' && <Typography variant="caption">{t('loading')}</Typography>}
            {status === 'complete' && (
              <Typography variant="caption">{t('upload-complete')}</Typography>
            )}
          </Box>
        )}

        {status === 'loading' && (
          <LinearProgress
            variant={progress != null ? 'determinate' : 'indeterminate'}
            value={progress}
            sx={{ mt: 1, mr: 3 }}
          />
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        {status === 'loading' && <CircularProgress size={20} />}
        {status === 'complete' && <CheckCircleRounded fontSize="small" color="success" />}
        {status === 'error' && <ErrorOutline fontSize="small" color="error" />}

        {onDownload && status === 'complete' && (
          <Tooltip title={t('download')}>
            <IconButton edge="end" onClick={onDownload} aria-label="download">
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip title={t('delete')}>
            <IconButton edge="end" onClick={onDelete} aria-label="delete">
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
