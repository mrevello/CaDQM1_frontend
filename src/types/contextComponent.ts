import { ContextAnalysisResponse } from '../api/review.api';
import { Stage } from './stage';

export enum ContextComponentType {
  APPLICATION_DOMAIN = 'application-domain',
  BUSINESS_RULE = 'business-rule',
  DATA_FILTERING = 'data-filtering',
  DQ_METADATA = 'dq-metadata',
  DQ_REQUIREMENT = 'dq-requirement',
  OTHER_DATA = 'other-data',
  OTHER_METADATA = 'other-metadata',
  SYSTEM_REQUIREMENT = 'system-requirement',
  TASK_AT_HAND = 'task-at-hand',
  USER_TYPE = 'user-type',
}

export interface ContextComponent {
  id: number;
  stage?: Stage;
  isSuggestion?: boolean;
}

export interface ApplicationDomain extends ContextComponent {
  description: string;
}

export interface BusinessRule extends ContextComponent {
  statement: string;
  semantic: string;
}

export interface DataFiltering extends ContextComponent {
  statement: string;
  description: string;
  task_at_hand: number;
  taskAtHand?: TaskAtHand;
}

export interface DQMetadata extends ContextComponent {
  path: string;
  description: string;
  measurement: string;
}

export interface DQRequirement extends ContextComponent {
  statement: string;
  description: string;
  data_filtering: DataFiltering[];
  user_type: number;
  userType?: UserType;
}

export interface OtherData extends ContextComponent {
  path: string;
  description: string;
  owner: string;
}

export interface OtherMetadata extends ContextComponent {
  path: string;
  description: string;
  author: string;
}

export interface SystemRequirement extends ContextComponent {
  statement: string;
  description: string;
}

export interface TaskAtHand extends ContextComponent {
  name: string;
  purpose: string;
}

export interface UserType extends ContextComponent {
  name: string;
  characteristics: string;
}

export interface ContextComponentData<T extends ContextComponent> {
  type: ContextComponentType;
  data: T[];
}

export interface ContextComponentsType {
  applicationDomain: ContextComponentData<ApplicationDomain> | null;
  businessRule: ContextComponentData<BusinessRule> | null;
  dataFiltering: ContextComponentData<DataFiltering> | null;
  dqMetadata: ContextComponentData<DQMetadata> | null;
  dqRequirement: ContextComponentData<DQRequirement> | null;
  otherData: ContextComponentData<OtherData> | null;
  otherMetadata: ContextComponentData<OtherMetadata> | null;
  systemRequirement: ContextComponentData<SystemRequirement> | null;
  taskAtHand: ContextComponentData<TaskAtHand> | null;
  userType: ContextComponentData<UserType> | null;
}

export const emptyContextComponentsType = {
  applicationDomain: null,
  businessRule: null,
  dataFiltering: null,
  dqMetadata: null,
  dqRequirement: null,
  otherData: null,
  otherMetadata: null,
  systemRequirement: null,
  taskAtHand: null,
  userType: null,
};

export type ContextComponentErrorsType = {
  [ContextComponentType.APPLICATION_DOMAIN]?: {
    description?: string;
  };
  [ContextComponentType.BUSINESS_RULE]?: {
    statement?: string;
    semantic?: string;
  };
  [ContextComponentType.DATA_FILTERING]?: {
    statement?: string;
    description?: string;
    task_at_hand?: string;
  };
  [ContextComponentType.DQ_METADATA]?: {
    path?: string;
    measurement?: string;
    description?: string;
  };
  [ContextComponentType.DQ_REQUIREMENT]?: {
    statement?: string;
    description?: string;
    user_type?: string;
  };
  [ContextComponentType.OTHER_DATA]?: {
    path?: string;
    owner?: string;
    description?: string;
  };
  [ContextComponentType.OTHER_METADATA]?: {
    path?: string;
    description?: string;
    author?: string;
  };
  [ContextComponentType.SYSTEM_REQUIREMENT]?: {
    statement?: string;
    description?: string;
  };
  [ContextComponentType.TASK_AT_HAND]?: {
    name?: string;
    purpose?: string;
  };
  [ContextComponentType.USER_TYPE]?: {
    name?: string;
    characteristics?: string;
  };
};

