import { Text, View } from '@react-pdf/renderer';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { ProblemsListPDF } from '../ProblemsListPDF';
import { Problem } from '../../../types/problem';

interface DqProblemsPDFProps {
  problems: Problem[];
}

export const DqProblemsPDF: React.FC<DqProblemsPDFProps> = ({ problems }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{t('dq-problems')}</Text>
      <ProblemsListPDF problems={problems} />
    </View>
  );
};
