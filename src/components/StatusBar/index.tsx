import React from "react";
import { Box, Typography, Stack, Tooltip } from "@mui/material";

type Segment = {
  label: string;
  value: number;
  color: string;
  percentage: number;
};

interface StatusBarProps {
  segments: Segment[];
}

export const StatusBar: React.FC<StatusBarProps> = ({ segments }) => {
  return (
    <Box width="100%">
      <Box
        display="flex"
        width="100%"
        height={8}
        borderRadius={8}
        overflow="hidden"
        mb={2}
      >
        {segments.map((segment, index) => (
          <Tooltip key={index} title={`${segment.percentage}%`}>
            <Box
              key={index}
              sx={{
                width: `${segment.percentage}%`,
                backgroundColor: segment.color,
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <Stack direction="row" spacing={1}>
        {segments.map((segment, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            spacing={1}
            flex={1}
          >
            <Box
              width={12}
              height={12}
              borderRadius={2}
              sx={{ backgroundColor: segment.color }}
            />
            <Typography variant="caption">{segment.label}</Typography>
            <Typography variant="caption" fontWeight={500}>
              {segment.value.toLocaleString()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
