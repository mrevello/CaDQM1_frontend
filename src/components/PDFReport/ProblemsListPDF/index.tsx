import { View, Text } from '@react-pdf/renderer';
import { styles } from '../style';
import { Problem } from '../../../types/problem';

interface ProblemsListPDFProps {
  problems: Problem[];
}

export const ProblemsListPDF: React.FC<ProblemsListPDFProps> = ({ problems }) => {
  return (
    <View style={styles.sectionSmall}>
      {problems.map((problem: Problem) => (
        <View key={problem.id} style={styles.fileItem}>
          <Text style={styles.smallText}>• {problem.description}</Text>
        </View>
      ))}
    </View>
  );
};
