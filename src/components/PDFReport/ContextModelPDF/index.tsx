import { Text, View } from '@react-pdf/renderer';
import { ContextComponentsPDF } from '../ContextComponentsPDF';
import { styles as commonStyles, textStyles } from '../style';
import { useTranslation } from 'react-i18next';
import { ContextComponentsType } from '../../../types/contextComponent';
import { Context } from '../../../types/context';

interface ContextModelPDFProps {
  context: Context;
  contextComponents: ContextComponentsType;
}

export const ContextModelPDF: React.FC<ContextModelPDFProps> = ({ context, contextComponents }) => {
  const { t } = useTranslation();
  return (
    <View style={commonStyles.section}>
      <View style={commonStyles.headerContainer}>
        <Text style={textStyles.label}>{t('context-model')}</Text>
        {context.version && (
          <Text style={textStyles.metaText}>
            {t('version')} {context.version}
          </Text>
        )}
      </View>
      <ContextComponentsPDF contextComponents={contextComponents} />
    </View>
  );
};
