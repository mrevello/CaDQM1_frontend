import { themePalette } from '../config/theme.config';

export type ColumnType = 'text' | 'real' | 'numeric' | 'integer' | string;

export interface ColumnSchema {
  column: string;
  type: ColumnType;
}

export type Schema = Record<string, ColumnSchema[]>;

export interface RelationSchema {
  column: string;
  references: string;
}

export type Relations = Record<string, RelationSchema[]>;

export interface SchemaSQL {
  schema: Schema;
  relations: Relations;
}

export type ModelField = {
  name: string;
  type: string;
  hasIncoming: boolean;
  hasOutgoing: boolean;
};

export type Model = {
  name: string;
  fields: ModelField[];
  isChild?: boolean;
};

export type ModelConnection = {
  target: string;
  source: string;
  name: string;
};

export const getInfoFromSchema = (
  schemaSQL: SchemaSQL
): { models: Model[]; connections: ModelConnection[] } => {
  const { schema, relations } = schemaSQL;

  const connections: ModelConnection[] = [];
  Object.entries(relations).forEach(([table, rels]) => {
    rels.forEach(({ column, references }) => {
      const parts = references.split('.');
      parts.pop();
      const refTable = parts.join('.');
      connections.push({
        source: table,
        target: refTable,
        name: column,
      });
    });
  });

  const outgoing = new Set<string>();
  const incoming = new Set<string>();
  connections.forEach(({ source, name, target }) => {
    outgoing.add(`${source}:${name}`);
    incoming.add(`${target}:${name}`);
  });

  const childTables = new Set(connections.map(c => c.source));

  const models: Model[] = Object.entries(schema).map(([tableName, cols]) => ({
    name: tableName,
    isChild: childTables.has(tableName),
    fields: cols.map(({ column, type }) => ({
      name: column,
      type,
      hasIncoming: incoming.has(`${tableName}:${column}`),
      hasOutgoing: outgoing.has(`${tableName}:${column}`),
    })),
  }));

  return { models, connections };
};

export interface DataProfilingYResponse {
  message: string;
  reports: Record<string, ProfileData>;
}

export interface ProfileData {
  analysis: ProfileAnalysisInfo;
  table: ProfileTableInfo;
  variables: Record<string, VariableProfileDetails>;
  alerts: string[];
  sample: SampleData[];
}

export interface SampleData {
  id: 'head' | 'tail';
  data: Record<string, any>[];
  columnTypes: ColumnSchema[];
  name: string;
}

export interface ProfileAnalysisInfo {
  title: string;
  dateStart: string;
  dateEnd: string;
}

export interface ProfileTableInfo {
  rowCount: number;
  variableCount: number;
  memorySize: number;
  recordSize: number;
  missingCellsCount: number;
  variablesWithMissingCount: number;
  variablesAllMissingCount: number;
  missingCellsPercentage: number;
  types: Record<ColumnType, { count: number; color: string; backgroundColor: string }>;
  duplicateRowsCount: number;
  duplicateRowsPercentage: number;
}

export interface VariableProfileDetails {
  type: ColumnType;
  typeColor: string;
  typeBackgroundColor: string;
  [key: string]: any;
}

export interface DataProfilingType {
  tables: Record<string, ProfileData>;
}

const STYLE_LIST = [
  {
    color: themePalette.WARNING,
    backgroundColor: themePalette.BACKGROUND_WARNING,
  },
  { color: themePalette.ERROR, backgroundColor: themePalette.BACKGROUND_ERROR },
  {
    color: themePalette.SUCCESS,
    backgroundColor: themePalette.BACKGROUND_SUCCESS,
  },
  {
    color: themePalette.PURPLE,
    backgroundColor: themePalette.BACKGROUND_PURPLE,
  },
  {
    color: themePalette.INFO,
    backgroundColor: themePalette.BACKGROUND_INFO,
  },
] as const;

