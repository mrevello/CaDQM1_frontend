import { Stage } from "./stage";

export enum Phase {
  P1 = "phase-1",
  P2 = "phase-2",
  P3 = "phase-3",
}

const PHASE_STAGE_MAP: Record<Phase, Stage[]> = {
  [Phase.P1]: [Stage.ST1, Stage.ST2, Stage.ST3],
  [Phase.P2]: [Stage.ST4, Stage.ST5, Stage.ST6],
  [Phase.P3]: [Stage.ST7, Stage.ST8, Stage.ST9],
};

export function getPhaseStages(phase: Phase): Stage[] {
  return PHASE_STAGE_MAP[phase] || [];
}
