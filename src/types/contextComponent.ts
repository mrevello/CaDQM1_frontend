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

export const mockconstContextComponents: ContextComponentsType = {
  applicationDomain: {
    title: "Application Domain",
    columns: ["ID", "Description"],
    data: [{ id: 1, description: "Finance sector" }],
  },
  businessRule: {
    title: "Business Rule",
    columns: ["ID", "Statement", "Semantic"],
    data: [
      { id: 2, statement: "Rule 1", semantic: "Logical" },
      { id: 22, statement: "Rule 2", semantic: "Logical large description" },
    ],
  },
  dataFiltering: {
    title: "Data Filtering",
    columns: ["ID", "Statement", "Description", "Task At Hand"],
    data: [
      {
        id: 3,
        statement: "Filter 1",
        description: "Basic filter",
        task_at_hand: 1,
      },
    ],
  },
  dqMetadata: {
    title: "DQ Metadata",
    columns: ["ID", "Path", "Description", "Measurement"],
    data: [
      {
        id: 4,
        path: "/data",
        description: "Metadata details",
        measurement: "Accuracy",
      },
    ],
  },
  dqRequirement: {
    title: "DQ Requirement",
    columns: ["ID", "Statement", "Description", "Data Filtering", "User Type"],
    data: [
      {
        id: 5,
        statement: "Quality Check",
        description: "Check all data",
        data_filtering: [],
        user_type: 1,
      },
    ],
  },
  otherData: {
    title: "Other Data",
    columns: ["ID", "Path", "Description", "Owner"],
    data: [
      { id: 6, path: "/other", description: "Other metadata", owner: "Admin" },
    ],
  },
  otherMetadata: {
    title: "Other Metadata",
    columns: ["ID", "Path", "Description", "Author", "Last Update"],
    data: [
      {
        id: 7,
        path: "/meta",
        description: "Extra metadata",
        author: "User",
        last_update: "2025-01-01",
      },
    ],
  },
  systemRequirement: {
    title: "System Requirement",
    columns: ["ID", "Statement", "Description"],
    data: [
      { id: 8, statement: "High performance", description: "Optimize speed" },
    ],
  },
  taskAtHand: {
    title: "Task At Hand",
    columns: ["ID", "Name", "Purpose"],
    data: [{ id: 9, name: "Data analysis", purpose: "Improve insights" }],
  },
  userType: {
    title: "User Type",
    columns: ["ID", "Name", "Characteristics"],
    data: [{ id: 10, name: "Admin", characteristics: "Full access" }],
  },
};
