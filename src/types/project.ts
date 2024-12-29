import { ContextType } from "./context";
import { Stage } from "./stage";
import { State } from "./state";

export interface ProjectType {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  state: State;
  stage: Stage;
  context: ContextType;
}
