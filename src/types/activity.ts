// Activities: To carry out each stage, a set of activities is executed. Some activities
// are executed at more than one stage.

export enum Activity {
  A01 = "a01",
  A02 = "a02",
  A03A04 = "a03a04",
  A05 = "a05",
  A06 = "a06",
  A07 = "a07",
  A08 = "a08",
}

interface ActivityInfo {
  name: string;
  title: string;
  description: string;
}

const ACTIVITY_INFO: Record<Activity, ActivityInfo> = {
  [Activity.A01]: {
    name: "activity-1-name",
    title: "activity-1-title",
    description: "activity-1-description",
  },
  [Activity.A02]: {
    name: "activity-2-name",
    title: "activity-2-title",
    description: "activity-2-description",
  },
  [Activity.A03A04]: {
    name: "activity-3-4-name",
    title: "activity-3-4-title",
    description: "activity-3-4-description",
  },
  [Activity.A05]: {
    name: "activity-5-name",
    title: "activity-5-title",
    description: "activity-5-description",
  },
  [Activity.A06]: {
    name: "activity-6-name",
    title: "activity-6-title",
    description: "activity-6-description",
  },
  [Activity.A07]: {
    name: "activity-7-name",
    title: "activity-7-title",
    description: "activity-7-description",
  },
  [Activity.A08]: {
    name: "activity-8-name",
    title: "activity-8-title",
    description: "activity-8-description",
  },
};

export function getActivityName(activity: Activity) {
  return ACTIVITY_INFO[activity].name;
}
export function getActivityTitle(activity: Activity) {
  return ACTIVITY_INFO[activity].title;
}
export function getActivityDescription(activity: Activity) {
  return ACTIVITY_INFO[activity].description;
}
