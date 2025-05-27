let hasRegistered = false;
let currentTableNames: string[] = [];

const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "GROUP BY",
  "ORDER BY",
  "LIMIT",
  "TRUNCATE",
];

export function setupSqlProvider(monaco: typeof import("monaco-editor")) {
  if (hasRegistered) return;
  hasRegistered = true;

  monaco.languages.registerCompletionItemProvider("sql", {
    triggerCharacters: [" ", "."],
    provideCompletionItems: (model, position) => {
      const wordUntil = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordUntil.startColumn,
        endColumn: wordUntil.endColumn,
      };

      const keywordItems = SQL_KEYWORDS.map((kw) => ({
        label: kw,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: kw,
        range,
      }));

      const tableItems = currentTableNames.map((tbl) => ({
        label: tbl,
        kind: monaco.languages.CompletionItemKind.Struct,
        insertText: tbl,
        range,
      }));

      return { suggestions: [...keywordItems, ...tableItems] };
    },
  });
}

export function updateSqlTableNames(names: string[]) {
  currentTableNames = names;
}
