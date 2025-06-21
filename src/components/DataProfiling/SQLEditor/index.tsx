import React, { useEffect } from 'react';
import MonacoEditor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { Card } from '@mui/material';
import {
  setupSqlProvider,
  updateSqlColumnNames,
  updateSqlTableNames,
} from '../../../utils/monacoSqlProvider';
import { ColumnSchema, Schema } from '../../../types/dataProfiling';

export interface SqlEditorProps {
  value: string;
  onChange: (newSql: string) => void;
  schema?: Schema;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, schema }) => {
  const handleBeforeMount: BeforeMount = monacoInstance => {
    setupSqlProvider(monacoInstance);
  };

  useEffect(() => {
    if (schema) {
      updateSqlTableNames(Object.keys(schema));

      const columnNames = Object.values(schema).flatMap(colsArr =>
        colsArr.map((column: ColumnSchema) => column.column)
      );
      updateSqlColumnNames(columnNames);
    }
  }, [schema]);

  const handleOnMount: OnMount = editor => {
    editor.updateOptions({
      wordWrap: 'on',
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
        onChange={v => v !== undefined && onChange(v)}
        options={{
          minimap: { enabled: false },
          fontFamily: 'monospace',
          automaticLayout: true,
        }}
      />
    </Card>
  );
};
