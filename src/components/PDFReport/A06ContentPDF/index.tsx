import { View } from '@react-pdf/renderer';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { Estimation } from '../../../types/estimation';
import { ListPDF } from '../ListPDF';

interface A06ContentPDFProps {
  estimation: Estimation;
}

export const A06ContentPDF: React.FC<A06ContentPDFProps> = ({ estimation }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.sectionSmall}>
      {estimation.warnings && estimation.warnings.length > 0 && (
        <ListPDF title={t('warnings')} items={estimation.warnings} />
      )}
      {estimation.facts && estimation.facts.length > 0 && (
        <ListPDF title={t('facts')} items={estimation.facts} />
      )}
    </View>
  );
};
