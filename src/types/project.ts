import { ContextType } from "./context";
import { Stage } from "./stage";
import { State } from "./state";

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  state: State;
  stage: Stage;
  context: ContextType;
}

export type ProjectErrorsType = {
  name?: string;
};
