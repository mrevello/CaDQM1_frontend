import * as React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";

interface IndeterminateCheckboxProps {
  parentLabel: string;
  childLabels: string[];
  onChange?: (checked: boolean[]) => void;
}

export const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  parentLabel,
  childLabels,
  onChange,
}) => {
  const [checked, setChecked] = React.useState<boolean[]>(
    childLabels.map(() => true)
  );

  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = checked.map(() => event.target.checked);
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  const handleChildChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = [...checked];
      newChecked[index] = event.target.checked;
      setChecked(newChecked);
      onChange?.(newChecked);
    };

  const isAllChecked = checked.every(Boolean);
  const isIndeterminate = checked.some(Boolean) && !isAllChecked;

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      {childLabels.map((label, index) => (
        <FormControlLabel
          key={label}
          label={<Typography fontSize={14}>{label}</Typography>}
          control={
            <Checkbox
              checked={checked[index]}
              onChange={handleChildChange(index)}
            />
          }
        />
      ))}
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label={
          <Typography fontSize={14} fontWeight="bold" component="span">
            {parentLabel}
          </Typography>
        }
        control={
          <Checkbox
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
        }
      />
      {children}
    </div>
  );
};
