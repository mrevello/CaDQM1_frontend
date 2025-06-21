import { ReviewPDFData } from '../types';
import { ReviewPDF } from '../ReviewPDF';

interface A08ContentPDFProps {
  interaction?: ReviewPDFData;
}

export const A08ContentPDF: React.FC<A08ContentPDFProps> = ({ interaction }) => {
  return interaction ? <ReviewPDF reviewData={interaction} /> : <></>;
};
