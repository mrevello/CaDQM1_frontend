import { View, Text } from '@react-pdf/renderer';
import { styles } from '../style';
import { styles as a05Styles } from './style';

import { useTranslation } from 'react-i18next';
import { DataProfilingReport } from '../types';

interface A05ContentPDFProps {
  dataProfilingPerTable?: DataProfilingReport[];
}

export const A05ContentPDF: React.FC<A05ContentPDFProps> = ({ dataProfilingPerTable }) => {
  const { t } = useTranslation();

  console.log('dataProfilingPerTable', dataProfilingPerTable);
  return dataProfilingPerTable
    ? dataProfilingPerTable.map(table => (
        <View key={table.table}>
          <Text>{table.table}</Text>
        </View>
      ))
    : null;
};
