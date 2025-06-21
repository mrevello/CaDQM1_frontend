import { Text, View } from '@react-pdf/renderer';
import { ContextComponentsPDF } from '../ContextComponentsPDF';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { ContextComponentsType } from '../../../types/contextComponent';
import { Stage } from '../../../types/stage';

interface ContextModelPDFProps {
  contextComponents: ContextComponentsType;
  stage?: Stage;
}

export const ContextModelPDF: React.FC<ContextModelPDFProps> = ({ contextComponents, stage }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{t('context-model')}</Text>
      <ContextComponentsPDF contextComponents={contextComponents} stage={stage} />
    </View>
  );
};
