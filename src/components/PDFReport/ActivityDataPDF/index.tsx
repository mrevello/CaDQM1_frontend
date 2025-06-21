import { Text, View } from '@react-pdf/renderer';
import { styles } from '../style';
import { Activity, getActivityName, getActivityTitle } from '../../../types/activity';
import { Stage } from '../../../types/stage';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../types/project';
import { A01ContentPDF } from '../A01ContentPDF';
import { A02ContentPDF } from '../A02ContentPDF';
import { A03ContentPDF } from '../A03ContentPDF';
import { A04ContentPDF } from '../A04ContentPDF';
import { A05ContentPDF } from '../A05ContentPDF';
import { A06ContentPDF } from '../A06ContentPDF';
import { A08ContentPDF } from '../A08ContentPDF';
import { Problem } from '../../../types/problem';
import { Estimation } from '../../../types/estimation';
import { ContextComponentsType } from '../../../types/contextComponent';
import { DataProfilingReport, ReviewPDFData } from '../types';

interface ActivityDataPDFProps {
  activity: Activity;
  stage: Stage;
  project: Project;
  problems: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  organizationElements?: ReviewPDFData;
  interaction?: ReviewPDFData;
  dataProfilingPerTable?: DataProfilingReport[];
}

export const ActivityDataPDF: React.FC<ActivityDataPDFProps> = ({
  activity,
  stage,
  project,
  problems,
  estimation,
  contextComponents,
  organizationElements,
  interaction,
  dataProfilingPerTable,
}) => {
  const { t } = useTranslation();

  const problemsByStage = problems.filter((problem: Problem) => {
    return true;
    // return problem.stage === stage;
  });

  const renderActivityContent = () => {
    switch (activity) {
      case Activity.A01:
        return <A01ContentPDF dataAtHand={project.dataAtHand} />;

      case Activity.A02:
        return <A02ContentPDF organizationElements={organizationElements} />;

      case Activity.A03:
        return <A03ContentPDF problems={problemsByStage} />;

      case Activity.A04:
      case Activity.A07:
        return <A04ContentPDF contextComponents={contextComponents} stage={stage} />;
      case Activity.A05:
        return <A05ContentPDF dataProfilingPerTable={dataProfilingPerTable} />;

      case Activity.A06:
        return <A06ContentPDF estimation={estimation} />;

      case Activity.A08:
        return <A08ContentPDF interaction={interaction} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.labelSmall}>
        {t(getActivityName(activity))} - {t(getActivityTitle(activity))}
      </Text>
      {renderActivityContent()}
    </View>
  );
};
