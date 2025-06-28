import { Problem } from '../../../types/problem';
import { ListPDF } from '../ListPDF';

interface ProblemsListPDFProps {
  problems: Problem[];
}

export const ProblemsListPDF: React.FC<ProblemsListPDFProps> = ({ problems }) => {
  return <ListPDF items={problems.map((problem: Problem) => problem.description)} />;
};
