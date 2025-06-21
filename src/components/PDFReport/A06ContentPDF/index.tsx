import { View, Text } from '@react-pdf/renderer';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { Estimation } from '../../../types/estimation';

interface A06ContentPDFProps {
  estimation?: Estimation;
}

export const A06ContentPDF: React.FC<A06ContentPDFProps> = ({ estimation }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.sectionSmall}>
      {estimation && estimation.warnings && estimation.warnings.length > 0 && (
        <>
          <Text style={styles.labelSmall}>{t('warnings')}</Text>
          {estimation.warnings.map(warning => (
            <Text key={warning} style={styles.smallText}>
              • {warning}
            </Text>
          ))}
        </>
      )}
      {estimation && estimation.facts && estimation.facts.length > 0 && (
        <>
          <Text style={styles.labelSmall}>{t('facts')}</Text>
          {estimation.facts.map(fact => (
            <Text key={fact} style={styles.smallText}>
              • {fact}
            </Text>
          ))}
        </>
      )}
    </View>
  );
};
