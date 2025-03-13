export interface ContextType {
  id: number;
  name: string;
  version: string;
  previousVersion: ContextType | null;
}
