import React from "react";
import i18n, { availableLanguages } from "../../i18n";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export const LanguageSwitcher: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(
    i18n.language
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 120,
        marginLeft: 2,
        "& .MuiInputBase-root": {
          color: "inherit",
        },
        "& .MuiSvgIcon-root": {
          color: "inherit",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
      }}
    >
      <Select
        id="language-select"
        value={selectedLanguage}
        onChange={handleChange}
        sx={{
          color: "inherit",
          "& .MuiSelect-icon": {
            color: "inherit",
          },
        }}
      >
        {availableLanguages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {language.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
