import { Text, View } from '@react-pdf/renderer';
import { Project, projectStatus } from '../../../types/project';
import { useTranslation } from 'react-i18next';
import { styles } from './style';
import { styles as commonStyles, textStyles } from '../style';
import { stateStyles } from '../style';
import { capitalize } from '@mui/material';
import { getName } from '../../../types/state';

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface ProjectInfoPDFProps {
  project: Project;
}

export const ProjectInfoPDF: React.FC<ProjectInfoPDFProps> = ({ project }) => {
  const { t } = useTranslation();
  const state = projectStatus(project.stages);
  return (
    <View style={commonStyles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={styles.projectTitle}>
          {t('project')}: {project.name}
        </Text>
        {project.description && (
          <Text style={styles.projectDescription}>{project.description}</Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {project.createdAt && (
          <Text style={textStyles.metaText}>{formatDate(project.createdAt)}</Text>
        )}
        {project.context?.version && (
          <Text style={textStyles.metaText}>
            {t('context-version')}: {project.context?.version}
          </Text>
        )}
        {project.stages && (
          <View style={styles.item}>
            <Text style={[stateStyles.text, stateStyles[state]]}>
              {capitalize(t(getName(state)))}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
