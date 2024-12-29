import { ContextType } from "../types/context";
import { ContextComponentsType } from "../types/contextComponent";
import { ProjectType } from "../types/project";
import { Stage } from "../types/stage";
import { State } from "../types/state";

export const ContextComponents: ContextComponentsType = {
  applicationDomain: {
    title: "application-domain",
    columns: ["description"],
    data: [
      {
        id: 1,
        description: "Description for Application Domain 1",
      },
      {
        id: 2,
        description: "Description for Application Domain 2",
      },
    ],
  },
  businessRule: {
    title: "business-rules",
    columns: ["statement", "semantic"],
    data: [
      {
        id: 3,
        statement: "Business Rule Statement 1",
        semantic: "Semantic 1",
      },
      {
        id: 4,
        statement: "Business Rule Statement 2",
        semantic: "Semantic 2",
      },
    ],
  },
  dataFiltering: {
    title: "data-filtering",
    columns: ["statement", "description", "task_at_hand"],
    data: [
      {
        id: 5,
        statement: "Data Filtering Statement 1",
        description: "Description for Data Filtering 1",
        task_at_hand: 7,
      },
      {
        id: 6,
        statement: "Data Filtering Statement 2",
        description: "Description for Data Filtering 2",
        task_at_hand: 8,
      },
    ],
  },
  dqMetadata: {
    title: "dq-metadata",
    columns: ["path", "description", "measurement"],
    data: [
      {
        id: 7,
        path: "/path/to/dqmetadata1",
        description: "Description for DQMetadata 1",
        measurement: "Measurement 1",
      },
      {
        id: 8,
        path: "/path/to/dqmetadata2",
        description: "Description for DQMetadata 2",
        measurement: "Measurement 2",
      },
    ],
  },
  dqRequirement: {
    title: "dq-requirements",
    columns: ["statement", "description", "data_filtering", "user_type"],
    data: [
      {
        id: 9,
        statement: "DQ Requirement Statement 1",
        description: "Description for DQ Requirement 1",
        data_filtering: [],
        user_type: 1,
      },
      {
        id: 10,
        statement: "DQ Requirement Statement 2",
        description: "Description for DQ Requirement 2",
        data_filtering: [],
        user_type: 2,
      },
    ],
  },
  otherData: {
    title: "other-data",
    columns: ["path", "description", "owner"],
    data: [
      {
        id: 11,
        path: "/path/to/otherdata1",
        description: "Description for OtherData 1",
        owner: "Owner 1",
      },
      {
        id: 12,
        path: "/path/to/otherdata2",
        description: "Description for OtherData 2",
        owner: "Owner 2",
      },
    ],
  },
  otherMetadata: {
    title: "other-metadata",
    columns: ["path", "description", "author", "last_update"],
    data: [
      {
        id: 13,
        path: "/path/to/othermetadata1",
        description: "Description for OtherMetadata 1",
        author: "Author 1",
        last_update: "2024-11-26",
      },
      {
        id: 14,
        path: "/path/to/othermetadata2",
        description: "Description for OtherMetadata 2",
        author: "Author 2",
        last_update: "2024-11-27",
      },
    ],
  },
  systemRequirement: {
    title: "system-requirements",
    columns: ["statement", "description"],
    data: [
      {
        id: 15,
        statement: "System Requirement Statement 1",
        description: "Description for System Requirement 1",
      },
      {
        id: 16,
        statement: "System Requirement Statement 2",
        description: "Description for System Requirement 2",
      },
    ],
  },
  taskAtHand: {
    title: "task-at-hand",
    columns: ["name", "purpose"],
    data: [
      {
        id: 17,
        name: "Task 1",
        purpose: "Purpose of Task 1",
      },
      {
        id: 18,
        name: "Task 2",
        purpose: "Purpose of Task 2",
      },
    ],
  },
  userType: {
    title: "user-types",
    columns: ["name", "characteristics"],
    data: [
      {
        id: 19,
        name: "User Type 1",
        characteristics: "Characteristics for User Type 1",
      },
      {
        id: 20,
        name: "User Type 2",
        characteristics: "Characteristics for User Type 2",
      },
    ],
  },
};

export const Contexts: ContextType[] = [
  {
    id: 1,
    name: "Context A",
    version: "1.0",
    previousVersion: null,
  },
  {
    id: 2,
    name: "Context B",
    version: "2.0",
    previousVersion: null,
  },
];

export const MockProjects: ProjectType[] = [
  {
    id: "1",
    name: "Project 1",
    description: "A project to explore features.",
    createdAt: new Date("2024-01-01"),
    state: State.DONE,
    stage: Stage.ST1,
    context: Contexts[0],
  },
  {
    id: "2",
    name: "Project 1",
    description: "A project for 2 testing.",
    createdAt: new Date("2024-02-15"),
    state: State.IN_PROGRESS,
    stage: Stage.ST3,
    context: Contexts[1],
  },
  {
    id: "3",
    name: "Project 3",
    description: "Final project in the 3 series.",
    createdAt: new Date("2024-03-20"),
    state: State.TO_DO,
    stage: Stage.ST6,
    context: Contexts[0],
  },
];
