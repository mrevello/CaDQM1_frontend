import { Box, TextField, Typography } from '@mui/material';
import React, { useState, useCallback, useEffect } from 'react';
import { ReviewType } from '../../types/review';
import { UploadedFilesList } from '../UploadedFilesList';
import { AlertDialog } from '../AlertDialog';
import { useTranslation } from 'react-i18next';
import { useReview } from '../../hooks/useReview';

export interface ReviewProps {
  label?: string;
  type: ReviewType;
  projectId: number;
}

export const ReviewComponent: React.FC<ReviewProps> = ({ label, type, projectId }) => {
  const { t } = useTranslation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<string>();

  const { review, files, fetchReviewAndFiles, deleteFile } = useReview({
    projectId,
    type,
  });

  useEffect(() => {
    fetchReviewAndFiles();
  }, [fetchReviewAndFiles]);

  const handleDeleteFile = useCallback(async () => {
    try {
      if (fileIdToDelete) {
        await deleteFile(fileIdToDelete);
      }
    } catch (error: any) {
      console.error('Failed to delete file:', error);
    } finally {
      setFileIdToDelete(undefined);
      setDeleteDialogOpen(false);
    }
  }, [deleteFile, fileIdToDelete]);

  return (
    <>
      <Box display="flex" flexDirection="column" flex={1} gap={1}>
        {label && (
          <Typography variant="subtitle2" pb={1.5}>
            {label}
          </Typography>
        )}

        <Box sx={{ position: 'relative' }}>
          {review?.data && (
            <TextField fullWidth variant="outlined" value={review.data} multiline maxRows={20} />
          )}
        </Box>

        <UploadedFilesList
          fileItems={files}
          download
          onDelete={(id: string) => {
            setFileIdToDelete(id);
            setDeleteDialogOpen(true);
          }}
        />
      </Box>

      <AlertDialog
        open={deleteDialogOpen}
        title={t('delete-file')}
        description={t('are-you-sure-you-want-to-delete-it')}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteFile}
      />
    </>
  );
};
