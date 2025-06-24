export type Context = {
  id: number;
  name: string;
  version: string;
  previousVersion: Context | null;
};

export type ContextResponse = {
  id: number;
  name: string;
  version: string;
  previous_version: number | null;
};
