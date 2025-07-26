import { Box, Button, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ActivityHandle } from '../../pages/stages/Stagelayout';
import { reviewApi, ReviewBody } from '../../api/review.api';
import { FileUploadDialog } from '../FileUploadDialog';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { UploadedFilesList } from '../UploadedFilesList';
import { FileItem } from '../FileUploader';
import { Review, ReviewType } from '../../types/review';
import { AlertDialog } from '../AlertDialog';
import { useReview } from '../../hooks/useReview';
import { LoadingProgress } from '../LoadingProgress';

export interface ReviewData {
  review: Review;
  files: FileItem[];
}

export interface ReviewProps {
  label: string;
  type: ReviewType;
  projectId: number;
}

export const ReviewScreen: React.FC<ReviewProps> = ({ label, type, projectId }) => {
  const { t } = useTranslation();

  const { activityRef } = useOutletContext<{
    activityRef: React.MutableRefObject<ActivityHandle | null>;
  }>();

  const [errors, setErrors] = useState<{ text?: string }>({});
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);

  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<string>();

  const { loading, review, files, fetchReviewAndFiles, uploadFile, deleteFile } = useReview({
    projectId,
    type,
  });

  const [text, setText] = useState<string>(review?.data ?? '');

  useEffect(() => {
    if (review?.data != undefined) {
      setText(review.data);
    }
  }, [review]);

  const handleDeleteFile = useCallback(async () => {
    try {
      if (fileIdToDelete) {
        await deleteFile(fileIdToDelete);
      }
    } catch (error: any) {
      console.error('Failed to delete file:', error);
    } finally {
      setFileIdToDelete(undefined);
      setDeleteFileDialogOpen(false);
    }
  }, [deleteFile, fileIdToDelete]);

  const validateForm = useCallback(async () => {
    try {
      const reviewBody: ReviewBody = {
        data: text,
        type: type,
        project: projectId,
      };

      if (review) {
        await reviewApi.updateReview(review.id, reviewBody);
      } else {
        await reviewApi.createReview(reviewBody);
      }
      return true;
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [text, projectId, review, type]);

  useEffect(() => {
    if (activityRef) {
      activityRef.current = { validateForm };
    }
  }, [activityRef, validateForm]);

  useEffect(() => {
    console.log('fetchReviewAndFiles');
    fetchReviewAndFiles();
  }, [fetchReviewAndFiles]);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>
          <Button startIcon={<Add />} onClick={() => setFileUploadDialogOpen(true)} sx={{ p: 0 }}>
            {t('add-file')}
          </Button>
        </Box>

        {loading ? (
          <LoadingProgress />
        ) : (
          <Grid container spacing={4}>
            <Grid size={files.length > 0 ? 7 : 12}>
              <TextField
                variant="outlined"
                value={text}
                multiline
                fullWidth
                rows={20}
                onChange={e => {
                  const newData = e.target.value;
                  setText(newData);
                  if (errors.text) {
                    setErrors(prev => ({ ...prev, data: undefined }));
                  }
                }}
                error={!!errors.text}
                helperText={errors.text}
                sx={{
                  '& .MuiInputBase-inputMultiline': { resize: 'vertical' },
                }}
              />
            </Grid>

            <Grid size={files.length > 0 ? 5 : 0}>
              <UploadedFilesList
                fileItems={files}
                onDelete={(id: string) => {
                  setFileIdToDelete(id);
                  setDeleteFileDialogOpen(true);
                }}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        onFileAdded={uploadFile}
      />

      <AlertDialog
        open={deleteFileDialogOpen}
        title="Delete File?"
        description={'Are you sure you want to delete it?'}
        onClose={() => setDeleteFileDialogOpen(false)}
        onConfirm={handleDeleteFile}
      />
    </>
  );
};
