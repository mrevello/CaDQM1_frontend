import { ProblemsListPDF } from '../ProblemsListPDF';
import { Problem } from '../../../types/problem';

interface A03ContentPDFProps {
  problems: Problem[];
}

export const A03ContentPDF: React.FC<A03ContentPDFProps> = ({ problems }) => {
  return <ProblemsListPDF problems={problems} />;
};
