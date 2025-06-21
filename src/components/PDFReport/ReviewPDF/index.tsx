import { View, Text } from '@react-pdf/renderer';
import { styles } from '../style';
import { useTranslation } from 'react-i18next';
import { ReviewPDFData } from '../types';

interface ReviewPDFProps {
  reviewData: ReviewPDFData;
}

export const ReviewPDF: React.FC<ReviewPDFProps> = ({ reviewData }) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.item}>
        {reviewData.review.data && <Text style={styles.smallText}>{reviewData.review.data}</Text>}
      </View>
      {reviewData.files.length > 0 && (
        <View style={styles.sectionSmall}>
          <Text style={styles.value}>{t('files')}:</Text>
          {reviewData.files.map(file => (
            <View key={file.id} style={styles.fileItem}>
              <Text style={styles.smallText}>• {file.name}</Text>
              {file.description && <Text style={styles.smallText}> - {file.description}</Text>}
            </View>
          ))}
        </View>
      )}
    </>
  );
};
