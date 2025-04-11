import { Box } from "@mui/material";
import { FileUploadItem } from "../FileUploadItem";
import { FileItem } from "../FileUploader";

interface UploadedFilesListProps {
  fileItems: FileItem[];
  onDelete: (id: string) => void;
  flex?: number;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  fileItems,
  onDelete,
  flex = 1,
}) => {
  if (fileItems.length === 0) return null;

  return (
    <Box flex={flex} display="flex" gap={1} flexDirection="column">
      {fileItems.map((item) => (
        <FileUploadItem
          key={item.id}
          fileName={item.file.name}
          fileSize={`${Math.round(item.file.size / 1024)} kb`}
          description={item.description}
          status={item.status}
          progress={item.progress}
          errorMessage={item.errorMessage}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </Box>
  );
};
