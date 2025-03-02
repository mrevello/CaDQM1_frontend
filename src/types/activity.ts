export enum Activity {
  A01 = "A01",
  A02 = "A02",
  A03 = "A03",
  A04 = "A04",
  A05 = "A05",
  A06 = "A06",
  A07 = "A07",
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
  [Activity.A03]: {
    name: "activity-3-name",
    title: "activity-3-title",
    description: "activity-3-description",
  },
  [Activity.A04]: {
    name: "activity-4-name",
    title: "activity-4-title",
    description: "activity-4-description",
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
