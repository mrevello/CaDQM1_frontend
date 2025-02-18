export enum Stage {
  ST1 = "ST1",
  ST2 = "ST2",
  ST3 = "ST3",
  ST4 = "ST4",
  ST5 = "ST5",
  ST6 = "ST6",
}

export const getName = (stage: Stage) => {
  switch (stage) {
    case Stage.ST1:
      return "stage-1-name";
    case Stage.ST2:
      return "stage-2-name";
    case Stage.ST3:
      return "stage-3-name";
    case Stage.ST4:
      return "stage-4-name";
    case Stage.ST5:
      return "stage-5-name";
    case Stage.ST6:
      return "stage-6-name";
  }
};

export const getTitle = (stage: Stage) => {
  switch (stage) {
    case Stage.ST1:
      return "stage-1-title";
    case Stage.ST2:
      return "stage-2-title";
    case Stage.ST3:
      return "stage-3-title";
    case Stage.ST4:
      return "stage-4-title";
    case Stage.ST5:
      return "stage-5-title";
    case Stage.ST6:
      return "stage-6-title";
  }
};

export const getSteps = (stage: Stage) => {
  switch (stage) {
    case Stage.ST1:
      return [
        { label: "A01", path: "a01" },
        { label: "A02", path: "a02" },
        { label: "A03", path: "a03" },
        { label: "A04", path: "a04" },
      ];
    default:
      return [];
    // case Stage.ST2:
    // case Stage.ST3:
    // case Stage.ST4:
    // case Stage.ST5:
    // case Stage.ST6:
  }
};
