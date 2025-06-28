import { Text, View } from '@react-pdf/renderer';
import { styles, textStyles } from '../style';
import { stateStyles } from '../style';
import { stageDataPDFStyles } from './style';
import { getStageActivities, getStageTitle } from '../../../types/stage';
import { StageProps } from '../types';
import { useTranslation } from 'react-i18next';
import { ActivityDataPDF } from '../ActivityDataPDF';
import { Activity } from '../../../types/activity';
import { getName, State } from '../../../types/state';

interface ExtendedStageProps extends StageProps {
  selectedActivities?: {
    [key in Activity]?: boolean;
  };
}

export const StageDataPDF: React.FC<ExtendedStageProps> = ({
  project,
  stage,
  selectedActivities,
  problems,
  estimation,
  contextComponents,
  interaction,
  organizationElements,
  dataProfilingPerTable,
  schema,
}) => {
  const { t } = useTranslation();

  const activities = getStageActivities(stage);

  const stageState = project.stages.find(s => s.stage === stage)?.status ?? State.TO_DO;

  return (
    <View style={styles.section}>
      <View style={stageDataPDFStyles.stageTitle}>
        <Text style={textStyles.label}>{t(getStageTitle(stage))}</Text>
        <Text style={[stateStyles.text, stateStyles[stageState]]}>{t(getName(stageState))}</Text>
      </View>

      <View style={stageDataPDFStyles.stagesContainer}>
        {activities.map(activity => {
          if (selectedActivities && !selectedActivities[activity]) return null;
          return (
            <ActivityDataPDF
              key={activity}
              activity={activity}
              stage={stage}
              project={project}
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
      </View>
    </View>
  );
};
