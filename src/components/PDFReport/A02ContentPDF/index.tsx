import { ReviewPDFData } from '../types';
import { ReviewPDF } from '../ReviewPDF';

interface A02ContentPDFProps {
  organizationElements?: ReviewPDFData;
}

export const A02ContentPDF: React.FC<A02ContentPDFProps> = ({ organizationElements }) => {
  return organizationElements ? <ReviewPDF reviewData={organizationElements} /> : <></>;
};