export function mapProfileTableInfo(raw: {
  n: number;
  n_var: number;
  memory_size: number;
  record_size: number;
  n_cells_missing: number;
  n_vars_with_missing: number;
  n_vars_all_missing: number;
  p_cells_missing: number;
  types: Record<string, number>;
  n_duplicates: number;
  p_duplicates: number;
}): ProfileTableInfo {
  const entries = Object.entries(raw.types);

  const types = entries.reduce(
    (acc, [typeKey, count], idx) => {
      const key = typeKey.toLowerCase() as ColumnType;
      const { color, backgroundColor } = STYLE_LIST[idx % STYLE_LIST.length];
      acc[key] = { count, color, backgroundColor };
      return acc;
    },
    {} as Record<ColumnType, { count: number; color: string; backgroundColor: string }>
  );

  return {
    rowCount: raw.n,
    variableCount: raw.n_var,
    memorySize: raw.memory_size,
    recordSize: raw.record_size,
    missingCellsCount: raw.n_cells_missing,
    variablesWithMissingCount: raw.n_vars_with_missing,
    variablesAllMissingCount: raw.n_vars_all_missing,
    missingCellsPercentage: raw.p_cells_missing,
    types: types,
    duplicateRowsCount: raw.n_duplicates,
    duplicateRowsPercentage: raw.p_duplicates,
  };
}

export function mapRawReports(rawReports: Record<string, any>): Record<string, ProfileData> {
  const reports: Record<string, ProfileData> = {};

  for (const tableName in rawReports) {
    const raw = rawReports[tableName];

    const analysis: ProfileAnalysisInfo = {
      title: raw.analysis.title,
      dateStart: raw.analysis.date_start,
      dateEnd: raw.analysis.date_end,
    };

    const table: ProfileTableInfo = mapProfileTableInfo(raw.table);

    const alerts: string[] = Array.isArray(raw.alerts) ? raw.alerts : [];

    const variables: Record<string, VariableProfileDetails> = {};
    for (const varName in raw.variables) {
      const v = raw.variables[varName];

      const typeKey = v.type.toLowerCase() as ColumnType;
      const typeInfo = table.types[typeKey];

      const detail: VariableProfileDetails = {
        type: typeKey,
        typeColor: typeInfo.color,
        typeBackgroundColor: typeInfo.backgroundColor,
        ...v,
      };

      variables[varName] = detail;
    }

    const sample: SampleData[] = raw.sample.map((s: any) => ({
      id: s.id as 'head' | 'tail',
      data: s.data as Record<string, any>[],
      columnTypes: table.types,
      name: s.name as string,
    }));

    reports[normalizeTable(tableName)] = {
      analysis,
      table,
      variables,
      alerts,
      sample,
    };
  }

  return reports;
}

export function normalizeSchemaSQL(input: SchemaSQL): SchemaSQL {
  const schema: Schema = Object.fromEntries(
    Object.entries(input.schema).map(([table, cols]) => [normalizeTable(table), cols])
  );

  const relations: Relations = Object.fromEntries(
    Object.entries(input.relations).map(([table, rels]) => [
      normalizeTable(table),
      rels.map(({ column, references }) => ({
        column,
        references: references.replace(/^public\./, ''),
      })),
    ])
  );

  return { schema, relations };
}

function normalizeTable(tableName: string): string {
  return tableName.replace(/^public\./, '');
}

// R
export interface VariableStats {
  skim_variable: string[];
  n_missing: number[];
  complete_rate: number[];
  [key: string]: any; // other fields
}

export interface NumericStats extends VariableStats {
  mean: number[];
  sd: number[];
  p0: number[];
  p25: number[];
  p50: number[];
  p75: number[];
  p100: number[];
  hist: string[];
}

export interface CharacterStats extends VariableStats {
  min: number[];
  max: number[];
  empty: number[];
  n_unique: number[];
  whitespace: number[];
}

export interface TableProfiling {
  skim: {
    character?: CharacterStats;
    numeric?: NumericStats;
  };
  dx_summary: {
    introduce: {
      rows: number[];
      columns: number[];
      [key: string]: any;
    };
    structure: any;
  };
}

export interface DataProfilingResponse {
  [tableName: string]: TableProfiling;
}
