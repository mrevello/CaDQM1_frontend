import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

interface ContextComponentTableProps {
  title: string;
  data: { [key: string]: string }[];
}

export const ContextComponentTable: React.FC<ContextComponentTableProps> = ({ title, data }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>

      {data.map((row, rowIndex) => {
        const { id, ...rest } = row;
        return (
          <View key={rowIndex}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellLeft, styles.headerCell]}>{id}</Text>
            </View>

            {Object.entries(rest).map(([key, value], idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCellLeft, styles.headerCell]}>{t(key)}</Text>
                <Text style={styles.tableCellRight}>{value}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
    paddingTop: 6,
  },
  tableCellLeft: {
    flex: 1,
    fontSize: 10,
  },
  tableCellRight: {
    flex: 3,
    fontSize: 10,
  },
  headerCell: {
    opacity: 0.8,
  },
});
