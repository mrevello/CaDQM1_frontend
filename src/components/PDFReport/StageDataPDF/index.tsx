import { Text, View } from '@react-pdf/renderer';
import { styles } from '../style';
import { stageDataPDFStyles } from './style';
import { getStageActivities, getStageTitle } from '../../../types/stage';
import { StageProps } from '../types';
import { useTranslation } from 'react-i18next';
import { ActivityDataPDF } from '../ActivityDataPDF';
import { Activity } from '../../../types/activity';
import { getName } from '../../../types/state';

interface ExtendedStageProps extends StageProps {
  selectedActivities?: {
    [key in Activity]?: boolean;
  };
}

export const StageDataPDF: React.FC<ExtendedStageProps> = ({
  project,
  stage,
  state,
  selectedActivities,
  problems,
  estimation,
  contextComponents,
  interaction,
  organizationElements,
  dataProfilingPerTable,
}) => {
  const { t } = useTranslation();

  const activities = getStageActivities(stage);

  return (
    <View style={styles.section}>
      <View style={stageDataPDFStyles.stageTitle}>
        <Text style={styles.label}>{t(getStageTitle(stage))}</Text>
        <Text style={[styles.smallTextBold, styles[state]]}>{t(getName(state))}</Text>
      </View>

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
          />
        );
      })}
    </View>
  );
};
