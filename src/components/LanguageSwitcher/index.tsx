import React from 'react';
import i18n, { availableLanguages } from '../../i18n';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export const LanguageSwitcher: React.FC<{}> = () => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(i18n.language);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
                labelId="language-select-label"
                id="language-select"
                value={selectedLanguage}
                label="Language"
                onChange={handleChange}
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