export const componentTypeToKey: Record<ContextComponentType, keyof ContextComponentsType> = {
  [ContextComponentType.APPLICATION_DOMAIN]: 'applicationDomain',
  [ContextComponentType.BUSINESS_RULE]: 'businessRule',
  [ContextComponentType.DATA_FILTERING]: 'dataFiltering',
  [ContextComponentType.DQ_METADATA]: 'dqMetadata',
  [ContextComponentType.DQ_REQUIREMENT]: 'dqRequirement',
  [ContextComponentType.OTHER_DATA]: 'otherData',
  [ContextComponentType.OTHER_METADATA]: 'otherMetadata',
  [ContextComponentType.SYSTEM_REQUIREMENT]: 'systemRequirement',
  [ContextComponentType.TASK_AT_HAND]: 'taskAtHand',
  [ContextComponentType.USER_TYPE]: 'userType',
};

const analysysType: Record<ContextComponentType, string> = {
  'application-domain': 'application domain',
  'business-rule': 'business rules',
  'data-filtering': 'data filtering requirements',
  'dq-metadata': 'data quality metadata',
  'dq-requirement': 'data quality requirements',
  'other-data': 'other data-related information',
  'other-metadata': 'general metadata',
  'system-requirement': 'system requirements',
  'task-at-hand': 'task',
  'user-type': 'user types',
};

export const createComponent = (
  id: number = Date.now() + Math.random(),
  value: string,
  type: ContextComponentType
): ContextComponent => {
  const base = {
    id: id,
    isSuggestion: true,
  };

  switch (type) {
    case ContextComponentType.APPLICATION_DOMAIN:
      return {
        ...base,
        description: value,
      } as ApplicationDomain;

    case ContextComponentType.BUSINESS_RULE:
      return {
        ...base,
        semantic: value,
      } as BusinessRule;

    case ContextComponentType.DATA_FILTERING:
      return {
        ...base,
        description: value,
      } as DataFiltering;

    case ContextComponentType.DQ_METADATA:
      return {
        ...base,
        description: value,
      } as DQMetadata;

    case ContextComponentType.DQ_REQUIREMENT:
      return {
        ...base,
        description: value,
      } as DQRequirement;

    case ContextComponentType.OTHER_DATA:
      return {
        ...base,
        description: value,
      } as OtherData;

    case ContextComponentType.OTHER_METADATA:
      return {
        ...base,
        description: value,
      } as OtherMetadata;

    case ContextComponentType.SYSTEM_REQUIREMENT:
      return {
        ...base,
        description: value,
      } as SystemRequirement;

    case ContextComponentType.TASK_AT_HAND:
      return {
        ...base,
        name: value,
      } as TaskAtHand;

    case ContextComponentType.USER_TYPE:
      return {
        ...base,
        name: value,
      } as UserType;

    default:
      return base;
  }
};

export const getValue = (component: ContextComponent, type: ContextComponentType): string => {
  let value: string;

  switch (type) {
    case ContextComponentType.APPLICATION_DOMAIN:
      value = (component as ApplicationDomain).description;
      break;

    case ContextComponentType.BUSINESS_RULE:
      value = (component as BusinessRule).semantic;
      break;

    case ContextComponentType.DATA_FILTERING:
      value = (component as DataFiltering).description;
      break;

    case ContextComponentType.DQ_METADATA:
      value = (component as DQMetadata).description;
      break;

    case ContextComponentType.DQ_REQUIREMENT:
      value = (component as DQRequirement).description;
      break;

    case ContextComponentType.OTHER_DATA:
      value = (component as OtherData).description;
      break;

    case ContextComponentType.OTHER_METADATA:
      value = (component as OtherMetadata).description;
      break;

    case ContextComponentType.SYSTEM_REQUIREMENT:
      value = (component as SystemRequirement).description;
      break;

    case ContextComponentType.TASK_AT_HAND:
      value = (component as TaskAtHand).name;
      break;

    case ContextComponentType.USER_TYPE:
      value = (component as UserType).name;
      break;

    default:
      value = '';
  }
  return value;
};

