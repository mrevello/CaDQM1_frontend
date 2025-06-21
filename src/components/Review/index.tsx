import { Box, TextField, Typography } from '@mui/material';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { reviewApi } from '../../api/review.api';
import { useNotification } from '../../context/notification.context';
import { AddFloatingButton } from '../AddFloatingButton';
import { Review, ReviewType } from '../../types/review';
import { UploadedFilesList } from '../UploadedFilesList';
import { FileItem } from '../FileUploader';
import { AlertDialog } from '../AlertDialog';
import { useTranslation } from 'react-i18next';

export interface ReviewProps {
  label: string;
  type: ReviewType;
  projectId: number;
  selectedText?: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
  createTooltip: string;
  handleCreate: () => void;
}

export const ReviewComponent: React.FC<ReviewProps> = ({
  label,
  type,
  projectId,
  selectedText,
  setSelectedText,
  createTooltip,
  handleCreate,
}) => {
  const { t } = useTranslation();
  const { showError } = useNotification();

  const [review, setReview] = useState<Review>();
  const [files, setFiles] = useState<FileItem[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState<string>();

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      const fetchReviewAndFiles = async () => {
        try {
          // Fetch review
          const review = await reviewApi.getReview(Number(projectId), type);
          if (review) {
            setReview(review);
          }

          // Fetch files from API
          const filesResponse = await reviewApi.getReviewFiles(Number(projectId), type);
          const mappedFiles = await Promise.all(
            filesResponse.map(async (file: any) => {
              try {
                // Convert base64 to Blob
                const byteCharacters = atob(file.base64_content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: file.mime_type });

                return {
                  id: file.id.toString(),
                  file: new File([blob], file.filename, {
                    type: file.mime_type,
                  }),
                  description: file.description || '',
                  status: 'complete' as const,
                };
              } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
                return {
                  id: file.id.toString(),
                  file: new File([''], file.filename, { type: file.mime_type }),
                  description: file.description || '',
                  status: 'error' as const,
                  errorMessage: 'Failed to process file',
                };
              }
            })
          );

          setFiles(mappedFiles);
        } catch (error) {
          console.error('Failed to fetch review or files:', error);
          showError(t('failed-to-load-review-files'));
        }
      };

      fetchReviewAndFiles();
    }
    mountedRef.current = true;
  }, [projectId, type]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString());
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  const handleDeleteFile = useCallback(async () => {
    try {
      if (review && fileIdToDelete) {
        await reviewApi.deleteFile(review?.id, fileIdToDelete);
        setFiles(prev => prev.filter(f => f.id !== fileIdToDelete));
      }
    } catch (error: any) {
      console.error('Failed to delete file:', error);
    }
  }, [review, setFiles]);

  return (
    <>
      <Box display="flex" flexDirection="column" flex={1} gap={1}>
        <Typography variant="subtitle2" pb={1.5}>
          {label}
        </Typography>

        <Box ref={textFieldRef} sx={{ position: 'relative' }} onMouseUp={handleTextSelection}>
          {review?.data && (
            <TextField fullWidth variant="outlined" value={review.data} multiline maxRows={20} />
          )}
          {showMenu && textFieldRef.current && (
            <AddFloatingButton tooltip={createTooltip} onAdd={handleCreate} />
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
