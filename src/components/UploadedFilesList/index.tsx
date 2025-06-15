import { Box, Typography, Divider } from "@mui/material";
import { FileUploadItem } from "../FileUploadItem";
import { FileItem } from "../FileUploader";
import { useTranslation } from "react-i18next";

interface UploadedFilesListProps {
  fileItems: FileItem[];
  onDelete?: (id: string) => void;
  flex?: number;
  download?: boolean;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  fileItems,
  onDelete,
  flex = 1,
  download = false,
}) => {
  const { t } = useTranslation();

  if (fileItems.length === 0) return null;

  const handleDownload = (fileItem: FileItem) => {
    const url = URL.createObjectURL(fileItem.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileItem.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group files by type
  const filesByType = fileItems.reduce(
    (acc, file) => {
      const type = file.type || t("uncategorized");
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(file);
      return acc;
    },
    {} as Record<string, FileItem[]>
  );

  // Sort sections to put Uncategorized last
  const sortedSections = Object.entries(filesByType).sort(
    ([typeA], [typeB]) => {
      if (typeA === t("uncategorized")) return 1;
      if (typeB === t("uncategorized")) return -1;
      return typeA.localeCompare(typeB);
    }
  );

  return (
    <Box flex={flex} display="flex" flexDirection="column" gap={1}>
      {sortedSections.map(([type, files]) => (
        <Box key={type}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="caption">{type}</Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Box display="flex" gap={1} flexDirection="column">
            {files.map((item) => (
              <FileUploadItem
                key={item.id}
                fileName={item.file.name}
                fileSize={`${Math.round(item.file.size / 1024)} kb`}
                description={item.description}
                status={item.status}
                progress={item.progress}
                errorMessage={item.errorMessage}
                onDelete={onDelete ? () => onDelete(item.id) : undefined}
                onDownload={download ? () => handleDownload(item) : undefined}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
