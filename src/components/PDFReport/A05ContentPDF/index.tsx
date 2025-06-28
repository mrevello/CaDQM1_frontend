import { View, Text, Link } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { DataProfilingReport } from '../types';
import { SchemaSQL } from '../../../types/dataProfiling';
import { useMemo } from 'react';
import { ListItemPDF, ListPDF } from '../ListPDF';
import { styles } from './style';
import { styles as listStyles } from '../ListPDF/index';

interface A05ContentPDFProps {
  dataProfilingPerTable?: DataProfilingReport[];
  schema?: SchemaSQL;
}

export const A05ContentPDF: React.FC<A05ContentPDFProps> = ({ dataProfilingPerTable, schema }) => {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    if (!schema) return null;
    let cols = 0;
    const typeCounts: Record<string, number> = {};

    Object.values(schema.schema).forEach(colsArr =>
      colsArr.forEach(({ type }) => {
        cols++;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      })
    );

    return {
      tables: Object.keys(schema.schema).length,
      columns: cols,
      typeCounts,
    };
  }, [schema]);

  return (
    <View>
      {summary && (
        <View style={styles.summary}>
          <View>
            <Text style={listStyles.title}>{summary.tables + ' ' + t('tables')}</Text>

            <View style={listStyles.list}>
              {Object.keys(schema?.schema ?? {}).map(name => {
                const filename = dataProfilingPerTable?.find(
                  ({ table }) => table === name
                )?.filename;
                if (!filename) return null;

                return (
                  <ListItemPDF key={name} text={name}>
                    {' - '}
                    <Link src={filename}>{filename}</Link>
                  </ListItemPDF>
                );
              })}
            </View>
          </View>

          <ListPDF
            title={summary.columns + ' ' + t('columns')}
            items={Object.entries(summary?.typeCounts ?? {}).map(
              ([type, cnt]) => `${cnt} ${t(type)}`
            )}
          />
        </View>
      )}
    </View>
  );
};
