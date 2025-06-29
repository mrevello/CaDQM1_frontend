import { Page, View, Document } from '@react-pdf/renderer';
import { styles } from './style';
import { StageDataPDF } from './StageDataPDF';
import { Stage } from '../../types/stage';
import { PDFSelection } from '../PDFSelectionDialog';
import { ContextModelPDF } from './ContextModelPDF';
import { DqProblemsPDF } from './DqProblemsPDF';
import { ProjectInfoPDF } from './ProjectInfoPDF';
import { Project } from '../../types/project';
import { Problem } from '../../types/problem';
import { Estimation } from '../../types/estimation';
import { ReviewPDFData } from './types';
import { ContextComponentsType } from '../../types/contextComponent';
import { DataProfilingReport } from './types';
import { SchemaSQL } from '../../types/dataProfiling';

interface ReportProps {
  project: Project;
  problems?: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  interaction?: ReviewPDFData;
  organizationElements?: ReviewPDFData;
  dataProfilingPerTable?: DataProfilingReport[];
  schema?: SchemaSQL;
  selection?: PDFSelection;
}

export const PDFReport: React.FC<ReportProps> = ({
  project,
  problems,
  estimation,
  contextComponents,
  dataProfilingPerTable,
  interaction,
  organizationElements,
  selection,
  schema,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pdfContainer}>
          <ProjectInfoPDF project={project} />

          {Object.values(Stage).map(stage => {
            if (!selection?.stages[stage]?.selected) return null;
            return (
              <StageDataPDF
                key={stage}
                project={project}
                stage={stage}
                selectedActivities={selection?.stages[stage]?.activities}
                problems={problems}
                estimation={estimation}
                contextComponents={contextComponents}
                interaction={interaction}
                organizationElements={organizationElements}
                dataProfilingPerTable={dataProfilingPerTable}
                schema={schema}
              />
            );
          })}

          {selection?.dqProblems && problems && <DqProblemsPDF problems={problems} />}

          {selection?.contextModel && contextComponents && project.context && (
            <ContextModelPDF context={project.context} contextComponents={contextComponents} />
          )}
        </View>
      </Page>
    </Document>
  );
};
