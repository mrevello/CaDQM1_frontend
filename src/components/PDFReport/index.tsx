import { Page, Text, View, Document } from '@react-pdf/renderer';
import { styles } from './style';
import { Project, projectStatus } from '../../types/project';
import { getName, State } from '../../types/state';
import { useTranslation } from 'react-i18next';
import { StageDataPDF } from './StageDataPDF';
import { Stage } from '../../types/stage';
import { capitalize } from '@mui/material';
import { PDFSelection } from '../PDFSelectionDialog';
import { ContextModelPDF } from './ContextModelPDF';
import { DqProblemsPDF } from './DqProblemsPDF';
import { usePDFReport } from '../../hooks/usePDFReport';

interface ReportProps {
  projectId: number;
  selection?: PDFSelection;
}

export const PDFReport: React.FC<ReportProps> = ({ projectId, selection }) => {
  const { t } = useTranslation();

  const {
    project,
    error: errorData,
    problems,
    estimation,
    contextComponents,
    dataProfilingPerTable,
    interaction,
    organizationElements,
  } = usePDFReport({ projectId });

  const renderProjectInfo = (project: Project) => {
    const state = projectStatus(project.stages);
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>
          {t('project')}: {project.name}
        </Text>

        {project.description && (
          <View style={styles.sectionSmall}>
            <Text style={styles.smallText}>{project.description}</Text>
          </View>
        )}

        {project.createdAt && (
          <View style={styles.item}>
            <Text style={styles.smallText}>{t('created')}:</Text>
            <Text style={styles.smallText}>{project.createdAt.toLocaleString()}</Text>
          </View>
        )}

        <View style={styles.item}>
          <Text style={styles.smallText}>{t('context-version')}:</Text>
          <Text style={styles.smallText}>{project.context?.version ?? 'v 1.0'}</Text>
        </View>

        {project.dqModel && (
          <View style={styles.item}>
            <Text style={styles.smallText}>{t('dq-model-version')}:</Text>
            <Text style={styles.smallText}>{project.dqModel.version}</Text>
          </View>
        )}

        {project.stages && (
          <View style={styles.item}>
            <Text style={styles.smallText}>{t('state')}:</Text>
            <Text style={[styles.smallTextBold, styles[state]]}>
              {capitalize(t(getName(state)))}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (errorData || !project) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={[styles.smallText, { color: 'red' }]}>{errorData}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const getState = (stage: Stage): State => {
    return project.stages.find(s => s.stage === stage)?.status ?? State.TO_DO;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderProjectInfo(project)}

        <View style={styles.dividerStyle} />

        {Object.values(Stage).map(stage => {
          if (!selection?.stages[stage]?.selected) return null;
          return (
            <StageDataPDF
              key={stage}
              project={project}
              stage={stage}
              state={getState(stage)}
              selectedActivities={selection?.stages[stage]?.activities}
              problems={problems}
              estimation={estimation}
              contextComponents={contextComponents}
              interaction={interaction}
              organizationElements={organizationElements}
              dataProfilingPerTable={dataProfilingPerTable}
            />
          );
        })}
      </Page>

      {selection?.dqProblems && problems && (
        <Page size="A4" style={styles.page}>
          <DqProblemsPDF problems={problems} />
        </Page>
      )}

      {selection?.contextModel && contextComponents && (
        <Page size="A4" style={styles.page}>
          <ContextModelPDF contextComponents={contextComponents} />
        </Page>
      )}
    </Document>
  );
};
