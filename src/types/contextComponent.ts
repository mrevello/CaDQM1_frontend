export enum ContextComponentType {
  APPLICATION_DOMAIN = "application-domain",
  BUSINESS_RULE = "business-rule",
  DATA_FILTERING = "data-filtering",
  DQ_METADATA = "dq-metadata",
  DQ_REQUIREMENT = "dq-requirement",
  OTHER_DATA = "other-data",
  OTHER_METADATA = "other-metadata",
  SYSTEM_REQUIREMENT = "system-requirement",
  TASK_AT_HAND = "task-at-hand",
  USER_TYPE = "user-type",
}

export interface ContextComponent {
  id: number;
}

interface ApplicationDomain extends ContextComponent {
  description: string;
}

interface BusinessRule extends ContextComponent {
  statement: string;
  semantic: string;
}

interface DataFiltering extends ContextComponent {
  statement: string;
  description: string;
  task_at_hand: number;
}

interface DQMetadata extends ContextComponent {
  path: string;
  description: string;
  measurement: string;
}

interface DQRequirement extends ContextComponent {
  statement: string;
  description: string;
  data_filtering: DataFiltering[];
  user_type: number;
}

interface OtherData extends ContextComponent {
  path: string;
  description: string;
  owner: string;
}

interface OtherMetadata extends ContextComponent {
  path: string;
  description: string;
  author: string;
}

interface SystemRequirement extends ContextComponent {
  statement: string;
  description: string;
}

interface TaskAtHand extends ContextComponent {
  name: string;
  purpose: string;
}

interface UserType extends ContextComponent {
  name: string;
  characteristics: string;
}

export interface ContextComponentData<T extends ContextComponent> {
  title: string;
  columns: string[];
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
