import { View, Text } from '@react-pdf/renderer';
import { styles, textStyles } from '../style';
import { useTranslation } from 'react-i18next';
import { ReviewPDFData } from '../types';
import { ListPDF } from '../ListPDF';

interface ReviewPDFProps {
  reviewData: ReviewPDFData;
}

export const ReviewPDF: React.FC<ReviewPDFProps> = ({ reviewData }) => {
  const { t } = useTranslation();

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {reviewData.review.data && <Text style={textStyles.smallText}>{reviewData.review.data}</Text>}
      {reviewData.files.length > 0 && (
        <ListPDF
          title={t('files')}
          items={reviewData.files.map(
            file => file.name + (file.description ? ` - ${file.description}` : '')
          )}
        />
      )}
    </View>
  );
};
