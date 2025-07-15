import { View } from '@react-pdf/renderer';
import { styles } from './../style';
import { useTranslation } from 'react-i18next';
import {
  ContextComponent,
  ContextComponentsType,
  ContextComponentType,
  ApplicationDomain,
  BusinessRule,
  DataFiltering,
  DQMetadata,
  DQRequirement,
  OtherData,
  SystemRequirement,
  OtherMetadata,
  TaskAtHand,
  UserType,
  getComponentPrefix,
} from '../../../types/contextComponent';
import { ContextComponentTable } from '../ContextComponentTable';

interface ContextComponentsProps {
  contextComponents: ContextComponentsType;
}

export const ContextComponentsPDF: React.FC<ContextComponentsProps> = ({ contextComponents }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      {Object.entries(contextComponents).map(([key, component]) => {
        if (!component) return null;
        return (
          <ContextComponentTable
            key={key}
            title={t(component.type)}
            data={getComponentData(component.data, component.type)}
          />
        );
      })}
    </View>
  );
};

const getComponentData = (
  components: ContextComponent[],
  type: ContextComponentType
): { [key: string]: string }[] => {
  return components.map((component: ContextComponent) => {
    return componentData(component, type);
  });
};

const componentData = (
  component: ContextComponent,
  type: ContextComponentType
): { [key: string]: string } => {
  switch (type) {
    case ContextComponentType.APPLICATION_DOMAIN:
      return {
        id: getComponentPrefix(type) + component.id,
        description: (component as ApplicationDomain).description,
      };
    case ContextComponentType.BUSINESS_RULE:
      return {
        id: getComponentPrefix(type) + component.id,
        statement: (component as BusinessRule).statement,
        semantic: (component as BusinessRule).semantic,
      };
    case ContextComponentType.DATA_FILTERING:
      return {
        id: getComponentPrefix(type) + component.id,
        statement: (component as DataFiltering).statement,
        description: (component as DataFiltering).description,
        task_at_hand: (component as DataFiltering).taskAtHand?.name ?? '',
      };
    case ContextComponentType.DQ_METADATA:
      return {
        id: getComponentPrefix(type) + component.id,
        path: (component as DQMetadata).path,
        description: (component as DQMetadata).description,
        measurement: (component as DQMetadata).measurement,
      };
    case ContextComponentType.DQ_REQUIREMENT:
      return {
        id: getComponentPrefix(type) + component.id,
        statement: (component as DQRequirement).statement,
        description: (component as DQRequirement).description,
        user_type: (component as DQRequirement).userType?.name ?? '',
      };
    case ContextComponentType.OTHER_DATA:
      return {
        id: getComponentPrefix(type) + component.id,
        path: (component as OtherData).path,
        owner: (component as OtherData).owner,
        description: (component as OtherData).description,
      };
    case ContextComponentType.OTHER_METADATA:
      return {
        id: getComponentPrefix(type) + component.id,
        path: (component as OtherMetadata).path,
        description: (component as OtherMetadata).description,
        author: (component as OtherMetadata).author,
      };
    case ContextComponentType.SYSTEM_REQUIREMENT:
      return {
        id: getComponentPrefix(type) + component.id,
        statement: (component as SystemRequirement).statement,
        description: (component as SystemRequirement).description,
      };
    case ContextComponentType.TASK_AT_HAND:
      return {
        id: getComponentPrefix(type) + component.id,
        name: (component as TaskAtHand).name,
        purpose: (component as TaskAtHand).purpose,
      };
    case ContextComponentType.USER_TYPE:
      return {
        id: getComponentPrefix(type) + component.id,
        name: (component as UserType).name,
        characteristics: (component as UserType).characteristics,
      };
  }
};
