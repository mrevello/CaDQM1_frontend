import { ContextComponentsPDF } from '../ContextComponentsPDF';
import { ContextComponentsType } from '../../../types/contextComponent';

interface A04ContentPDFProps {
  contextComponents: ContextComponentsType;
}

export const A04ContentPDF: React.FC<A04ContentPDFProps> = ({ contextComponents }) => {
  return <ContextComponentsPDF contextComponents={contextComponents} />;
};