export const mapAnalysisToComponents = (
  response: ContextAnalysisResponse
): ContextComponentsType => {
  const result: ContextComponentsType = {
    applicationDomain: getComponentAnalysis(ContextComponentType.APPLICATION_DOMAIN, response),
    businessRule: getComponentAnalysis(ContextComponentType.BUSINESS_RULE, response),
    dataFiltering: getComponentAnalysis(ContextComponentType.DATA_FILTERING, response),
    dqMetadata: getComponentAnalysis(ContextComponentType.DQ_METADATA, response),
    dqRequirement: getComponentAnalysis(ContextComponentType.DQ_REQUIREMENT, response),
    otherData: getComponentAnalysis(ContextComponentType.OTHER_DATA, response),
    otherMetadata: getComponentAnalysis(ContextComponentType.OTHER_METADATA, response),
    systemRequirement: getComponentAnalysis(ContextComponentType.SYSTEM_REQUIREMENT, response),
    taskAtHand: getComponentAnalysis(ContextComponentType.TASK_AT_HAND, response),
    userType: getComponentAnalysis(ContextComponentType.USER_TYPE, response),
  };

  return result;
};

type ComponentMap = {
  [ContextComponentType.APPLICATION_DOMAIN]: ApplicationDomain;
  [ContextComponentType.BUSINESS_RULE]: BusinessRule;
  [ContextComponentType.DATA_FILTERING]: DataFiltering;
  [ContextComponentType.DQ_METADATA]: DQMetadata;
  [ContextComponentType.DQ_REQUIREMENT]: DQRequirement;
  [ContextComponentType.OTHER_DATA]: OtherData;
  [ContextComponentType.OTHER_METADATA]: OtherMetadata;
  [ContextComponentType.SYSTEM_REQUIREMENT]: SystemRequirement;
  [ContextComponentType.TASK_AT_HAND]: TaskAtHand;
  [ContextComponentType.USER_TYPE]: UserType;
};

export const getComponentAnalysis = <K extends ContextComponentType>(
  type: K,
  response: ContextAnalysisResponse
): ContextComponentData<ComponentMap[K]> | null => {
  const key = analysysType[type] as keyof ContextAnalysisResponse;
  const data: string[] = response[key] || [];
  if (!data.length) return null;

  const components = data.map(value => {
    const newComp = createComponent(undefined, value, type);
    return newComp as ComponentMap[K];
  });

  return {
    type,
    data: components,
  };
};

export const mergeComponentData = <T extends ContextComponent>(
  orig: ContextComponentData<T> | null,
  incoming: ContextComponentData<T> | null
): ContextComponentData<T> | null => {
  if (!orig && !incoming) {
    return null;
  }
  if (!orig) {
    return incoming;
  }
  if (!incoming) {
    return orig;
  }

  return {
    type: orig.type,
    data: [...orig.data, ...incoming.data],
  };
};

export const mergeAllComponents = (
  orig: ContextComponentsType,
  incoming: ContextComponentsType
): ContextComponentsType => {
  const merged = {
    applicationDomain: mergeComponentData(orig.applicationDomain, incoming.applicationDomain),
    businessRule: mergeComponentData(orig.businessRule, incoming.businessRule),
    dataFiltering: mergeComponentData(orig.dataFiltering, incoming.dataFiltering),
    dqMetadata: mergeComponentData(orig.dqMetadata, incoming.dqMetadata),
    dqRequirement: mergeComponentData(orig.dqRequirement, incoming.dqRequirement),
    otherData: mergeComponentData(orig.otherData, incoming.otherData),
    otherMetadata: mergeComponentData(orig.otherMetadata, incoming.otherMetadata),
    systemRequirement: mergeComponentData(orig.systemRequirement, incoming.systemRequirement),
    taskAtHand: mergeComponentData(orig.taskAtHand, incoming.taskAtHand),
    userType: mergeComponentData(orig.userType, incoming.userType),
  };

  // Populate references after merging
  return populateContextComponentReferences(merged);
};

