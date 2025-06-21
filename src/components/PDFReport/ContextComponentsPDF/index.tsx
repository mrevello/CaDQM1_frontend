import { Text, View } from '@react-pdf/renderer';
import { styles } from './../style';
import { useTranslation } from 'react-i18next';
import {
  ContextComponent,
  ContextComponentsType,
  emptyContextComponentsType,
} from '../../../types/contextComponent';
import { Stage } from '../../../types/stage';
import { styles as compStyles } from './style';

interface ContextComponentsProps {
  contextComponents: ContextComponentsType;
  stage?: Stage;
}

export const ContextComponentsPDF: React.FC<ContextComponentsProps> = ({
  contextComponents,
  stage,
}) => {
  const { t } = useTranslation();

  const filteredContextComponents: ContextComponentsType =
    contextComponents && stage
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
      : (contextComponents ?? emptyContextComponentsType);

  return (
    <View style={styles.section}>
      {Object.entries(filteredContextComponents).map(([key, component]) => {
        if (!component) return null;
        return (
          <View key={key} style={compStyles.componentView}>
            <Text style={styles.labelSmall}>{t(component.type)}</Text>
            {component.data.map((item: ContextComponent, index: number) => (
              <View key={index} style={compStyles.itemComponent}>
                {Object.entries(item).map(([field, value]) => {
                  if (field === 'id' || field === 'stage' || field === 'isSuggestion') return null;
                  return (
                    <View key={field} style={compStyles.labeledValue}>
                      <Text style={compStyles.componentLabel}>{t(field)}: </Text>
                      <Text key={field} style={styles.smallText}>
                        {value}
                      </Text>
                    </View>
                  );
                })}
                <View style={styles.dividerStyle} />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};
