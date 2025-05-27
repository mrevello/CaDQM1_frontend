import React, { useEffect } from "react";
import MonacoEditor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { Card } from "@mui/material";
import {
  setupSqlProvider,
  updateSqlTableNames,
} from "../../../utils/monacoSqlProvider";

export interface SqlEditorProps {
  value: string;
  onChange: (newSql: string) => void;
  tableNames?: string[];
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  tableNames = [],
}) => {
  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    setupSqlProvider(monacoInstance);
  };

  useEffect(() => {
    updateSqlTableNames(tableNames);
  }, [tableNames]);

  const handleOnMount: OnMount = (editor) => {
    editor.updateOptions({
      wordWrap: "on",
      minimap: { enabled: false },
    });
  };

  return (
    <Card sx={{ minHeight: 200, borderRadius: 1 }}>
      <MonacoEditor
        language="sql"
        value={value}
        height={200}
        beforeMount={handleBeforeMount}
        onMount={handleOnMount}
        onChange={(v) => v !== undefined && onChange(v)}
        options={{
          minimap: { enabled: false },
          fontFamily: "monospace",
          automaticLayout: true,
        }}
      />
    </Card>
  );
};
