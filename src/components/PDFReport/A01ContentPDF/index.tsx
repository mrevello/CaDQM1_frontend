import { View, Text } from '@react-pdf/renderer';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { DataAtHand } from '../../../types/dataAtHand';

interface A01ContentPDFProps {
  dataAtHand?: DataAtHand;
}

export const A01ContentPDF: React.FC<A01ContentPDFProps> = ({ dataAtHand }) => {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.item}>
        <Text style={styles.smallText}>{t('data-at-hand')}:</Text>
        <Text style={styles.smallText}>
          {dataAtHand?.name} - {dataAtHand?.description}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.smallText}>{t('database-url')}:</Text>
        <Text style={styles.smallTextBold}>{dataAtHand?.database}</Text>
      </View>
    </View>
  );
};
