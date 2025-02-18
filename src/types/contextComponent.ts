interface ContextComponent {
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
  data_filtering: any[];
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
  last_update: string;
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

export interface ContextComponentData<T> {
  title: string;
  columns: string[];
  data: T[];
}

export interface ContextComponentsType {
  applicationDomain: ContextComponentData<ApplicationDomain>;
  businessRule: ContextComponentData<BusinessRule>;
  dataFiltering: ContextComponentData<DataFiltering>;
  dqMetadata: ContextComponentData<DQMetadata>;
  dqRequirement: ContextComponentData<DQRequirement>;
  otherData: ContextComponentData<OtherData>;
  otherMetadata: ContextComponentData<OtherMetadata>;
  systemRequirement: ContextComponentData<SystemRequirement>;
  taskAtHand: ContextComponentData<TaskAtHand>;
  userType: ContextComponentData<UserType>;
}
