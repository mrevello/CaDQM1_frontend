import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import { useTranslation } from "react-i18next";

interface EmptyProjectStateProps {
  onCreateNew: () => void;
}

export const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({
  onCreateNew,
}) => {
  const { t } = useTranslation("project");

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={2}
      textAlign="center"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={96}
        width={96}
        borderRadius="50%"
        bgcolor="#eff6ff"
        mb={3}
      >
        <CreateNewFolderOutlinedIcon
          sx={{ fontSize: 48, color: "primary.main" }}
        />
      </Box>

      <Typography variant="h6" mb={1} fontWeight={600}>
        {t("no-projects-yet")}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        mb={3}
        maxWidth={400}
      >
        {t("no-projects-placeholder")}
      </Typography>

      <Button startIcon={<Add />} onClick={onCreateNew}>
        {t("create-new-project")}
      </Button>
    </Box>
  );
};
