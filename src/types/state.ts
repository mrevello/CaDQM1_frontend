import { themePalette } from "../config/theme.config";

export enum State {
  TO_DO = "to-do",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export const getBackgroundColor = (state: State) => {
  switch (state) {
    case State.TO_DO:
      return themePalette.BACKGROUND_GRAY;
    case State.IN_PROGRESS:
      return themePalette.BACKGROUND_INFO;
    case State.DONE:
      return themePalette.BACKGROUND_SUCCESS;
    default:
      return themePalette.BACKGROUND_GRAY;
  }
};

export const getTextColor = (state: State) => {
  switch (state) {
    case State.TO_DO:
      return themePalette.GRAY;
    case State.IN_PROGRESS:
      return themePalette.INFO;
    case State.DONE:
      return themePalette.SUCCESS;
    default:
      return "transparent";
  }
};
