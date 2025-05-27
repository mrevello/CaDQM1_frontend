import React, { useCallback, useEffect, useMemo } from "react";
import "reactflow/dist/style.css";
import { getInfoFromSchema, SchemaSQL } from "../../types/dataProfiling";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { Box } from "@mui/material";
import { ModelNode } from "../ModelNode";

export interface SchemaVisualizerProps {
  schemaSQL: SchemaSQL;
  selectedTable: string;
  setTable: React.Dispatch<React.SetStateAction<string>>;
}

const nodeTypes = { model: ModelNode };

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({
  schemaSQL,
  selectedTable,
  setTable,
}) => {
  const { models, connections } = getInfoFromSchema(schemaSQL);

  const { initialNodes, initialEdges } = useMemo(() => {
    const leftModels = models.filter((m) =>
      m.fields.some((f) => f.hasOutgoing)
    );
    const rightModels = models.filter(
      (m) => !m.fields.some((f) => f.hasOutgoing)
    );

    const SPACING_Y = 100;
    const X_LEFT = 0;
    const X_RIGHT = 400;

    const rawNodes: Node[] = [
      ...leftModels.map((m, i) => ({
        id: m.name,
        type: "model",
        data: m,
        position: { x: X_LEFT, y: i * SPACING_Y },
      })),
      ...rightModels.map((m, i) => ({
        id: m.name,
        type: "model",
        data: m,
        position: { x: X_RIGHT, y: i * SPACING_Y },
      })),
    ];

    const rawEdges: Edge[] = connections.map((c) => ({
      id: `${c.source}-${c.name}-${c.target}`,
      source: c.source,
      sourceHandle: `${c.name}-out`,
      target: c.target,
      targetHandle: `${c.name}-in`,
    }));

    return { initialNodes: rawNodes, initialEdges: rawEdges };
  }, [models, connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === selectedTable,
      }))
    );
  }, [selectedTable, setNodes]);

  const onInit = useCallback((rf: ReactFlowInstance) => {
    rf.fitView({ padding: 0.5 });
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setTable(node.id);
    },
    [setTable]
  );

  return (
    <Box
      height="60vh"
      boxSizing="border-box"
      border="1px solid #e5e7eb"
      borderRadius={2}
      flex={1}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        onNodeClick={onNodeClick}
      >
        <Background />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </Box>
  );
};
