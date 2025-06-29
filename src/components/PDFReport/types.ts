import { ContextComponentsType } from '../../types/contextComponent';
import { SchemaSQL } from '../../types/dataProfiling';
import { Estimation } from '../../types/estimation';
import { Problem } from '../../types/problem';
import { Project } from '../../types/project';
import { Review } from '../../types/review';
import { Stage } from '../../types/stage';

export interface StageProps {
  project: Project;
  stage: Stage;
  problems?: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  interaction?: ReviewPDFData;
  organizationElements?: ReviewPDFData;
  dataProfilingPerTable?: DataProfilingReport[];
  schema?: SchemaSQL;
}

export type ReviewPDFData = {
  review: Review;
  files: PDFFile[];
};

export type PDFFile = {
  id: string;
  name: string;
  description?: string;
};

export type ActivityProps = {
  project: Project;
  stage: Stage;
};

export type DataProfilingReport = {
  table: string;
  filename: string;
};
