import { useCallback, useState } from 'react';
import { reviewApi, ReviewBody, ReviewFile } from '../api/review.api';
import { Review, ReviewType } from '../types/review';
import { FileItem } from '../components/FileUploader';

interface UseReviewProps {
  projectId: number;
  type: ReviewType;
}

export const useReview = ({ projectId, type }: UseReviewProps) => {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<Review>();
  const [files, setFiles] = useState<FileItem[]>([]);

  const fetchReviewAndFiles = useCallback(async () => {
    try {
      setLoading(true);
      const reviewResponse = await reviewApi.getReview(projectId, type);
      if (reviewResponse) {
        setReview(reviewResponse);
      }

      const filesResponse = await reviewApi.getReviewFiles(Number(projectId), type);

      const mappedFiles = await Promise.all(
        filesResponse.map(async (file: ReviewFile) => {
          try {
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
              type: file.file_type,
            };
          } catch (error) {
            console.error(`Error processing file ${file.filename}:`, error);
            return null;
          }
        })
      );

      setFiles(mappedFiles.filter(file => file !== null));
    } catch (error) {
      console.error('Failed to fetch review:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, type]);

  const uploadFile = useCallback(
    async (fileItem: FileItem) => {
      let currentReview = review;

      if (!currentReview) {
        const reviewBody: ReviewBody = {
          data: '',
          type: type,
          project: projectId,
        };
        const newReview = await reviewApi.createReview(reviewBody);
        if (newReview) {
          setReview(newReview);
          currentReview = newReview;
        } else {
          console.error('Failed to create review');
          return;
        }
      }

      try {
        setFiles(prev => [
          ...prev,
          {
            ...fileItem,
            status: 'loading' as const,
            progress: 0,
          },
        ]);

        const form = new FormData();
        form.append('file', fileItem.file);
        if (fileItem.description) {
          form.append('description', fileItem.description);
        }
        if (fileItem.type) {
          form.append('file_type', fileItem.type);
        }

        await reviewApi.uploadFile(currentReview.id, form, progress => {
          setFiles(prev =>
            prev.map(item => (item.id === fileItem.id ? { ...item, progress } : item))
          );
        });

        setFiles(prev =>
          prev.map(item =>
            item.id === fileItem.id ? { ...item, status: 'complete', progress: 100 } : item
          )
        );
      } catch (error) {
        setFiles(prev =>
          prev.map(item =>
            item.id === fileItem.id
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: error instanceof Error ? error.message : 'Upload failed',
                  progress: 0,
                }
              : item
          )
        );
      }
    },
    [review, projectId, type]
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      try {
        if (!review) return;
        await reviewApi.deleteFile(review?.id, fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    },
    [review]
  );

  return {
    loading,
    review,
    files,
    setFiles,
    fetchReviewAndFiles,
    uploadFile,
    deleteFile,
  };
};
