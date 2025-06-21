import { ContextComponentsPDF } from '../ContextComponentsPDF';
import { ContextComponentsType } from '../../../types/contextComponent';
import { Stage } from '../../../types/stage';

interface A04ContentPDFProps {
  contextComponents?: ContextComponentsType;
  stage?: Stage;
}

export const A04ContentPDF: React.FC<A04ContentPDFProps> = ({ contextComponents, stage }) => {
  return contextComponents ? (
    <ContextComponentsPDF contextComponents={contextComponents} stage={stage} />
  ) : null;
};
