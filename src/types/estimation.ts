export type Estimation = {
  id: number;
  text: string;
  warnings?: string[];
  facts?: string[];
};

export type EstimationType = 'warnings' | 'facts';

export type EstimationResponse = {
  estimation_id: number;
  estimation: {
    warnings?: string[];
    facts?: string[];
  };
  manual_facts: string[];
};
