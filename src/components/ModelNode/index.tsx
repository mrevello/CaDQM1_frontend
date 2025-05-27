import { Handle, NodeProps, Position } from "reactflow";
import { Box, Card, Divider, Typography } from "@mui/material";
import { Model } from "../../types/dataProfiling";
import React from "react";

export const ModelNode: React.FC<NodeProps<Model>> = ({ data, selected }) => {
  return (
    <Card
      variant={selected ? "outlined" : undefined}
      sx={{
        minWidth: 200,
        borderColor: selected ? "primary.main" : undefined,
        overflow: "visible",
      }}
    >
      <Typography
        component="div"
        p={2}
        variant="h2"
        textAlign="center"
        color="#737373"
        fontSize={14}
        fontWeight={500}
        sx={{
          bgcolor: "#f5f5f5",
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7,
        }}
      >
        {data.name}
      </Typography>

      {data.fields.map((field, index) => (
        <Box key={field.name} display="flex" flexDirection="column">
          <Box
            display="flex"
            alignItems="center"
            px={1.5}
            py={1}
            position="relative"
          >
            {field.hasIncoming && (
              <Handle
                id={`${field.name}-in`}
                type="target"
                position={Position.Left}
                style={{ background: "#f1f5f9", border: "1px solid #cbd5e1" }}
              />
            )}
            {field.hasOutgoing && (
              <Handle
                id={`${field.name}-out`}
                type="source"
                position={Position.Right}
                style={{ background: "#f1f5f9", border: "1px solid #cbd5e1" }}
              />
            )}

            <Typography
              variant="body2"
              component="pre"
              flex={1}
              fontSize={12}
              mr={2}
            >
              {field.name}
            </Typography>

            <Typography variant="caption" color="text.secondary" fontSize={12}>
              {field.type}
            </Typography>
          </Box>

          {index < data.fields.length - 1 && <Divider />}
        </Box>
      ))}
    </Card>
  );
};
