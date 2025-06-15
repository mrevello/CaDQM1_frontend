import { themePalette } from "../config/theme.config";

export enum State {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const getName = (state: State) => {
  switch (state) {
    case State.TO_DO:
      return "to-do";
    case State.IN_PROGRESS:
      return "in-progress";
    case State.DONE:
      return "done";
  }
};

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
      return themePalette.GRAY_TEXT;
    case State.IN_PROGRESS:
      return themePalette.INFO;
    case State.DONE:
      return themePalette.SUCCESS;
    default:
      return "transparent";
  }
};

export const getStateColor = (state: State) => {
  switch (state) {
    case State.TO_DO:
      return "grey";
    case State.IN_PROGRESS:
      return "info";
    case State.DONE:
      return "success";
    default:
      return "grey";
  }
};

export const getStateIndicatorColor = (state: State) => {
  switch (state) {
    case State.TO_DO:
      return "#8f9fb3";
    case State.IN_PROGRESS:
      return "#0c66e4";
    case State.DONE:
      return "#216E4E";
    default:
      return "transparent";
  }
};