// Helper function to populate references between context components
export const populateContextComponentReferences = (
  contextComponents: ContextComponentsType
): ContextComponentsType => {
  let result = { ...contextComponents };

  // Populate task at hand references in data filtering components
  if (result.taskAtHand?.data && result.dataFiltering?.data) {
    const taskAtHandMap = new Map<number, TaskAtHand>();
    result.taskAtHand.data.forEach(task => {
      taskAtHandMap.set(task.id, task);
    });

    const populatedDataFiltering = result.dataFiltering.data.map(dataFiltering => {
      const taskAtHand = taskAtHandMap.get(dataFiltering.task_at_hand);
      return {
        ...dataFiltering,
        taskAtHand: taskAtHand || undefined,
      };
    });

    result = {
      ...result,
      dataFiltering: {
        ...result.dataFiltering,
        data: populatedDataFiltering,
      },
    };
  }

  // Populate user type references in DQ requirement components
  if (result.userType?.data && result.dqRequirement?.data) {
    const userTypeMap = new Map<number, UserType>();
    result.userType.data.forEach(userType => {
      userTypeMap.set(userType.id, userType);
    });

    const populatedDQRequirements = result.dqRequirement.data.map(dqRequirement => {
      const userType = userTypeMap.get(dqRequirement.user_type);
      console.log('userType', userType);
      return {
        ...dqRequirement,
        userType: userType || undefined,
      };
    });

    result = {
      ...result,
      dqRequirement: {
        ...result.dqRequirement,
        data: populatedDQRequirements,
      },
    };
  }

  return result;
};

export const createContextComponent = (
  id: number,
  type: ContextComponentType,
  data: any
): ContextComponent => {
  const base = {
    id: id,
    isSuggestion: false,
    stage: data.project_stage_info?.stage,
  };

  switch (type) {
    case ContextComponentType.APPLICATION_DOMAIN:
      return {
        ...base,
        description: data.description,
      } as ApplicationDomain;

    case ContextComponentType.BUSINESS_RULE:
      return {
        ...base,
        statement: data.statement,
        semantic: data.semantic,
      } as BusinessRule;

    case ContextComponentType.DATA_FILTERING:
      return {
        ...base,
        statement: data.statement,
        description: data.description,
        task_at_hand: data.task_at_hand,
      } as DataFiltering;

    case ContextComponentType.DQ_METADATA:
      return {
        ...base,
        description: data.description,
        measurement: data.measurement,
        path: data.path,
      } as DQMetadata;

    case ContextComponentType.DQ_REQUIREMENT:
      return {
        ...base,
        description: data.description,
        data_filtering: data.data_filtering,
        user_type: data.user_type,
        statement: data.statement,
      } as DQRequirement;

    case ContextComponentType.OTHER_DATA:
      return {
        ...base,
        description: data.description,
        path: data.path,
        owner: data.owner,
      } as OtherData;

    case ContextComponentType.OTHER_METADATA:
      return {
        ...base,
        description: data.description,
        path: data.path,
        author: data.author,
      } as OtherMetadata;

    case ContextComponentType.SYSTEM_REQUIREMENT:
      return {
        ...base,
        description: data.description,
        statement: data.statement,
      } as SystemRequirement;

    case ContextComponentType.TASK_AT_HAND:
      return {
        ...base,
        name: data.name,
        purpose: data.purpose,
      } as TaskAtHand;

    case ContextComponentType.USER_TYPE:
      return {
        ...base,
        name: data.name,
        characteristics: data.characteristics,
      } as UserType;

    default:
      return base;
  }
};

export const getComponentPrefix = (type: ContextComponentType): string => {
  switch (type) {
    case ContextComponentType.APPLICATION_DOMAIN:
      return 'AD';
    case ContextComponentType.BUSINESS_RULE:
      return 'BR';
    case ContextComponentType.DATA_FILTERING:
      return 'DF';
    case ContextComponentType.DQ_METADATA:
      return 'DQM';
    case ContextComponentType.DQ_REQUIREMENT:
      return 'DQR';
    case ContextComponentType.OTHER_DATA:
      return 'OD';
    case ContextComponentType.OTHER_METADATA:
      return 'OM';
    case ContextComponentType.SYSTEM_REQUIREMENT:
      return 'SR';
    case ContextComponentType.TASK_AT_HAND:
      return 'T';
    case ContextComponentType.USER_TYPE:
      return 'UT';
  }
};

export const isEmptyContextComponentsType = (contextComponents: ContextComponentsType): boolean => {
  return Object.values(contextComponents).every(component => component === null);
};
