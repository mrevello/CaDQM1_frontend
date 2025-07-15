import { Text, View } from '@react-pdf/renderer';
import { styles, textStyles } from '../style';
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
import {
  ContextComponent,
  ContextComponentsType,
  isEmptyContextComponentsType,
} from '../../../types/contextComponent';
import { DataProfilingReport, ReviewPDFData } from '../types';
import { SchemaSQL } from '../../../types/dataProfiling';

interface ActivityDataPDFProps {
  activity: Activity;
  stage: Stage;
  project: Project;
  problems?: Problem[];
  estimation?: Estimation;
  contextComponents?: ContextComponentsType;
  organizationElements?: ReviewPDFData;
  interaction?: ReviewPDFData;
  dataProfilingPerTable?: DataProfilingReport[];
  schema?: SchemaSQL;
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
  schema,
}) => {
  const { t } = useTranslation();

  const problemsByStage = problems?.filter((problem: Problem) => {
    return problem.stage === stage;
  });

  const componentsByStage = contextComponents
    ? Object.entries(contextComponents).reduce((acc, [key, component]) => {
        if (component) {
          const filteredData = component.data.filter(
            (item: ContextComponent) => item.stage === stage
          );
          if (filteredData.length > 0) {
            acc[key as keyof ContextComponentsType] = {
              ...component,
              data: filteredData,
            };
          } else {
            acc[key as keyof ContextComponentsType] = null;
          }
        } else {
          acc[key as keyof ContextComponentsType] = null;
        }
        return acc;
      }, {} as ContextComponentsType)
    : null;

  const renderActivityContent = () => {
    switch (activity) {
      case Activity.A01:
        if (!project.dataAtHand) return <ActivityErrorPDF />;
        return <A01ContentPDF dataAtHand={project.dataAtHand} />;

      case Activity.A02:
        if (!organizationElements) return <ActivityErrorPDF />;
        return <A02ContentPDF organizationElements={organizationElements} />;

      case Activity.A03:
        if (!problemsByStage || problemsByStage.length === 0) return <ActivityErrorPDF />;
        return <A03ContentPDF problems={problemsByStage} />;

      case Activity.A04:
      case Activity.A07:
        if (!componentsByStage || isEmptyContextComponentsType(componentsByStage))
          return <ActivityErrorPDF />;
        return <A04ContentPDF contextComponents={componentsByStage} />;
      case Activity.A05:
        if (!dataProfilingPerTable) return <ActivityErrorPDF />;
        return <A05ContentPDF dataProfilingPerTable={dataProfilingPerTable} schema={schema} />;

      case Activity.A06:
        if (
          !estimation ||
          ((!estimation.facts || estimation.facts.length === 0) &&
            (!estimation.warnings || estimation.warnings.length === 0))
        )
          return <ActivityErrorPDF />;
        return <A06ContentPDF estimation={estimation} />;

      case Activity.A08:
        if (!interaction) return <ActivityErrorPDF />;
        return <A08ContentPDF interaction={interaction} />;

      default:
        return <ActivityErrorPDF />;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={textStyles.labelSmall}>
        {t(getActivityName(activity))} - {t(getActivityTitle(activity))}
      </Text>
      {renderActivityContent()}
    </View>
  );
};

export const ActivityErrorPDF: React.FC = () => {
  const { t } = useTranslation();

  return <Text style={textStyles.metaText}>{t('there-is-no-data-for-this-activity')}</Text>;
};
