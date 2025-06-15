import {
  Autocomplete,
  Box,
  Button,
  capitalize,
  createFilterOptions,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { GenericDialog } from "../Dialog";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FileItem, FileUploader } from "../FileUploader";
import { UploadedFilesList } from "../UploadedFilesList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fileTypesApi } from "../../api/fileType.api";
import { FileType } from "../../types/file";

interface FileOptionType {
  type: FileType;
  inputValue?: string;
}

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileAdded: (file: FileItem) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFileAdded,
}) => {
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [errors, setErrors] = useState<{
    files?: string;
  }>({});

  const [type, setType] = useState<FileOptionType | null>(null);
  const [types, setTypes] = useState<FileOptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filter = createFilterOptions<FileOptionType>();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setSelectedFile({
        id: `${file.name}_${Date.now()}`,
        file,
        status: "complete",
      });
      setErrors((prev) => ({ ...prev, files: undefined }));
    }
  };

  const resetState = () => {
    setDescription("");
    setSelectedFile(null);
    setType(null);
    setErrors({});
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!selectedFile) newErrors.files = t("mandatory-field");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedFile) {
      const fileItem: FileItem = {
        ...selectedFile,
        description,
        type: type?.type?.type,
      };
      onFileAdded(fileItem);
      resetState();
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;

    const fetchFileTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const list = await fileTypesApi.listFileTypes();
        setTypes(
          list.map((fileType: FileType) => ({
            type: fileType,
          }))
        );
      } catch (err) {
        console.error("Failed to load file types:", err);
        setError(t("failed-to-load-file-types"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileTypes();
  }, [open, t]);

  const handleSelectValue = async (
    newValue: FileOptionType | string | null
  ) => {
    if (!newValue) {
      setType(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    let value = "";
    if (typeof newValue === "string") {
      value = newValue;
    } else if (newValue && newValue.inputValue) {
      value = newValue.inputValue;
    } else if (newValue && newValue.type) {
      setType(newValue);
      setIsLoading(false);
      return;
    }

    try {
      const existingType = types.find(
        (option: FileOptionType) =>
          option.type.type.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (existingType) {
        setType(existingType);
      } else {
        const created = await fileTypesApi.createFileType(
          capitalize(value.toLowerCase())
        );
        if (!created) {
          throw new Error("Failed to create file type");
        }

        const newOption: FileOptionType = { type: created };
        setTypes((prev) => [...prev, newOption]);
        setType(newOption);
      }
    } catch (err: any) {
      console.error("Failed to create file type:", err);
      setError(t("failed-to-create-file-type"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t("add-file")}
      content={
        <Box display="flex" flexDirection="column" gap={2}>
          {selectedFile ? (
            <UploadedFilesList
              fileItems={[selectedFile]}
              onDelete={() => setSelectedFile(null)}
            />
          ) : (
            <FileUploader onFilesSelected={handleDrop} error={errors.files} />
          )}

          <Autocomplete
            id="types"
            fullWidth
            value={type}
            options={types.toSorted((a, b) =>
              a.type.type.localeCompare(b.type.type, undefined, {
                sensitivity: "base",
              })
            )}
            onChange={(_event, newValue) => {
              handleSelectValue(newValue);
            }}
            freeSolo
            loading={isLoading}
            filterOptions={(options, params) => {
              const filtered = filter(options, {
                ...params,
                inputValue: params.inputValue.trim(),
              });
              const { inputValue } = params;
              const exists = options.some(
                (o) =>
                  o.type.type.toLowerCase().trim() ===
                  inputValue.toLowerCase().trim()
              );
              if (inputValue !== "" && !exists) {
                filtered.push({
                  inputValue,
                  type: { id: 0, type: `Add "${inputValue}"` },
                });
              }
              return filtered;
            }}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : (opt.inputValue ?? opt.type.type)
            }
            renderOption={(props, option) => {
              const isAddOption = Boolean(option.inputValue);
              const { key, ...otherProps } = props;
              return (
                <MenuItem
                  key={key}
                  {...otherProps}
                  sx={
                    isAddOption
                      ? { color: "primary.main", fontWeight: 500 }
                      : undefined
                  }
                >
                  {option.type.type}
                </MenuItem>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("file-type")}
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            name="description"
            label={t("description")}
            fullWidth
            multiline
            maxRows={4}
            value={description}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={t("file-description-tooltip")}>
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
      }
      showDividers
      actions={
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t("confirm")}
          </Button>
        </Box>
      }
    />
  );
};
